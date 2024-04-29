import express from "express";
import routes from "../auth";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportSetup from "../../config/passport";
import dotenv from "dotenv";

dotenv.config();

let mongod;

// Create Express server. We don't need to start or stop it ourselves - we'll use the supertest package to manage this for us.
const app = express();
app.use(express.json());
app.use(
  session({
    secret: test,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportSetup(passport);
app.use("/", routes);

const user1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  name: "user1",
  accountType: "email",
  email: "test1@11.com",
  password: "$2b$10$HCyAJOUIeao6emACL01rreyvS6RixMxHxYoK.XpMkwXGMTDjgpQBK",
  isVerification: false,
  avatar: "test",
  gender: "male",
};

const user2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  name: "user2",
  accountType: "email",
  email: "test2@11.com",
  password: "$2b$10$HCyAJOUIeao6emACL01rreyvS6RixMxHxYoK.XpMkwXGMTDjgpQBK",
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

describe("POST singup from /signup ", (done) => {
  it("Sign up correctly", async () => {
    const data = {
      email: "test@test.com",
      password: "12345678",
    };

    const res = await request(app).post("/signup").send(data).expect(201);
    const message = res.body;

    expect(message).toBeTruthy();
    expect(message.success).toBe(true);
  });

  it("Sign up with exist user", async () => {
    const data = {
      email: "test1@11.com",
      password: "12345678",
    };

    const res = await request(app).post("/signup").send(data).expect(400);
    const message = res.body;

    expect(message).toBeTruthy();
    expect(message.success).toBe(false);
  });
});

describe("POST login from /login ", (done) => {
  it("Login with wrong email", async () => {
    const data = {
      email: "test12@11.com",
      password: "12345678",
    };

    const res = await request(app).post("/login").send(data).expect(401);
    const message = res.body;

    expect(message).toBeTruthy();
    expect(message.success).toBe(false);
  });

  it("Login with right information", async () => {
    const data = {
      email: "test1@11.com",
      password: "12345678",
    };

    const res = await request(app).post("/login").send(data).expect(200);
    const message = res.body;

    expect(message).toBeTruthy();
    expect(message.isLoggedIn).toBe(true);
    expect(message.user._id).toBe("000000000000000000000001");
  });
});
