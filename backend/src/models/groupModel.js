import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: String,
    createDate: Date,  
    deadlineDate: Date,
    groupMembers: [{  
        type: Schema.Types.ObjectId,
        ref: 'User'  
    }],
    groupApplicants: [{  
        type: Schema.Types.ObjectId,
        ref: 'User'  
    }],
    application:[{
        type: Schema.Types.ObjectId,
        ref: 'Application'
    }],
    
    groupDescription: String,
    groupTags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
   
    groupStatus: {
        type: String,
        enum: ['available', 'closed', 'dismissed','full']
    },
    groupType: {
        type: String,
        enum: ['group', 'activity']
    },
    maxNumber: Number,
    likeNumber: Number,
});

const Group = mongoose.model('Group', groupSchema);

export default Group;