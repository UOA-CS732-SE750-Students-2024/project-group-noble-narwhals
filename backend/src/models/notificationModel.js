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
        enum: ['join_request_accepted', 'group_closed', 'join_request_rejected', 'group_started',
            'group_updated', 'group_dismissed', "delete_member", "new_applicant", "member_quit"],  
        default: 'group_started'  
    },  
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'  
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'  
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;