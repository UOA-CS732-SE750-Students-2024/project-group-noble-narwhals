import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    accountType: String,
    email: String,
    password: String,
    isVerification: Boolean,
    avatar: String,
    gender: String,
    profileTags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    avatar: String,
    participatingGroups: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    likedGroups: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    appliedGroups: [{   
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
});

const User = mongoose.model('User', userSchema);

export default User;
