import express from "express";

const router = express.Router();

router.get('/login', async (req, res) => {
    try {
        const applications = await Application.find().populate('applicantId').populate('groupId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
