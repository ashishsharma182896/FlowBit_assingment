import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
// Optionally: import tenantDataFilter if you use it separately
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/supportTicket.controller.js";

const router = express.Router();

// All routes are protected (authenticated)
router.use(protectRoute);

// Create a new ticket
router.post("/", createTicket);

// Get all tickets for the tenant
router.get("/", getTickets);

// Get a specific ticket by ID (within the tenant)
router.get("/:id", getTicketById);

// Update ticket by ID (status/details)
router.put("/:id", updateTicket);
router.patch("/:id", updateTicket);

// Delete ticket by ID (optional)
router.delete("/:id", deleteTicket);

export default router;
