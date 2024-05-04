import express from "express";
import Group from "../../models/groupModel.js";
import Application from "../../models/applicationModel.js";
import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";

import { body, validationResult } from "express-validator";
import { getGroup } from "../../middleware/entityMiddleware.js";
import { addGroupTag, checkTagExist } from "../../middleware/tagDAO.js";
import { isVerifiedUser } from "../../middleware/authMiddleware.js";
const router = express.Router();

// get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("groupMembers", "avatar")
      .populate("groupTags", "name");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get all groups for seach page
router.get("/search", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("groupTags", "name")
      .populate("groupMembers");
    return res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get group by id
router.get("/:id", getGroup, (req, res) => {
  res.json(res.group);
});

// get group by keywords
router.get("/search/:keywords", async (req, res) => {
  try {
    const keywords = req.params.keywords
      .trim()
      .replace(/\s\s+/g, " ")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .split(" ");
    const regex = keywords.map((keyword) => new RegExp(keyword, "i"));

    await Group.find()
      .populate("groupTags", "name")
      .populate("groupMembers", ["avatar", "name"])
      .then((groups) => {
        const filteredGroups = groups.filter((group) => {
          return (
            regex.some((reg) => reg.test(group.groupName)) ||
            group.groupTags.some((tag) => keywords.includes(tag.name))
          );
        });
        res.json(filteredGroups);
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a new group
router.post(
  "/creategroup",
  [
    body("title").not().isEmpty().withMessage("group name cannot be empty"),
    body("dueDate").optional().isISO8601().toDate(),
    body("description").optional().isString(),
    body("type").not().isEmpty().withMessage("group type cannot be empty"),
    body("members").optional().isInt({ min: 1 }),
    body("tags").optional().isArray(),
  ],
  isVerifiedUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // add new tag
    const modifiedTags = await Promise.all(
      req.body.tags.map(async (tag) => {
        const tagExist = await checkTagExist(tag.name);
        if (tagExist) {
          return tagExist;
        } else {
          const tagNew = await addGroupTag(tag);
          return tagNew;
        }
      })
    );

    const group = new Group({
      groupName: req.body.title,
      createDate: new Date(),
      deadlineDate: req.body.dueDate,
      maxNumber: req.body.members,
      groupMembers: [req.user._id],
      groupDescription: req.body.description,
      groupTags: modifiedTags,
      ownerId: req.user._id,
      groupStatus: "available",
      groupType: req.body.type,
      likeNumber: 0,
    });

    try {
      const newGroup = await group.save();

      // add group to user's group list
      const user = await User.findById(req.user._id);
      user.participatingGroups.push(newGroup._id);
      await user.save();

      res.status(201).json(newGroup);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

// update group by id
router.patch("/update/:id", isVerifiedUser, getGroup, async (req, res) => {
  // add new tag
  const modifiedTags = await Promise.all(
    req.body.tags.map(async (tag) => {
      const tagExist = await checkTagExist(tag.name);
      if (tagExist) {
        return tagExist;
      } else {
        const tagNew = await addGroupTag(tag);
        return tagNew;
      }
    })
  );

  res.group.groupName = req.body.title;
  res.group.deadlineDate = req.body.dueDate;
  res.group.maxNumber = req.body.members;
  res.group.groupDescription = req.body.description;
  res.group.groupTags = modifiedTags;
  res.group.groupType = req.body.type;
  res.group.groupStatus = "available";

  try {
    const updatedGroup = await res.group.save();
    // create a new notification for each of the group member
    const notificationContent = `Group ${res.group.groupName} has been updated.`;
    const notificationTime = new Date();
    const notificationType = "group_updated";
    const notificationPromises = res.group.groupMembers.map(async (id) => {
      const newNotification = new Notification({
        notificationContent,
        isRead: false,
        notificationTime,
        notificationType,
        senderId: req.user._id,
        receiverId: id,
        groupId: res.group._id,
      });
      return newNotification.save();
    });

    await Promise.all(notificationPromises);

    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//close the group by id
router.patch("/close/:id", getGroup, async (req, res) => {
  res.group.groupStatus = "closed";
  try {
    const updatedGroup = await res.group.save();
    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete group by id
router.delete("/delete/:id", getGroup, async (req, res) => {
  try {
    await res.group.remove();
    res.json({ message: "Deleted Group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Route to remove a member from a group
router.patch("/remove-member/:id", getGroup, async (req, res) => {
  const memberId = req.body.memberId;
  const member = await User.findById(memberId);

  const group = res.group;

  if (!group) {
    return res.status(404).send({ message: "Group not found" });
  }

  try {
    const index = group.groupMembers.findIndex((id) => id.equals(memberId));
    if (index === -1) {
      return res.status(404).send({ message: "Member not found in the group" });
    }

    group.groupMembers.splice(index, 1);
    member.participatingGroups.pull(group._id);

    // Create a new notification
    const newNotification = new Notification({
      notificationContent: `You have been removed from the group ${group.groupName}`,
      isRead: false,
      notificationTime: new Date(),
      notificationType: "delete_member",
      senderId: req.user._id,
      receiverId: memberId,
      groupId: group._id,
    });

    await group.save();
    await member.save();
    await newNotification.save();

    res.send({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error in remove-member route:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// join group by id
router.post("/join/:id", getGroup, async (req, res) => {
  const userId = req.user._id;

  // check if user is already in the group
  if (res.group.groupMembers.includes(userId)) {
    return res.status(400).json({ message: "User already in the group" });
  }

  // add user to the group
  res.group.groupMembers.push(userId);

  //check if group is full

  if (res.group.groupMembers.length >= res.group.maxNumber) {
    res.group.groupStatus = "full";
  }

  try {
    await res.group.save();
    res.json({ message: "User added to the group successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// quit group by id
router.post("/quit/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // User ID from authentication/session
  const user = await User.findById(userId);

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.groupMembers.includes(userId)) {
      return res.status(400).json({ message: "User not in group" });
    }

    // Remove the user from the groupMembers array
    group.groupMembers.pull(userId);
    // Remove the group from the user's participatingGroups array
    user.participatingGroups.pull(groupId);

    // Create a new notification
    const newNotification = new Notification({
      notificationContent: `User ${user.name} has left the group ${group.groupName}`,
      isRead: false,
      notificationTime: new Date(),
      notificationType: "member_quit",
      senderId: userId,
      receiverId: group.ownerId,
      groupId: groupId,
    });

    await group.save();
    await user.save();
    // Save the notification
    await newNotification.save();

    res.status(200).json({ message: "Successfully quit the group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join group by applying to it at group info
router.post("/join/:id/group", getGroup, async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  // Check if the user is already a member of the group
  if (res.group.groupMembers.includes(userId)) {
    return res.status(400).json({ message: "User already in the group" });
  }

  // Check if the group is already full
  if (res.group.groupMembers.length >= res.group.maxNumber) {
    return res.status(400).json({ message: "Group is already full" });
  }

  try {
    // Create a new application
    const newApplication = new Application({
      applicantId: userId,
      groupId: req.params.id,
      message: req.body.message,
      applicationStatus: "pending",
      applicationDate: new Date(),
    });
    await newApplication.save();

    //create a new notification
    const newNotification = new Notification({
      notificationContent: `${newApplication.message}`,
      isRead: false,
      notificationTime: new Date(),
      notificationType: "new_applicant",
      senderId: userId,
      receiverId: res.group.ownerId,
      groupId: req.params.id,
    });

    // Add the user to group applicants and the application list
    res.group.groupApplicants.push(userId);
    res.group.application.push(newApplication._id);

    // add group to user's applied in progress group list.
    user.appliedGroups.push(res.group._id);

    // Check if adding this member has filled the group
    if (res.group.groupMembers.length >= res.group.maxNumber) {
      res.group.groupStatus = "full";
    }

    await res.group.save();

    await user.save(); // Save the user with the updated applied group list
    await newNotification.save(); // Save the notification

    res.json({
      message: "User added to the group successfully",
      groupStatus: res.group.groupStatus,
      applicationId: newApplication._id,
    });
  } catch (err) {
    console.error("Failed to join group:", err);

    res.status(500).json({ message: err.message });
  }
});

// get group by id with  details populated
router.get("/:id/detail", getGroup, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate({
        path: "groupMembers",
        select: "name avatar",
      })
      .populate({
        path: "groupApplicants",
        select: "name message avatar",
      })
      .populate({
        path: "application",
        populate: {
          path: "applicantId",
          select: "name avatar",
        },
      })
      .populate("groupTags", "name")
      .populate({
        path: "ownerId",
        select: "name avatar",
      });

    if (!group) {
      return res.status(404).send("Group not found");
    }

    // Check and update the group status based on the number of members
    const isFull = group.groupMembers.length >= group.maxNumber;
    if (isFull && group.groupStatus !== "full") {
      group.groupStatus = "full";
      await group.save();
    } else if (!isFull && group.groupStatus === "full") {
      group.groupStatus = "available";
      await group.save(); // Update status if no longer full
    }

    res.json(group);
  } catch (err) {
    console.error("Error fetching group:", err);

    res.status(500).json({ message: err.message });
  }
});

// check if user has applied to a group
router.get("/:groupId/has-applied", async (req, res) => {
  const { userId } = req.query;
  const { groupId } = req.params;
  try {
    const application = await Application.findOne({
      groupId,
      applicantId: userId,
    }).select("applicationStatus");
    if (!application) {
      return res.json({ hasApplied: false, applicationStatus: "none" });
    }
    return res.json({
      hasApplied: true,
      applicationStatus: application.applicationStatus,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to check application status", error: err });
  }
});

// Cancel application to a group
router.post("/cancel-application/:groupId", async (req, res) => {
  const { userId } = req.body;
  const { groupId } = req.params;

  try {
    // Find the application by groupId and userId
    const application = await Application.findOne({
      groupId: groupId,
      applicantId: userId,
    });

    const user = await User.findById(userId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Remove the application document
    await Application.findByIdAndDelete(application._id);
    // Remove the group from the user's appliedGroups
    user.appliedGroups.pull(groupId);

    // Update the group document
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the user from groupApplicants
    const applicantIndex = group.groupApplicants.indexOf(userId);
    if (applicantIndex > -1) {
      group.groupApplicants.splice(applicantIndex, 1);
    }

    // Remove the application from the application array
    const applicationIndex = group.application.indexOf(application._id);
    if (applicationIndex > -1) {
      group.application.splice(applicationIndex, 1);
    }

    await group.save();
    await user.save();
    res.json({ message: "Application cancelled successfully" });
  } catch (err) {
    console.error("Failed to cancel application:", err);
    res
      .status(500)
      .json({ message: "Failed to cancel application", error: err });
  }
});

// Dismiss a group by the host
router.patch("/dismiss/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // Assuming you have user ID from session or token

  try {
    const group = await Group.findById(groupId);

    // Ensure the group exists
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Check if the user is the host and the group isn't full
    if (
      group.ownerId.toString() === userId.toString() &&
      group.groupMembers.length < group.maxNumber
    ) {
      const memberIds = group.groupMembers.map((member) => member.toString());
      const applicantIds = group.groupApplicants.map((applicant) =>
        applicant.toString()
      );
      const userIds = [...new Set([...memberIds, ...applicantIds])]; // Combine and remove duplicates

      // Remove the groupId from participatingGroups and appliedGroups
      await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { participatingGroups: groupId, appliedGroups: groupId } }
      );

      // Additionally, remove the groupId from likedGroups of all users who liked this group
      await User.updateMany(
        { likedGroups: groupId },
        { $pull: { likedGroups: groupId } }
      );

      // Create a new notification for each user in the group
      const notificationContent = `Group ${group.groupName} has been dismissed by the host.`;
      const notificationTime = new Date();
      const notificationType = "group_dismissed";
      const notificationPromises = userIds.map(async (id) => {
        const newNotification = new Notification({
          notificationContent,
          isRead: false,
          notificationTime,
          notificationType,
          senderId: userId,
          receiverId: id,
          groupId: groupId,
        });
        return newNotification.save();
      });

      // Wait for all notifications to be saved
      await Promise.all(notificationPromises);

      // Setting group status to 'dismissed' and clearing members and applicants
      group.groupStatus = "dismissed";
      group.groupMembers = []; // Clear all members
      group.groupApplicants = []; // Clear all applicants

      await group.save();
      res.status(200).json({
        message:
          "Group successfully dismissed and all members and applicants have been removed.",
      });
    } else {
      res.status(403).json({
        message:
          "You are not authorized to dismiss this group or group is full.",
      });
    }
  } catch (error) {
    console.error("Error dismissing the group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
