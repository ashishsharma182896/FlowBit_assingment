import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getScreens } from "../controllers/screens.controller.js";

const router = express.Router();

router.get("/me/screens", protectRoute, getScreens);

export default router;
