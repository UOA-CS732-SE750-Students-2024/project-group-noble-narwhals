import express from 'express';
import Application from '../../models/applicationModel.js';
import Group from '../../models/groupModel.js';
import { body, validationResult } from 'express-validator';
import { getApplication } from '../../middleware/entityMiddleware.js';
const router = express.Router();

// get all applications


router.get('/', async (req, res) => {
    try {
        const applications = await Application.find().populate('applicantId').populate('groupId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get application by id
router.get('/:id', getApplication, (req, res) => {
    res.json(res.application);
});

// create a new application
router.post('/',
    [
        body('applicantId').not().isEmpty().withMessage('Applicant ID is required'),
        body('groupId').not().isEmpty().withMessage('Group ID is required'),
        body('message').optional(),
        body('applicationDate').optional().isISO8601().toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            console.log('Starting transaction for new application...');

            const newApplication = new Application({
                applicantId: req.body.applicantId,
                groupId: req.body.groupId,
                message: req.body.message || '',
                applicationDate: req.body.applicationDate || new Date()
            });


            const savedApplication = await newApplication.save({ session });

            // Fetch the group and update it
            const group = await Group.findById(req.body.groupId).session(session);

            if (!group) {
                console.log('No group found with ID:', req.body.groupId);
                throw new Error('Group not found');
            }

            // Check if the applicant's ID is already in the groupApplicants array
            if (!group.groupApplicants.includes(req.body.applicantId)) {
                group.groupApplicants.push(req.body.applicantId);
                console.log('Updated group applicants:', group.groupApplicants);
            }
            // Add the application's ID to the application array
            group.application.push(savedApplication._id);

            await group.save({ session });

            await session.commitTransaction();

            session.endSession();
            res.status(201).json(newApplication);
        } catch (err) {
            console.error('Error during transaction:', err);
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ message: err.message });
        }
    }
);





// update application by id
router.patch('/applications-with-details/:id', getApplication, async (req, res) => {
    if (!res.application) {
        return res.status(404).json({ message: "Application not found" });
    }

    const application = res.application;
    const updates = req.body;
    const allowedUpdates = ['applicationStatus', 'message'];
    const updateFields = Object.keys(updates);

    const isValidOperation = updateFields.every(field => allowedUpdates.includes(field));
    console.log('applicant', application.applicantId);
    console.log('application', application);
    if (!isValidOperation) {
        return res.status(400).json({ message: "Invalid updates, only 'applicationStatus' and 'message' are allowed." });
    }

    updateFields.forEach(field => {
        application[field] = updates[field];
    });

    try {
        await application.save();

        // if application is accepted, add the applicant to the group
        if (application.applicationStatus === 'accepted') {
            const group = await Group.findById(application.groupId);
            if (group) {
                group.groupMembers.push(application.applicantId); // add to group members
                group.groupApplicants.pull(application.applicantId); // remove from group applicants
                await group.save();
            }
        }

        // delete application if it is accepted or rejected
        if (application.applicationStatus === 'accepted' || application.applicationStatus === 'rejected') {
            await Application.findByIdAndDelete(application._id);
            res.json({ message: 'Application processed and deleted successfully' });
        } else {
            const applicationWithDetails = await Application.aggregate([
                { $match: { _id: application._id } },
                {
                    $lookup: {
                        from: "users",
                        localField: "applicantId",
                        foreignField: "_id",
                        as: "applicantDetails"
                    }
                },
                { $unwind: "$applicantDetails" }
            ]);

            if (applicationWithDetails.length > 0) {
                res.json(applicationWithDetails[0]);
            } else {
                res.status(404).json({ message: "Application not found after update." });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating and deleting application." });
    }
});






// delete application by id
router.delete('/:id', getApplication, async (req, res) => {
    try {
        await res.application.remove();
        res.json({ message: 'Deleted Application' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;
