import { Router } from "express";
import {
  getProjectsHandler,
  getProjectBySlugHandler,
  getAdminProjectsHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controllers/projectsController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProjectsHandler);
router.get("/slug/:slug", getProjectBySlugHandler);

// Admin protected routes
router.get("/admin/all", requireAdminAuth, getAdminProjectsHandler);
router.post("/admin", requireAdminAuth, createProjectHandler);
router.put("/admin/:id", requireAdminAuth, updateProjectHandler);
router.delete("/admin/:id", requireAdminAuth, deleteProjectHandler);

// Admin asset upload route for project images
router.post("/admin/upload-image", requireAdminAuth, uploadMiddleware.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No image file uploaded." });
    return;
  }
  const imageUrl = `/uploads/projects/${req.file.filename}`;
  res.json({ success: true, image_url: imageUrl });
});

export default router;
