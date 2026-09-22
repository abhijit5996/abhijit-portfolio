import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

import authRoutes from "./routes/authRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

export const app = express();

// Middleware
app.use(cors({
  origin: true,
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

// Locate built frontend public assets & SSR module
const frontendPublicPaths = [
  path.resolve(process.cwd(), "..", ".output", "public"),
  path.resolve(process.cwd(), ".output", "public"),
];

const foundPublicDir = frontendPublicPaths.find((p) => fs.existsSync(p));

const ssrModulePaths = [
  path.resolve(process.cwd(), "..", ".output", "server", "_ssr", "ssr.mjs"),
  path.resolve(process.cwd(), ".output", "server", "_ssr", "ssr.mjs"),
];

let ssrHandler: { fetch: (req: Request) => Promise<Response> } | null = null;

async function getSsrHandler() {
  if (ssrHandler) return ssrHandler;
  const foundSsrPath = ssrModulePaths.find((p) => fs.existsSync(p));
  if (foundSsrPath) {
    try {
      const fileUrl = pathToFileURL(foundSsrPath).href;
      const mod = await import(fileUrl);
      ssrHandler = mod.default || mod;
      console.log(`[Express Server] Loaded SSR handler from ${foundSsrPath}`);
      return ssrHandler;
    } catch (err) {
      console.error("[Express Server] Failed to import SSR module:", err);
    }
  }
  return null;
}

if (foundPublicDir) {
  console.log(`[Express Server] Serving static frontend assets from: ${foundPublicDir}`);
  app.use(express.static(foundPublicDir, { maxAge: "1d", index: false }));
}

// Delegate all frontend page requests to TanStack Start SSR handler
app.get("*", async (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  try {
    const handler = await getSsrHandler();
    if (handler) {
      const protocol = req.protocol || "http";
      const host = req.get("host") || "localhost";
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, String(value));
        }
      }

      const webReq = new Request(fullUrl, {
        method: req.method,
        headers,
      });

      const webRes = await handler.fetch(webReq);
      res.status(webRes.status);
      webRes.headers.forEach((val, key) => {
        if (key.toLowerCase() !== "transfer-encoding") {
          res.setHeader(key, val);
        }
      });
      const htmlText = await webRes.text();
      return res.send(htmlText);
    }
  } catch (error) {
    console.error("[Express Server] SSR rendering error:", error);
  }

  return res.status(500).send("Server Error: Unable to render page.");
});
