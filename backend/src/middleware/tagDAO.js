import Tag from "../models/tagModel";

function addGroupTag(tag){
    const newTag = new Tag({
        name: tag.name,
        isGroupTag: true,
        color: tag.color
    });
    return newTag.save();
    
}

export {addGroupTag};