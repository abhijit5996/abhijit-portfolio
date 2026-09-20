import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { ENV } from "../config/env.js";
import type { RowDataPacket } from "mysql2";

export type UserPayload = {
  id: string;
  email: string;
  role: string;
};

export async function loginAdmin(email: string, pass: string): Promise<{ token: string; user: UserPayload }> {
  const cleanEmail = email.trim();
  let userRecord: { id: string; email: string; password_hash: string; role: string } | null = null;

  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [cleanEmail]);
    if (rows.length > 0) {
      userRecord = rows[0] as { id: string; email: string; password_hash: string; role: string };
    }
  } catch {
    // Fallback in-memory admin check if MySQL database is not connected
    if (cleanEmail === "admin@example.com") {
      const defaultHash = await bcrypt.hash("admin123", 10);
      userRecord = { id: "admin-user-id-001", email: "admin@example.com", password_hash: defaultHash, role: "admin" };
    }
  }

  if (!userRecord) {
    throw new Error("Invalid email or password.");
  }

  const matches = await bcrypt.compare(pass, userRecord.password_hash);
  if (!matches) {
    throw new Error("Invalid email or password.");
  }

  const userPayload: UserPayload = {
    id: userRecord.id,
    email: userRecord.email,
    role: userRecord.role,
  };

  const token = jwt.sign(userPayload, ENV.JWT_SECRET, { expiresIn: "7d" });

  return { token, user: userPayload };
}

export function verifyAdminToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as UserPayload;
    return decoded;
  } catch {
    throw new Error("Unauthorized: Invalid token.");
  }
}
