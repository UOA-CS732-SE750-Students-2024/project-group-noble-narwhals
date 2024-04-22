import express from "express";
import userRouter from "./user.js";
import groupRouter from "./group.js";
import tagRouter from "./tag.js";
import applicationRouter from "./application.js";
import notificationRouter from "./notification.js";

const router = express.Router();


router.use("/user", userRouter);
router.use("/groups", groupRouter);
router.use("/tag", tagRouter);
router.use("/application", applicationRouter);
router.use("/notification", notificationRouter);


export default router;
