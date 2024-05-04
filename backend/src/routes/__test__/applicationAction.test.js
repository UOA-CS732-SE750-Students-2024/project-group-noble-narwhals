import express from "express";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import request from "supertest";
import User from "../../models/userModel";
import Group from "../../models/groupModel";
import Application from "../../models/applicationModel";
import applicationRouter from "../api/application";

let mongod, app, user, group, application;

beforeAll(async () => {
  // Increase the default timeout for beforeAll to ensure databases are setup properly
  jest.setTimeout(10000);

  // Create a MongoDB replica set instance
  mongod = await MongoMemoryReplSet.create({
    replSet: { storageEngineOptions: { storageEngine: "wiredTiger" } },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(express.json());
  app.use("/api/application", applicationRouter);

  // Create user, group, and application for tests
  user = await User.create({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  });
  group = await Group.create({
    groupName: "Test Group",
    maxNumber: 5,
    groupMembers: [],
    groupApplicants: [],
    applications: [],
  });
  application = await Application.create({
    groupId: group._id,
    applicantId: user._id,
    applicationStatus: "pending",
    message: "Please accept me",
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  // Reset the timeout to Jest's default or whatever your project uses
  jest.setTimeout(5000);
});

describe("Update Application by ID in Group Info Page", () => {
  it("should accept an application and add the user to the group", async () => {
    const res = await request(app)
      .patch(`/api/application/applications-with-details/${application._id}`)
      .send({ applicationStatus: "accepted" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      "Application processed and deleted successfully"
    );

    const updatedGroup = await Group.findById(group._id);
    const updatedUser = await User.findById(user._id);

    expect(updatedGroup.groupMembers.includes(user._id)).toBeTruthy();
    expect(updatedUser.participatingGroups.includes(group._id)).toBeTruthy();

    const foundApplication = await Application.findById(application._id);
    expect(foundApplication).toBeNull();
  });
});
