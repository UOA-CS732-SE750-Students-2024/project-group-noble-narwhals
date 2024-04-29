import express from "express";
import router from "../api/user";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";

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

const users = [user1, user2];

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
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (let collection of collections) {
    await mongoose.connection.db.dropCollection(collection.name);
  }

  const collUser = await mongoose.connection.db.createCollection("users");
  await collUser.insertMany(users);
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
    expect(userFromApi.length).toBe(2);

    expect(userFromApi[0].name).toBe("user1");
    expect(userFromApi[0].email).toBe("test1@11.com");
    expect(userFromApi[0].accountType).toBe("email");
    expect(userFromApi[0].gender).toBe("male");

    expect(userFromApi[1].gender).toBe("male");
    expect(userFromApi[1].avatar).toBe("test2");
    expect(userFromApi[1].isVerification).toBe(false);
  });
});
