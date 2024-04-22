import express from "express";
import api from "./api/index.js";
import auth from "./auth/index.js";

const router = express.Router();

router.use("/api", api);
router.use("/auth", auth);

export default router;
