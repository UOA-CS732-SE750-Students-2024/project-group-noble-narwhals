import express from "express";
import router from "../api/user";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import bcrypt from "bcrypt";


/**
 * 注意：user修改tag的测试文件还没写，因为路由没有挂在api/user下
 * 我应该会在tag.test.js里面写
 */

let mongod;

// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    req.user = { _id: new mongoose.Types.ObjectId("000000000000000000000003") }; 
    next();
});


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
    await mongoose.connection.db.dropDatabase();
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

describe('POST /api/user', () => {

    test('should create a new user and return the user data', async () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            accountType: 'email',
            gender: 'male'
        };

        const response = await request(app)
            .post('/api/user')
            .send(newUser)
            .expect(201);

        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body.user).toHaveProperty('name', newUser.name);
        expect(response.body.user).toHaveProperty('email', newUser.email);
        expect(response.body.user).toHaveProperty('gender', newUser.gender);
        expect(response.body.user).toHaveProperty('accountType', newUser.accountType);
    });
});

describe('GET /:id/likes/:groupId', () => {

    test('should able to show whether the group is liked or not?  ', async () => {
        const likeResponse = await request(app)
            .get('/api/user/000000000000000000000003/likes/000000000000000000000001')
            .send();

        expect(likeResponse.status).toBe(200);
        expect(likeResponse.body).toHaveProperty('liked');

    });
});


describe('POST /like & unlike/:groupId', () => {

    test('should able to like a group', async () => {
        const likeResponse = await request(app)
            .post(`/api/user/like/${group2._id.toString()}`)
            .expect(200);

        expect(likeResponse.body).toHaveProperty('message', 'Group liked successfully');

        const user = await User.findById(user3);
        expect(user.likedGroups).toContainEqual(group2._id);
    });

    test('should able to unlike a group', async () => {
        const unlikeResponse = await request(app)
            .post(`/api/user/unlike/${group1._id.toString()}`)
            .expect(200);

        expect(unlikeResponse.body).toHaveProperty('message', 'Group unliked successfully');

        const user = await User.findById(user3);
        expect(user.likedGroups).not.toContainEqual(group1._id);
    });

    test('if user like a group which has been liked', async () => {
        const likeResponse = await request(app)
            .post(`/api/user/like/${group1._id.toString()}`)
            .expect(400);

        expect(likeResponse.body).toHaveProperty('message', 'Group already liked');
    });

    test('if user unlike a group which hasnt been liked', async () => {
        const unlikeResponse = await request(app)
            .post(`/api/user/unlike/${group2._id.toString()}`)
            .expect(400);

        expect(unlikeResponse.body).toHaveProperty('message', 'Group not previously liked');
    });
});

describe('PATCH /update/:id', () => {

    test('should update user email correctly', async () => {
        const updatedEmail = 'newemail@example.com';
        const response = await request(app)
            .patch(`/api/user/update/${user3._id.toString()}`)
            .send({ email: updatedEmail })
            .expect(200);  // 预期状态码为200

        expect(response.body.email).toBe(updatedEmail);
    });

    test('should update user username correctly', async () => {
        const updatedName = 'newName';
        const response = await request(app)
            .patch(`/api/user/update/${user3._id.toString()}`)
            .send({ name: updatedName })
            .expect(200);  // 预期状态码为200

        expect(response.body.name).toBe(updatedName);
    });

    test('should update user gender correctly', async () => {
        const updatedGender = 'newGender';
        const response = await request(app)
            .patch(`/api/user/update/${user3._id.toString()}`)
            .send({ gender: updatedGender })
            .expect(200);  // 预期状态码为200

        expect(response.body.gender).toBe(updatedGender);
    });

    test('should update user password correctly', async () => {
        const updatedPassword = 'newPassword';
        const response = await request(app)
            .patch(`/api/user/update/${user3._id.toString()}`)
            .send({ password: updatedPassword })
            .expect(200);  // 预期状态码为200

        const updatedUser = await User.findById(user3._id);
        // compare the updated password (should be encrypted) with the original password
        const passwordMatch = await bcrypt.compare(updatedPassword, updatedUser.password);
        expect(passwordMatch).toBe(true);
    });

    test('should return error when updating non-existent user', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        await request(app)
            .patch(`/api/user/update/${nonExistentUserId}`)
            .send({ email: 'test@example.com' })
            .expect(404);
    });

    test('should return error when updating user but not owner', async () => {
        const response = await request(app)
            .patch(`/api/user/update/${user4._id}`)
            .send({ email: 'test@example.com' })
            .expect(403);
    });

});

describe('DELETE /delete/:id', () => {

    test('should allow a user to delete their own account', async () => {
        console.log('user3._id:', user3._id);
        console.log("going to request", `/api/user/delete/${user3._id}`);
        const response = await request(app)
            .delete(`/api/user/delete/${user3._id}`)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Deleted User');

        const exists = await User.findById(user4._id);
        expect(exists).toBeNull();
    });

    test('should not allow a user to delete other people account', async () => {
       const response = await request(app)
            .delete(`/api/user/delete/${user4._id}`)
            .expect(403);

        expect(response.body).toHaveProperty('message', 'Unauthorized to delete this user.');
    });

});

describe('POST /regenerate-avatar/:id', () => {
    test('should regenerate avatar for a user', async () => {
        const response = await request(app)
            .post(`/api/user/regenerate-avatar/${user3._id.toString()}`)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Avatar updated successfully');
    });

    test('should return error when regenerating avatar for non-existent user', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        await request(app)
            .post(`/api/user/regenerate-avatar/${nonExistentUserId}`)
            .expect(404);
    });



});



