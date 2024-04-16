import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    applicantId: {
        type: Schema.Types.ObjectId,
        ref: 'User'  
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group' 
    },
    applicationDate: Date,
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],  
        default: 'pending' 
    },
    message: {
        type: String,
        required: true  
    }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;