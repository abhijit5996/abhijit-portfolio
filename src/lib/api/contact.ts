import { sendContactEmailNotification } from "./email";
import { trackEvent } from "./analytics";
import { getAdminToken } from "./auth";

const API_BASE_URL = import.meta.env["VITE_API_URL"] || "http://localhost:5000/api";

export type ContactSubmission = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type DbContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
  updated_at: string;
};

// In-memory client rate-limiting store (max 3 messages per 5 minutes per session)
const submissionHistory: number[] = [];

export async function submitContactForm(payload: ContactSubmission): Promise<{ success: boolean; message?: string }> {
  // 1. Rate limiting check
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recentSubmissions = submissionHistory.filter((t) => now - t < windowMs);
  if (recentSubmissions.length >= 3) {
    return { success: false, message: "Too many messages sent. Please wait a few minutes before trying again." };
  }

  // 2. Client-side validation & sanitization
  const trimmedName = payload.name.trim();
  const trimmedEmail = payload.email.trim();
  const trimmedSubject = (payload.subject || "Portfolio Contact").trim();
  const trimmedMessage = payload.message.trim();

  if (!trimmedName || trimmedName.length > 100) {
    return { success: false, message: "Please provide a valid name under 100 characters." };
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
    return { success: false, message: "Please provide a valid email address." };
  }
  if (!trimmedMessage || trimmedMessage.length > 1000) {
    return { success: false, message: "Please provide a message under 1000 characters." };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || "Could not send message." };
    }

    submissionHistory.push(now);

    // Trigger Email Notification fallback if configured
    void sendContactEmailNotification({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      submittedAt: new Date().toLocaleString(),
    });

    // Track Analytics
    void trackEvent("contact_submit", { email: trimmedEmail });

    return { success: true, message: data.message || "Message sent successfully — I will respond shortly." };
  } catch (err) {
    console.error("[Contact API] Fetch error:", err);
    return { success: false, message: "Server connection failed. Please try again or email directly." };
  }
}

/** Admin: Fetch all messages. */
export async function getContactMessagesAdmin(): Promise<DbContactMessage[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/contact/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch contact messages.");
  }
  const data = await res.json();
  return data.messages || [];
}

/** Admin: Update message status (read / archived). */
export async function updateMessageStatusAdmin(id: string, status: "unread" | "read" | "archived"): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/contact/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to update status.");
}

/** Admin: Delete message. */
export async function deleteMessageAdmin(id: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/contact/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete message.");
}
