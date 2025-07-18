import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import {
  getTenantDetails,
  getAllTenantTickets
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(adminOnly);


router.get("/me/tenant", getTenantDetails);

router.get("/me/tickets", getAllTenantTickets);

export default router;
