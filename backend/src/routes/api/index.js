import express from "express";
import userRouter from "../userRoutes.js";
import groupRouter from "../groupRouters.js";
import tagRouter from "../tagRoutes.js";
import applicationRouter from "../applicationRoutes.js";
import notificationRouter from "../notificationRoutes.js";

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


export default router;
