import type { Request, Response } from "express";
import {
  createContactMessage,
  getContactMessagesAdmin,
  updateContactMessageStatusAdmin,
  deleteContactMessageAdmin,
} from "../services/contactService.js";

export async function submitContactHandler(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required." });
      return;
    }

    const created = await createContactMessage({ name: String(name), email: String(email), subject: subject ? String(subject) : undefined, message: String(message) });
    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been sent successfully.",
      data: created,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getAdminMessagesHandler(req: Request, res: Response): Promise<void> {
  try {
    const messages = await getContactMessagesAdmin();
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function updateMessageStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    if (!["unread", "read", "archived"].includes(status)) {
      res.status(400).json({ error: "Invalid status value." });
      return;
    }

    await updateContactMessageStatusAdmin(id, status as "unread" | "read" | "archived");
    res.json({ success: true, message: "Status updated successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function deleteMessageHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await deleteContactMessageAdmin(id);
    res.json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
