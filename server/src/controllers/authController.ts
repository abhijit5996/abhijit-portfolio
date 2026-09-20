import type { Request, Response } from "express";
import { loginAdmin } from "../services/authService.js";

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const result = await loginAdmin(String(email), String(password));
    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
}

export async function verifyHandler(req: Request, res: Response): Promise<void> {
  // If request passed requireAdminAuth middleware, user is attached
  res.json({ success: true, valid: true });
}
