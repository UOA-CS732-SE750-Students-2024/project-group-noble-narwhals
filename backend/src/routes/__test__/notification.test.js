import express from "express";
import router from "../api/notification";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import Notification from "../../models/notificationModel";
import bcrypt from "bcrypt";

let mongod;

// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use(express.json());


app.use("/api/notification", router);


const user1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000003"),
    name: "user3",
    accountType: "email",
    email: "test3@11.com",
    password: "asdfasdfalskdfjl23kfjl23",
    isVerification: false,
    avatar: "test3",
    gender: "female",
    participatingGroups: ["000000000000000000000001"],
    likedGroups: ["000000000000000000000001"],
    appliedGroups: ["000000000000000000000002"],
};

const user2 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000004"),
    name: "user4",
    accountType: "email",
    email: "test4@11.com",
    password: "asdfasdfalskdfjl23kfjl23",
    isVerification: false,
    avatar: "test4",
    gender: "female",
    participatingGroups: [],
    likedGroups: [],
    appliedGroups: ["000000000000000000000001"],
};

const users = [user1, user2];

const group1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    groupName: "group1",
    groupDescription: "group1 description",
    groupTags: ["000000000000000000000001", "000000000000000000000002"],
    groupMembers: ["000000000000000000000003"],
    groupApplicants: ["000000000000000000000004"],
    ownerId: "000000000000000000000003",
};

const groups = [group1];

const notification1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    senderId: "000000000000000000000003",
    receiverId: "000000000000000000000004",
    notificationContent: "notification1",
    notificationType: "new_applicant",
    isRead: false,
};

const notifications = [notification1];

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString);
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await User.insertMany(users);
    await Group.insertMany(groups);
    await Notification.insertMany(notifications);
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

describe("GET /api/notification/user/:userId", () => {
    it("should return all notifications for a user", async () => {
        const res = await request(app).get("/api/notification/user/000000000000000000000004");

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].notificationContent).toEqual("notification1");
    
    });
});


describe("GET /api/notification/:id", () => {
    it("should return a notification by id", async () => {
        const res = await request(app).get("/api/notification/000000000000000000000001");

        expect(res.statusCode).toEqual(200);
        expect(res.body.notificationContent).toEqual("notification1");
    });
});

describe("POST /api/notification", () => {
    it("should create a new notification", async () => {
        const newNotification = {
            senderId: "000000000000000000000003",
            receiverId: "000000000000000000000004",
            notificationContent: "new notification",
            notificationType: "new_applicant",
            isRead: false,
        };

        const res = await request(app).post("/api/notification").send(newNotification);

        expect(res.statusCode).toEqual(201);
        expect(res.body.notificationContent).toEqual("new notification");
    });
});

describe("PATCH /api/notification/:id/read", () => {
    it("should update a notification by id", async () => {
        const res = await request(app).patch("/api/notification/000000000000000000000001/read");

        expect(res.statusCode).toEqual(200);
        expect(res.body.isRead).toEqual(true);
    });
});