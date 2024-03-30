import Group from '../models/groupModel.js';

async function getGroup(req, res, next) {
    let group;
    try {
        group = await Group.findById(req.params.id);
        if (group == null) {
            return res.status(404).json({ message: 'Cannot find group' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.group = group;
    next();
}
export default getGroup;