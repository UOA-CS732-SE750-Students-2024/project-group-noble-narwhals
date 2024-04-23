import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
        type: String,
        unique: true  
    },
    isProfileTag: {
        type: Boolean,
        default: false  
    },
    isGroupTag: {
        type: Boolean,
        default: false  
    },
    color: {
        type: String,
        default: 'hsl(156, 39%, 43%)'  
    }

});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;