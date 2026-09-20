import { Router } from "express";
import {
  getActiveResumeHandler,
  getAdminResumesHandler,
  uploadResumeHandler,
  setActiveResumeHandler,
  deleteResumeHandler,
} from "../controllers/resumeController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = Router();

// Public route to get active resume URL
router.get("/active", getActiveResumeHandler);

// Admin protected routes
router.get("/admin", requireAdminAuth, getAdminResumesHandler);
router.post("/admin/upload", requireAdminAuth, uploadMiddleware.single("resume"), uploadResumeHandler);
router.patch("/admin/:id/active", requireAdminAuth, setActiveResumeHandler);
router.delete("/admin/:id", requireAdminAuth, deleteResumeHandler);

export default router;
