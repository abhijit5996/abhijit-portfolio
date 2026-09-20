import express from "express";
import cors from "cors";
import path from "node:path";

import authRoutes from "./routes/authRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

export const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow configured origins
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Abhijit Das Portfolio Express API",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 Handler for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});
