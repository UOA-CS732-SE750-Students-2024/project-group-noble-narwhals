import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: String,
    createDate: Date,  
    deadlineDate: Date,
    numberOfGroupMember: Number,
    groupMembers: [{  
        type: Schema.Types.ObjectId,
        ref: 'User'  
    }],
    groupApplicants: [{  
        type: Schema.Types.ObjectId,
        ref: 'User'  
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
        enum: ['available', 'closed', 'full']
    },
    maxNumber: Number,
    likeNumber: Number,
});

const Group = mongoose.model('Group', groupSchema);

export default Group;