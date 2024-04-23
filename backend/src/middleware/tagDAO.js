import Tag from "../models/tagModel.js";

async function addGroupTag(tag){
    const newTag = new Tag({
        name: tag.name,
        isGroupTag: true,
        color: tag.color
    });
    return await newTag.save();
    
}

export {addGroupTag};