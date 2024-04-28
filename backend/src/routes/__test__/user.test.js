import express from "express";
import router from "../api/user";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/userModel";
import Group from "../../models/groupModel";

let mongod;

// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use("/api/user", router);

const user1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    name: "user1",
    accountType: "email",
    email: "test1@11.com",
    password: "asdfasdfalskdfjl23kfjl23",
    isVerification: false,
    avatar: "test",
    gender: "male",
};

const user2 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000002"),
    name: "user2",
    accountType: "email",
    email: "test2@11.com",
    password: "asdfasdfalskdfjl23kfjl23",
    isVerification: false,
    avatar: "test2",
    gender: "male",
};

const user3 = {
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

const user4 = {
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

const users = [user1, user2, user3, user4];

const group1 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    groupName: "group1",
    groupDescription: "group1 description",
    groupTags: ["000000000000000000000001", "000000000000000000000002"],
    groupMembers: ["000000000000000000000003"],
    groupApplicants: ["000000000000000000000004"],
    ownerId: "000000000000000000000003",
};

const group2 = {
    _id: new mongoose.Types.ObjectId("000000000000000000000002"),
    groupName: "group2",
    groupDescription: "group2 description",
    groupTags: ["000000000000000000000003", "000000000000000000000004"],
    groupMembers: ["000000000000000000000001"],
    groupApplicants: ["000000000000000000000003"],
    ownerId: "000000000000000000000001",
};

const groups = [group1, group2];

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
});


/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

describe("GET user from /api/user ", (done) => {
    it("Get all users from server", async () => {
        const res = await request(app).get("/api/user").send().expect(200);
        const userFromApi = res.body;

        expect(userFromApi).toBeTruthy();
        expect(userFromApi.length).toBe(4);

        expect(userFromApi[0].name).toBe("user1");
        expect(userFromApi[0].email).toBe("test1@11.com");
        expect(userFromApi[0].accountType).toBe("email");
        expect(userFromApi[0].gender).toBe("male");

        expect(userFromApi[1].gender).toBe("male");
        expect(userFromApi[1].avatar).toBe("test2");
        expect(userFromApi[1].isVerification).toBe(false);

        expect(userFromApi[2].gender).toBe("female");
        expect(userFromApi[2].avatar).toBe("test3");
        expect(userFromApi[2].isVerification).toBe(false);

        expect(userFromApi[3].gender).toBe("female");
        expect(userFromApi[3].avatar).toBe("test4");
        expect(userFromApi[3].isVerification).toBe(false);
    });



});

describe('GET /api/user/:id', () => {
    test('should return user for a valid user ID', async () => {
        const res = await request(app)
            .get('/api/user/000000000000000000000001')
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'user1');
        expect(res.body).toHaveProperty('email', 'test1@11.com');
        expect(res.body).toHaveProperty('accountType', 'email');
        expect(res.body).toHaveProperty('isVerification', false);
        expect(res.body).toHaveProperty('avatar', 'test');
        expect(res.body).toHaveProperty('gender', 'male');
    });

    test('should return 404 for a non-existent user ID', async () => {
        const res = await request(app)
            .get('/api/user/000000000000000000000999')
            .send();

        expect(res.status).toBe(404);
    });
});

describe('GET api/user/userData/:id', () => {
    test('should return user info in details for a valid user ID', async () => {
        const res = await request(app)
        .get('/api/user/userData/000000000000000000000003')
        .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'user3');
        expect(res.body).toHaveProperty('email', 'test3@11.com');
        expect(res.body).toHaveProperty('accountType', 'email');
        expect(res.body).toHaveProperty('isVerification', false);
        expect(res.body).toHaveProperty('avatar', 'test3');
        expect(res.body).toHaveProperty('gender', 'female');

        expect(res.body.participatingGroups).toContainEqual(expect.objectContaining({
            _id: "000000000000000000000001",
            groupName: "group1"
        }));
        expect(res.body.likedGroups).toContainEqual(expect.objectContaining({
            _id: "000000000000000000000001",
            groupName: "group1"
        }));
        expect(res.body.appliedGroups).toContainEqual(expect.objectContaining({
            _id: "000000000000000000000002",
            groupName: "group2"
        }));
    });
});