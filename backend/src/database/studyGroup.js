import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema({
    courseID : String,
    creatorID: String,
    goal: String,
    tag: [String],
    memberLimit: Number,
    schedule: String,
    joinRequests: [String],
    members: [String],
   
    });
const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;