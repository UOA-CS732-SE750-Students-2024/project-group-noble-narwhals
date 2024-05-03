import express from 'express';
import Application from '../../models/applicationModel.js';
import User from '../../models/userModel.js';
import Notification from '../../models/notificationModel.js';
import mongoose from 'mongoose';
import Group from '../../models/groupModel.js';
import { body, validationResult } from 'express-validator';
import { getApplication } from '../../middleware/entityMiddleware.js';
const router = express.Router();

// get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicantId")
      .populate("groupId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get application by id
router.get("/:id", getApplication, (req, res) => {
  res.json(res.application);
});

// create a new application
router.post(
  "/",
  [
    body("applicantId").not().isEmpty().withMessage("Applicant ID is required"),
    body("groupId").not().isEmpty().withMessage("Group ID is required"),
    body("message").not().isEmpty().withMessage("Message is required"),
    body("applicationDate").optional().isISO8601().toDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newApplication = new Application({
        applicantId: req.body.applicantId,
        groupId: req.body.groupId,
        message: req.body.message,
        applicationDate: req.body.applicationDate || new Date(),
      });
      await newApplication.save();
      res.status(201).json(newApplication);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// update application by id
router.patch("/:id", getApplication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["applicationStatus", "message"]; // only allow these fields to be updated
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach((update) => {
      res.application[update] = req.body[update];
    });
    const updatedApplication = await res.application.save();
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update application by id in group info page
router.patch(
  "/applications-with-details/:id",
  getApplication,
  async (req, res) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction(); // Start the transaction

      if (!res.application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const application = res.application;
      const updates = req.body;
      const allowedUpdates = ["applicationStatus", "message"];
      const updateFields = Object.keys(updates);

      const applicant = await User.findById(application.applicantId).session(
        session
      );

      if (!updateFields.every((field) => allowedUpdates.includes(field))) {
        await session.abortTransaction(); // Abort transaction if updates are invalid
        session.endSession();
        return res
          .status(400)
          .json({
            message:
              "Invalid updates, only 'applicationStatus' and 'message' are allowed.",
          });
      }

      // Apply updates to the application
      updateFields.forEach((field) => {
        application[field] = updates[field];
      });
      await application.save({ session });

      // If application is accepted, add the applicant to the group and remove from applicants
      if (
        application.applicationStatus === "accepted" ||
        application.applicationStatus === "rejected"
      ) {
        const group = await Group.findById(application.groupId).session(
          session
        );
        if (group) {
          if (application.applicationStatus === "accepted") {
            if (group.groupMembers.length >= group.maxNumber) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: "Group is full" });
            }

            group.groupMembers.push(application.applicantId);
            group.groupApplicants.pull(application.applicantId);
            group.application.pull(application._id); // also remove the application reference

            applicant.participatingGroups.push(group._id); // add group to participating groups

                    // Create a new notification for the applicant
                    const newNotification = new Notification({
                        notificationContent: `Your application to join group "${group.groupName}" has been accepted.`,
                        notificationTime: new Date(),
                        notificationType: 'join_request_accepted',
                        senderId: group.ownerId,
                        receiverId: applicant._id,
                        groupId: group._id
                    });
          
                    await newNotification.save({ session });

                }
                await group.save({ session });
            }else if (application.applicationStatus === 'rejected') {
          
                group.groupApplicants.pull(application.applicantId);
                group.application.pull(application._id);  // also remove the application reference

                // Create a new notification for the applicant
                const newNotification = new Notification({
                    notificationContent: `Your application to join group "${group.groupName}" has been rejected.`,
                    notificationTime: new Date(),
                    notificationType: 'join_request_rejected',
                    senderId: group.ownerId,
                    receiverId: applicant._id,
                    groupId: group._id
                });
     
                
                await newNotification.save({ session });
            }

        // Remove the application record
        await Application.findByIdAndDelete(application._id, { session });

        applicant.appliedGroups.pull(group._id); // remove group from applied groups in User
        await applicant.save({ session });

        // Commit all changes if everything above was successful
        await session.commitTransaction();
        session.endSession();
        res.json({ message: "Application processed and deleted successfully" });
      } else {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Unexpected status value" });
      }
    } catch (err) {
      await session.abortTransaction(); // Roll back any changes made before the error
      session.endSession();
      console.error(
        "Server error while updating and deleting application:",
        err
      );
      res
        .status(500)
        .json({
          message: "Server error while updating and deleting application.",
          error: err,
        });
    }
  }
);

// delete application by id
router.delete("/:id", getApplication, async (req, res) => {
  try {
    await res.application.remove();
    res.json({ message: "Deleted Application" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
