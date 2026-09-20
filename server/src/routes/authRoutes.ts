import { Router } from "express";
import { loginHandler, verifyHandler } from "../controllers/authController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginHandler);
router.get("/verify", requireAdminAuth, verifyHandler);

export default router;
