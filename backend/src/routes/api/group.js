import express from 'express';
import Group from '../../models/groupModel.js'
import Application from '../../models/applicationModel.js';
import { body, validationResult } from 'express-validator';
import { getGroup } from '../../middleware/entityMiddleware.js';
const router = express.Router();

// get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// get group by id
router.get('/:id', getGroup, (req, res) => {
    res.json(res.group);
});
// get group by id with  details populated
router.get('/:id/detail', getGroup, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate({
              path: 'groupMembers',
              select: 'name avatar' 
            })
            .populate({
              path: 'groupApplicants',
              select: 'name message avatar',  
            })
            .populate({
              path: 'application',  
              populate: {           
                path: 'applicantId',
                select: 'name avatar'  
              }
            })
            .populate('groupTags', 'name')  
            .populate({
              path: 'ownerId',
              select: 'name avatar'  
            });

        if (!group) {
            return res.status(404).send('Group not found');
        }
        res.json(group);

    } catch (err) {
        console.error('Error fetching group:', err);
        res.status(500).json({ message: err.message });
    }
});



// create a new group
router.post('/',
    [
        body('groupName').not().isEmpty().withMessage('group name cannot be empty'),
        body('createDate').optional().isISO8601().toDate(),
        body('deadlineDate').optional().isISO8601().toDate(),
        // body('numberOfGroupMember').optional().isInt({ min: 1 }),
        body('groupDescription').optional().isString(),
        body('groupType').not().isEmpty().withMessage('group type cannot be empty'),
        body('maxNumber').optional().isInt({ min: 1 }),
        //body('groupStatus').optional().isIn(['available', 'closed', 'full']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const group = new Group({
            ...req.body,
        });

        try {
            const newGroup = await group.save();
            res.status(201).json(newGroup);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);


// update group by id
router.patch('/update/:id', getGroup, async (req, res) => {
    // update group properties
    Object.entries(req.body).forEach(([key, value]) => {
        res.group[key] = value;
    });

    try {
        const updatedGroup = await res.group.save();
        res.json(updatedGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete group by id
router.delete('/delete/:id', getGroup, async (req, res) => {
    try {
        await res.group.remove();
        res.json({ message: 'Deleted Group' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Route to remove a member from a group
router.patch('/remove-member/:id', getGroup, async (req, res) => {
    const memberId = req.body.memberId;
    const group = res.group;
    console.log(`Group ID from URL: ${req.params.id}`); // Check if ID is received correctly
    console.log(`Group from middleware: ${req.group}`); // Check what the middleware found

    if (!group) {
        return res.status(404).send({ message: 'Group not found' });
    }

    try {
        const index = group.groupMembers.findIndex(id => id.equals(memberId));
        if (index === -1) {
            return res.status(404).send({ message: 'Member not found in the group' });
        }

        group.groupMembers.splice(index, 1);
        await group.save();
        res.send({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error in remove-member route:', error);
        res.status(500).send({ message: "Server error" });
    }
});




// join group by id
router.post('/join/:id', getGroup, async (req, res) => {
    const userId = req.user._id;

    // check if user is already in the group
    if (res.group.groupMembers.includes(userId)) {
        return res.status(400).json({ message: 'User already in the group' });
    }

    // add user to the group
    res.group.groupMembers.push(userId);

    try {
        await res.group.save();
        res.json({ message: 'User added to the group successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




// Join group by applying to it at group info
router.post('/join/:id/group', getGroup, async (req, res) => {
    const userId = req.user._id; 

    // Check if user has already applied
    if (res.group.groupMembers.includes(userId)) {
        return res.status(400).json({ message: 'User already in the group' });
    }

    try {
        // Create a new application
        const newApplication = new Application({
            applicantId: userId,
            groupId: req.params.id,
            message: req.body.message, 
            applicationStatus: 'pending', 
            applicationDate: new Date() 
        });
        await newApplication.save(); 
       
        res.group.application.push(newApplication._id);

        // Add user to the group applicants
        res.group.groupApplicants.push(userId);

        await res.group.save(); // Save the group with the updated applicants and application list
        res.json({ message: 'User added to the group successfully', applicationId: newApplication._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// check if user has applied to a group
router.get('/:groupId/has-applied', async (req, res) => {
    const { userId } = req.query;
    const { groupId } = req.params;
    try {
        const application = await Application.findOne({
            groupId, 
            applicantId: userId
        }).select('applicationStatus');
        if (!application) {
            return res.json({ hasApplied: false, applicationStatus: 'none' });
        }
        return res.json({ hasApplied: true, applicationStatus: application.applicationStatus });
    } catch (err) {
        res.status(500).json({ message: 'Failed to check application status', error: err });
    }
});





// Cancel application to a group
router.post('/cancel-application/:groupId', async (req, res) => {
    const { userId } = req.body;
    const { groupId } = req.params;

    try {
        // Find the application by groupId and userId
        const application = await Application.findOne({
            groupId: groupId,
            applicantId: userId
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Remove the application document
        await Application.findByIdAndDelete(application._id);

        // Update the group document
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Remove the user from groupApplicants
        const applicantIndex = group.groupApplicants.indexOf(userId);
        if (applicantIndex > -1) {
            group.groupApplicants.splice(applicantIndex, 1);
        }

        // Remove the application from the application array
        const applicationIndex = group.application.indexOf(application._id);
        if (applicationIndex > -1) {
            group.application.splice(applicationIndex, 1);
        }

        await group.save();
        res.json({ message: 'Application cancelled successfully' });
    } catch (err) {
        console.error('Failed to cancel application:', err);
        res.status(500).json({ message: 'Failed to cancel application', error: err });
    }
});







export default router;
