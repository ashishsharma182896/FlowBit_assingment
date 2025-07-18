import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import { getAuditLogs } from "../controllers/auditLog.controller.js";

const router = express.Router();


router.use(protectRoute);
router.use(adminOnly);

router.get("/audit-logs", getAuditLogs);

export default router;
