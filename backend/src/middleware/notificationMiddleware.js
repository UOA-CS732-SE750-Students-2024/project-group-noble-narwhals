import Notification from '../models/notificationModel.js';
async function getNotification(req, res, next) {
    let notification;
    try {
        notification = await Notification.findById(req.params.id);
        if (notification == null) {
            return res.status(404).json({ message: 'Cannot find notification' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.notification = notification;
    next();
}

export default getNotification;