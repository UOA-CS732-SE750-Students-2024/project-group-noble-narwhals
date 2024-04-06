import express from "express";

const router = express.Router();

// Adds both the /products and /orders routes.
import api from "./index.js";
router.use("/api", api);

export default router;
