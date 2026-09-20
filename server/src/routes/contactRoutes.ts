import { Router } from "express";
import {
  submitContactHandler,
  getAdminMessagesHandler,
  updateMessageStatusHandler,
  deleteMessageHandler,
} from "../controllers/contactController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = Router();
const contactRateLimiter = rateLimiter(5, 5 * 60 * 1000);

// Public submission with rate limiting
router.post("/", contactRateLimiter, submitContactHandler);

// Admin protected routes
router.get("/admin", requireAdminAuth, getAdminMessagesHandler);
router.patch("/admin/:id/status", requireAdminAuth, updateMessageStatusHandler);
router.delete("/admin/:id", requireAdminAuth, deleteMessageHandler);

export default router;
