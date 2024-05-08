import express from "express";
import router from "../api/group";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import Tag from "../../models/tagModel";

let mongod;
// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use(express.json());

app.use("/api/group", router);

const group1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000101"),
  groupName: "outdoor meeting for dev groups",
  groupDescription: "group1 description",
  groupTags: ["000000000000000000000301", "000000000000000000000302"],
  groupMembers: ["000000000000000000000201"],
  groupApplicants: ["000000000000000000000202"],
  ownerId: "000000000000000000000201",
};

const group2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000102"),
  groupName: "Let's go to study development",
  groupDescription: "group2 description",
  groupTags: ["000000000000000000000301", "000000000000000000000302"],
  groupMembers: ["000000000000000000000201"],
  groupApplicants: ["000000000000000000000202"],
  ownerId: "000000000000000000000201",
};
const group3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000103"),
  groupName: "Let's go hiking",
  groupDescription: "group3 description",
  groupTags: ["000000000000000000000303"],
  groupMembers: ["000000000000000000000201"],
  groupApplicants: ["000000000000000000000202"],
  ownerId: "000000000000000000000201",
};

const groups = [group1, group2, group3];

const user1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000201"),
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
  _id: new mongoose.Types.ObjectId("000000000000000000000202"),
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

const tag1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000301"),
  name: "develop",
};
const tag2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000302"),
  name: "frontend",
};
const tag3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000303"),
  name: "outdoor",
};

const tags = [tag1, tag2, tag3];

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  await User.insertMany(users);
  await Group.insertMany(groups);
  await Tag.insertMany(tags);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("GET all groups", () => {
  it("should return all groups", async () => {
    const res = await request(app).get("/api/group/search");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
  });
});

describe("GET groups by keywords", () => {
  it("should return group1 and group3", async () => {
    const res = await request(app).get("/api/group/search/outdoor");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]._id).toBe("000000000000000000000101");
    expect(res.body[1]._id).toBe("000000000000000000000103");
  });
  it("should return group2 and group3", async () => {
    const res = await request(app).get("/api/group/search/Let't%20go");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]._id).toBe("000000000000000000000102");
    expect(res.body[1]._id).toBe("000000000000000000000103");
  });
  it("should return group1 and group2", async () => {
    const res = await request(app).get("/api/group/search/frontend");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]._id).toBe("000000000000000000000101");
    expect(res.body[1]._id).toBe("000000000000000000000102");
  });
});
