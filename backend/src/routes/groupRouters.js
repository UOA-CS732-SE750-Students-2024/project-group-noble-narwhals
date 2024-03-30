import express from 'express';
import Group from '../models/groupModel.js'
import getGroup from '../middleware/groupMiddleware.js';
import { body, validationResult } from 'express-validator';

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

// create a new group
router.post( '/', 
    [
        body('groupName').not().isEmpty().withMessage('group name cannot be empty'),
        body('createDate').optional().isISO8601().toDate(),
        body('deadlineDate').optional().isISO8601().toDate(),
        body('numberOfGroupMember').optional().isInt({ min: 1 }),
        body('groupDescription').optional().isString(),
        body('groupType').not().isEmpty().withMessage('group type cannot be empty'),
        body('maxNumber').optional().isInt({ min: 1 }),
        body('minNumber').optional().isInt({ min: 1 }),
        body('groupStatus').optional().isIn(['available', 'closed', 'full']),
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



export default router;
