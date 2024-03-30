// Middleware to get a tag by ID
import Tag from '../models/tagModel.js';

async function getTag(req, res, next) {
    let tag;
    try {
        tag = await Tag.findById(req.params.id);
        if (tag == null) {
            return res.status(404).json({ message: 'Cannot find tag' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.tag = tag;
    next();
}

export default getTag;