import express from "express";
import router from "../tag/user";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import Tag from "../../models/tagModel";
import bcrypt from "bcrypt";


let mongod;

// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use(express.json());


app.use("/api/tag", router);


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

const tag1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    name: "tag1",
    isProfileTag: true,
    isGroupTag: true,
};

const tag2 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000002"),
    name: "tag2",
    isProfileTag: true,
    isGroupTag: true,
};

const tags = [tag1, tag2];

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
    await Tag.insertMany(tags);
});

fdescribe("GET /", () => {

    test("It should respond with an array of tags", async () => {
        const response = await request(app).get("/api/tag").send().expect(200);
        console.log(response.body);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe("tag1");
        expect(response.body[1].name).toBe("tag2");
    });


})

