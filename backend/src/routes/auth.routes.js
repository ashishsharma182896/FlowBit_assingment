import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import { webhookSecretValidator } from "../middleware/webhookSecretValidator.middleware.js";
import { ticketDoneWebhookHandler } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

router.get("/admin/dashboard", protectRoute, adminOnly, (req, res) => {
  res.json({ message: "Welcome, admin!" });
});


router.post('/webhook/ticket-done', webhookSecretValidator, ticketDoneWebhookHandler);

export default router;
