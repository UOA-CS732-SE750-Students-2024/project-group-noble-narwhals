import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../userModel";
import Group from "../groupModel";

let mongod;

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

const users = [user1, user2];

const group1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000321"),
  groupName: "CS732",
  groupStatus: "available",
  groupType: "group",
  maxNumber: 6,
};

const groups = [group1];

/**
 * Before all tests, create an in-memory MongoDB instance so we don't have to test on a real database,
 * then establish a mongoose connection to it.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString);
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
  // Drop existing collections
  await mongoose.connection.db.dropDatabase();

  const collUser = await mongoose.connection.db.createCollection("users");
  const collGroup = await mongoose.connection.db.createCollection("groups");

  await collUser.insertMany(users);
  await collGroup.insertMany(groups);
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it("Test user schema", async () => {
  const usersFromDb = await User.find();
  expect(usersFromDb).toBeTruthy();
  expect(usersFromDb.length).toBe(2);

  expect(usersFromDb[0].name).toBe("user1");
  expect(usersFromDb[0].email).toBe("test1@11.com");
  expect(usersFromDb[0].accountType).toBe("email");
  expect(usersFromDb[0].gender).toBe("male");

  expect(usersFromDb[1].gender).toBe("male");
  expect(usersFromDb[1].avatar).toBe("test2");
  expect(usersFromDb[1].isVerification).toBe(false);
});

it("Test group schema", async () => {
  const groupsFromDb = await Group.find();

  expect(groupsFromDb).toBeTruthy();
  expect(groupsFromDb.length).toBe(1);

  expect(groupsFromDb[0].groupStatus).toBe("available");
  expect(groupsFromDb[0]._id.toString()).toBe("000000000000000000000321");
  expect(groupsFromDb[0].groupName).toBe("CS732");
});
