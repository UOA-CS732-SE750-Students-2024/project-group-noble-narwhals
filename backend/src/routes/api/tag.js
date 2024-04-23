
import express from 'express';
import { body, validationResult } from 'express-validator';
import Tag from '../../models/tagModel.js';
import { getTag } from '../../middleware/entityMiddleware.js';
const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single tag by ID
router.get('/:id', getTag, (req, res) => {
    res.json(res.tag);
});

// Create a new tag
router.post('/', [
    body('name').trim().not().isEmpty().withMessage('Tag name is required'),
    body('isProfileTag').optional().isBoolean(),
    body('isGroupTag').optional().isBoolean()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // find if the tag already exists
        const existingTag = await Tag.findOne({ name: req.body.name });
        if (existingTag) {
            // if the tag already exists, return the existing tag
            return res.status(200).json(existingTag);
        }

        // if the tag does not exist, create a new tag and save it
        const tag = new Tag({
            name: req.body.name,
            isProfileTag: req.body.isProfileTag,
            isGroupTag: req.body.isGroupTag
        });

        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a tag
router.patch('/:id', getTag, async (req, res) => {
    if (req.body.name != null) {
        res.tag.name = req.body.name;
    }
    if (req.body.isProfileTag != null) {
        res.tag.isProfileTag = req.body.isProfileTag;
    }
    if (req.body.isGroupTag != null) {
        res.tag.isGroupTag = req.body.isGroupTag;
    }

    try {
        const updatedTag = await res.tag.save();
        res.json(updatedTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a tag
router.delete('/:id', getTag, async (req, res) => {
    try {
        await res.tag.deleteOne();
        res.json({ message: 'Deleted Tag' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;
