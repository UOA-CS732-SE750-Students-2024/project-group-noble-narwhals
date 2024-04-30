import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import Application from "../../models/applicationModel";
import Tag from "../../models/tagModel";

let mongod, app;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    app = express();
    app.use(express.json());

    // Mocking user authentication and setting up user context
    app.use((req, res, next) => {
        req.user = { _id: new mongoose.Types.ObjectId("662cf090b964cd3c520e09fe") };
        next();
    });


    // Middleware to fetch group details
    const getGroup = async (req, res, next) => {
        try {
            const group = await Group.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            res.group = group;
            next();
        } catch (error) {
            res.status(500).json({ message: 'Error accessing the database', error: error.toString() });
        }
    };

    const groupRouter = express.Router();

    groupRouter.post('/join/:id', getGroup, async (req, res) => {
        if (res.group.groupMembers.includes(req.user._id.toString())) {
            return res.status(400).json({ message: "User already in the group" });
        }

        res.group.groupMembers.push(req.user._id);
        try {
            await res.group.save();
            res.json({ message: "User added to the group successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    const alignParamsForGroup = (req, res, next) => {
        req.params.id = req.params.groupId;  // Aligning parameter names
        next();
    };

    groupRouter.post('/quit/:groupId', alignParamsForGroup, getGroup, async (req, res) => {
        if (!res.group.groupMembers.includes(req.user._id.toString())) {
            return res.status(400).json({ message: "User not in group" });
        }
        res.group.groupMembers.pull(req.user._id);
        try {
            await res.group.save();
            res.status(200).json({ message: "Successfully quit the group" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Route to remove a member from a group
    groupRouter.patch('/remove-member/:id', getGroup, async (req, res) => {
        const memberId = req.body.memberId;
        if (!res.group.groupMembers.includes(memberId)) {
            return res.status(404).send({ message: "Member not found in the group" });
        }
        res.group.groupMembers.pull(memberId);
        await res.group.save();
        res.send({ message: "Member removed successfully" });
    });
    // Route to handle group application
    groupRouter.post('/join/:id/group', getGroup, async (req, res) => {
        if (res.group.groupMembers.includes(req.user._id)) {
            return res.status(400).json({ message: "User already in the group" });
        }
        if (res.group.groupMembers.length >= res.group.maxNumber) {
            return res.status(400).json({ message: "Group is already full" });
        }
        const newApplication = new Application({
            applicantId: req.user._id,
            groupId: req.params.id,
            message: req.body.message
        });
        await newApplication.save();
        res.group.groupApplicants.push(req.user._id);
        await res.group.save();
        res.json({ message: "Application submitted successfully", applicationId: newApplication._id });
    });
    // Route to fetch group details
    groupRouter.get('/:id/detail', getGroup, async (req, res) => {
        const group = await Group.findById(req.params.id)
            .populate('groupMembers', 'name avatar')
            .populate('groupApplicants', 'name avatar')
            .populate({
                path: 'application',
                populate: { path: 'applicantId', select: 'name avatar' }
            })
            .populate('groupTags', 'name')
            .populate('ownerId', 'name avatar');
        res.json(group);
    });

    // Route to check if a user has applied to a group
    groupRouter.get('/:groupId/has-applied', async (req, res) => {
        const application = await Application.findOne({
            groupId: req.params.groupId,
            applicantId: req.query.userId
        });
        if (!application) {
            return res.json({ hasApplied: false, applicationStatus: "none" });
        }
        res.json({ hasApplied: true, applicationStatus: application.applicationStatus });
    });

    // Route to cancel a group application
    groupRouter.post('/cancel-application/:groupId', async (req, res) => {
        console.log("Received cancellation request for groupId:", req.params.groupId, "and userId:", req.body.userId);
    
        try {
            const application = await Application.findOne({
                groupId: req.params.groupId,
                applicantId: req.body.userId
            });
            console.log("Found application:", application);
    
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }
    
            await Application.findByIdAndDelete(application._id);
            console.log("Application deleted");
    
            res.json({ message: "Application cancelled successfully" });
        } catch (err) {
            console.error("Error during application cancellation:", err);
            res.status(500).json({ message: "Failed to cancel application", error: err.toString() });
        }
    });
    

    // Route to dismiss a group
    groupRouter.patch('/dismiss/:groupId', async (req, res) => {
        const group = await Group.findById(req.params.groupId);
        if (!group || group.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized or group not found" });
        }
        group.groupMembers = [];
        group.groupApplicants = [];
        group.groupStatus = 'dismissed';
        await group.save();
        res.json({ message: "Group dismissed successfully" });
    });




    app.use('/api/groups', groupRouter);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

describe('Group API Functionality Tests', () => {
    let user, group;

    beforeEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        user = await User.create({
            _id: new mongoose.Types.ObjectId("662cf090b964cd3c520e09fe"),
            name: "Ekko",
        });
        group = await Group.create({
            _id: new mongoose.Types.ObjectId("662cdf073b8bc2113d8bc237"),
            groupName: "Test Group",
            groupMembers: [],
            maxNumber: 10,
            likeNumber: 0,
            groupStatus: 'available'
        });
    });

    it('should allow a user to join a group', async () => {
        const res = await request(app).post(`/api/groups/join/${group._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User added to the group successfully');
    });

    it('should allow a user to quit a group', async () => {
        // Ensure the user is already in the group before attempting to quit
        const joinResponse = await request(app).post(`/api/groups/join/${group._id}`);
        expect(joinResponse.status).toBe(200);  // Confirm that joining was successful
        const quitResponse = await request(app).post(`/api/groups/quit/${group._id}`);
        expect(quitResponse.status).toBe(200);
        expect(quitResponse.body.message).toBe('Successfully quit the group');
    });
  
    it('should fetch detailed information of a group', async () => {
        const res = await request(app).get(`/api/groups/${group._id}/detail`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("groupMembers");
        expect(res.body).toHaveProperty("groupApplicants");
        expect(res.body).toHaveProperty("application");
        expect(res.body).toHaveProperty("groupTags");
        expect(res.body).toHaveProperty("groupStatus");
    });
    it('should allow a group admin to remove a member from the group', async () => {
        // Adding a user to the group first
        const member = await User.create({
            name: "Member",
            email: "member@example.com",
            password: "testpass123"
        });
        group.groupMembers.push(member._id);
        await group.save();

        const res = await request(app)
            .patch(`/api/groups/remove-member/${group._id}`)
            .send({ memberId: member._id });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Member removed successfully');
        const updatedGroup = await Group.findById(group._id);
        expect(updatedGroup.groupMembers.includes(member._id)).toBeFalsy();
    });

    
    it('should check if a user has applied to a group', async () => {
        // Assume there's an existing application
        const application = new Application({
            applicantId: user._id,
            groupId: group._id,
            applicationStatus: 'pending'
        });
        await application.save();

        const res = await request(app)
            .get(`/api/groups/${group._id}/has-applied?userId=${user._id}`);

        expect(res.status).toBe(200);
        expect(res.body.hasApplied).toBe(true);
        expect(res.body.applicationStatus).toBe('pending');
    });

    




   
    


});

