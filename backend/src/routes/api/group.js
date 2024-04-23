import express from 'express';
import Group from '../../models/groupModel.js'
import User from '../../models/userModel.js';
import { body, validationResult } from 'express-validator';
import { getGroup } from '../../middleware/entityMiddleware.js';
import { addGroupTag, checkTagExist } from '../../middleware/tagDAO.js';
import isLoggedIn from '../../middleware/authMiddleware.js';
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
router.post( '/creategroup', 
    [
        body('title').not().isEmpty().withMessage('group name cannot be empty'),
        body('dueDate').optional().isISO8601().toDate(),
        body('description').optional().isString(),
        body('type').not().isEmpty().withMessage('group type cannot be empty'),
        body('members').optional().isInt({ min: 1 }),
        body('tags').optional().isArray(),
    ], isLoggedIn,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // add new tag
        const modifiedTags = await Promise.all( req.body.tags.map(async tag => {
            const tagExist = await checkTagExist(tag.name);
            if(tagExist){
                return tagExist;
            } else{
                const tagNew = await addGroupTag(tag);
                return tagNew;
            }
        }));

        const group = new Group({
            groupName: req.body.title,
            createDate: new Date(),
            deadlineDate: req.body.dueDate,
            numberOfGroupMember: req.body.members,
            groupMembers: [], 
            groupDescription: req.body.description,
            groupTags: modifiedTags,
            ownerId: req.user._id, //fix later
            groupStatus: 'available',
            groupType: req.body.type,
        });

        try {
            const newGroup = await group.save();

            // add group to user's group list
            const user = await User.findById(req.user._id);
            user.participatingGroups.push(newGroup._id);
            await user.save();

            res.status(201).json(newGroup);
        } catch (err) {
            console.log(err.message)
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
