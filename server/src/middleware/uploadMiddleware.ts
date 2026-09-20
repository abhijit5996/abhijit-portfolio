import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDir = path.join(process.cwd(), "uploads");
const projectsDir = path.join(uploadDir, "projects");
const resumesDir = path.join(uploadDir, "resumes");

// Ensure directories exist
if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir, { recursive: true });
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      cb(null, resumesDir);
    } else {
      cb(null, projectsDir);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${Date.now()}_${cleanName}`;
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
    ];
    if (allowedMime.includes(file.mimetype) || file.originalname.endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only standard images and PDF files are allowed."));
    }
  },
});
