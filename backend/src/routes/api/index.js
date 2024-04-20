import express from "express";
import userRouter from "./user.js";
import groupRouter from "./group.js";
import tagRouter from "./tag.js";
import applicationRouter from "./application.js";
import notificationRouter from "./notification.js";
import autoTagger from "./autoTagger.js";

const router = express.Router();

// Adds both the /products and /orders routes.
// import products from "./products.js";
// import orders from "./orders.js";
// router.use("/products", products);
// router.use("/orders", orders);

router.use("/user", userRouter);
router.use("/group", groupRouter);
router.use("/tag", tagRouter);
router.use("/application", applicationRouter);
router.use("/notification", notificationRouter);
router.use("/autoTagger", autoTagger);

export default router;
