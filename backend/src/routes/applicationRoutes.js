import express from 'express';
import Application from '../models/applicationModel.js';
import { body, validationResult } from 'express-validator';
import getApplication from '../middleware/applicationMiddleware.js';

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
        body('applicationDate').optional().isISO8601().toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const application = new Application({
            ...req.body
        });

        try {
            const newApplication = await application.save();
            res.status(201).json(newApplication);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// update application by id
router.patch('/:id', getApplication, async (req, res) => {
    if (req.body.applicationStatus != null) {
        res.application.applicationStatus = req.body.applicationStatus;
    }

    try {
        const updatedApplication = await res.application.save();
        res.json(updatedApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
