import express from "express";
import userRouter from "./user.js";
import groupRouter from "./group.js";
import tagRouter from "./tag.js";
import applicationRouter from "./application.js";
import notificationRouter from "./notification.js";
import autoTagger from "./autoTagger.js";

const router = express.Router();



router.use("/user", userRouter);
router.use("/groups", groupRouter);
router.use("/group", groupRouter);
router.use("/tag", tagRouter);
router.use("/application", applicationRouter);
router.use("/notification", notificationRouter);
router.use("/autoTagger", autoTagger);

export default router;
