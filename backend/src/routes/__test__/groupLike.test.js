import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import User from "../../models/userModel";
import Group from "../../models/groupModel";

let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    req.user = { _id: new mongoose.Types.ObjectId("662cf090b964cd3c520e09fe") };
    next();
  });

  const userRouter = express.Router();

  userRouter.get("/:id/likes/:groupId", async (req, res) => {
    const { id, groupId } = req.params;
    try {
      const user = await User.findById(id).populate("likedGroups");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isLiked = user.likedGroups.some(
        (group) => group._id.toString() === groupId
      );
      res.json({ liked: isLiked });
    } catch (err) {
      console.error("Detailed error: ", err);
      res
        .status(500)
        .json({ message: "Error processing request", error: err.toString() });
    }
  });

  userRouter.post("/like/:groupId", async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await Group.findById(groupId);
      const user = await User.findById(req.user._id);
      if (!user || !group) {
        return res.status(404).json({ message: "User or group not found" });
      }
      if (
        user.likedGroups.map((id) => id.toString()).includes(groupId.toString())
      ) {
        return res.status(400).json({ message: "Group already liked" });
      }
      user.likedGroups.push(group._id);
      await user.save();
      group.likeNumber = (group.likeNumber || 0) + 1;
      await group.save();
      res.status(200).json({ message: "Group liked successfully" });
    } catch (error) {
      console.error("Detailed error on like: ", error);
      res
        .status(500)
        .json({ message: "Error liking the group", error: error.toString() });
    }
  });

  userRouter.post("/unlike/:groupId", async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await Group.findById(groupId);
      const user = await User.findById(req.user._id);
      if (!user || !group) {
        return res.status(404).json({ message: "User or group not found" });
      }
      if (
        !user.likedGroups
          .map((id) => id.toString())
          .includes(groupId.toString())
      ) {
        return res.status(400).json({ message: "Group not previously liked" });
      }
      user.likedGroups.pull(group._id);
      await user.save();
      group.likeNumber = Math.max(group.likeNumber - 1, 0);
      await group.save();
      res.status(200).json({ message: "Group unliked successfully" });
    } catch (error) {
      console.error("Detailed error on unlike: ", error);
      res
        .status(500)
        .json({ message: "Error unliking the group", error: error.toString() });
    }
  });

  app.use("/api/user", userRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("User-Group Like/Unlike Functionality", () => {
  let user, group;

  beforeEach(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
    user = await User.create({
      _id: new mongoose.Types.ObjectId("662cf090b964cd3c520e09fe"),
      name: "Ekko",
      likedGroups: [],
    });
    group = await Group.create({
      _id: new mongoose.Types.ObjectId("662cdf073b8bc2113d8bc237"),
      likeNumber: 0,
    });
    await user.save();
    await group.save();
  });

  it("should confirm that the user does not like the group initially", async () => {
    const res = await request(app).get(
      `/api/user/${user._id}/likes/${group._id}`
    );
    expect(res.status).toBe(200);
    expect(res.body.liked).toBeFalsy();
  }, 15000);

  it("should allow a user to like a group", async () => {
    const res = await request(app).post(`/api/user/like/${group._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Group liked successfully");
  }, 15000);

  it("should allow a user to unlike a group after liking it", async () => {
    await request(app).post(`/api/user/like/${group._id}`);
    const res = await request(app).post(`/api/user/unlike/${group._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Group unliked successfully");
  }, 15000);
});
