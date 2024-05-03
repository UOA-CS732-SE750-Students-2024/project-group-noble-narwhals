import express from "express";
import Notification from "../../models/notificationModel.js";
import { getNotification } from "../../middleware/entityMiddleware.js";
const router = express.Router();

// get all notifications
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ receiverId: userId })
      .populate("senderId", ["name", "avatar"]) // fill senderId, select to display username
      .populate("receiverId", "name"); // fill receiverId, select to display username
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get notification by id
router.get("/:id", getNotification, (req, res) => {
  res.json(res.notification);
});

// create a new notification
router.post("/", async (req, res) => {
  const notification = new Notification({
    ...req.body,
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update notification by id
router.patch("/:id/read", getNotification, async (req, res) => {
  res.notification.isRead = true;

  try {
    const updatedNotification = await res.notification.save();
    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete notification by id
router.delete("/:id", getNotification, async (req, res) => {
  try {
    await res.notification.remove();
    res.json({ message: "Deleted Notification" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
