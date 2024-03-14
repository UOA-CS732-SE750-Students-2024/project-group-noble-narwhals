import express from "express";

const router = express.Router();

// Adds both the /products and /orders routes.
import api from "./api/index.js";
router.use("/api", api);

export default router;
