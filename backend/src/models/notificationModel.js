import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    notificationContent: String,
    notificationTime: Date,
    isRead: {
        type: Boolean,
        default: false  
    },
    notificationType: {
        type: String,
        enum: ['join_request_accepted', 'group_closed', 'join_request_rejected', 'group_started'],  
        default: 'group_started'  
    },  
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'  
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'  
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;