import { Router } from "express";
import { logEventHandler, getAdminAnalyticsHandler } from "../controllers/analyticsController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Public route to log events
router.post("/event", logEventHandler);

// Admin route to retrieve analytics metrics
router.get("/admin", requireAdminAuth, getAdminAnalyticsHandler);

export default router;
