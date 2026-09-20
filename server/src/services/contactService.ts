import { pool } from "../config/db.js";
import { sendEmailNotification } from "./emailService.js";
import type { RowDataPacket } from "mysql2";
import crypto from "node:crypto";

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
  updated_at: string;
};

export async function createContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessageRecord> {
  const id = crypto.randomUUID();
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = (data.subject || "Portfolio Contact").trim();
  const message = data.message.trim();

  const record: ContactMessageRecord = {
    id,
    name,
    email,
    subject,
    message,
    status: "unread",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await pool.query(
      "INSERT INTO contact_messages (id, name, email, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, subject, message, "unread"]
    );
  } catch (err) {
    console.warn("[Contact Service] DB query fallback:", (err as Error).message);
  }

  void sendEmailNotification({
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toLocaleString(),
  });

  return record;
}

export async function getContactMessagesAdmin(): Promise<ContactMessageRecord[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return rows as ContactMessageRecord[];
  } catch {
    return [];
  }
}

export async function updateContactMessageStatusAdmin(id: string, status: "unread" | "read" | "archived"): Promise<void> {
  await pool.query("UPDATE contact_messages SET status = ? WHERE id = ?", [status, id]);
}

export async function deleteContactMessageAdmin(id: string): Promise<void> {
  await pool.query("DELETE FROM contact_messages WHERE id = ?", [id]);
}
