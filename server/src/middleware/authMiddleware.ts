import type { Request, Response, NextFunction } from "express";
import { verifyAdminToken, type UserPayload } from "../services/authService.js";

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Access token missing" });
    return;
  }

  const token = authHeader.substring(7).trim();
  try {
    const user = verifyAdminToken(token);
    if (user.role !== "admin") {
      res.status(403).json({ error: "Forbidden: Admin privileges required" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
}
