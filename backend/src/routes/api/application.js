import express from 'express';
import Application from '../../models/applicationModel.js';
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
        body('message').not().isEmpty().withMessage('Message is required'),
        body('applicationDate').optional().isISO8601().toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const newApplication = new Application({
                applicantId: req.body.applicantId,
                groupId: req.body.groupId,
                message: req.body.message, 
                applicationDate: req.body.applicationDate || new Date() 
            });
            await newApplication.save();
            res.status(201).json(newApplication);
        } catch (err) {
            res.status(400).json({ message: err.message });
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
    if (!isValidOperation) {
        return res.status(400).json({ message: "Invalid updates, only 'applicationStatus' and 'message' are allowed." });
    }

    // 应用更新到 application 对象
    updateFields.forEach(field => {
        application[field] = updates[field];
    });

    try {
        await application.save();  // 保存更新
        
        // 聚合查询来获取包含用户详细信息的完整申请数据
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating and retrieving application details." });
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
