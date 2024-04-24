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

// get group by id with  details populated
router.get('/:id', getGroup, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('groupMembers', 'name avatar')
            .populate('groupApplicants', 'name message avatar')
            .populate('groupTags', 'name')
            .populate('ownerId', 'name avatar');

            console.log('Fetched group with populated fields:', group); // Detailed log


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




    



// Join group by applying to it
router.post('/join/:id', getGroup, async (req, res) => {
    const userId = req.user._id; // Ensure user authentication is properly configured to fetch userId

    // Check if user has already applied
    if (res.group.groupApplicants.includes(userId)) {
        return res.status(400).json({ message: 'User already in the group' });
    }

    // Add user to the group applicants
    res.group.groupApplicants.push(userId);

    try {
        // Create a new application
        const newApplication = new Application({
            applicantId: userId,
            groupId: req.params.id,
            message: req.body.message, // Ensure 'message' is being passed in the request body
            applicationStatus: 'pending', // Default application status
            applicationDate: new Date() // Current date as the application date
        });
        await newApplication.save(); // Save the new application
        console.log('New application:', newApplication);
        console.log('message', req.body.message);

        await res.group.save(); // Save the group with the updated applicants list
        res.json({ message: 'User added to the group successfully', applicationId: newApplication._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:groupId/has-applied', async (req, res) => {
    const { userId } = req.query;
    const { groupId } = req.params;
    try {
      const application = await Application.findOne({ groupId, applicantId: userId });
      res.json({ hasApplied: !!application });
    } catch (err) {
      res.status(500).json({ message: 'Failed to check application status', error: err });
    }
  });
  




export default router;
