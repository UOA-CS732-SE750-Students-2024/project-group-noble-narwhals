// middleware: get application by id

import Application from '../models/applicationModel.js';
async function getApplication(req, res, next) {
    let application;
    try {
        application = await Application.findById(req.params.id);
        if (application == null) {
            return res.status(404).json({ message: 'Cannot find application' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.application = application;
    next();
}
export default getApplication;