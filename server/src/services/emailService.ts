import { ENV } from "../config/env.js";

export type EmailNotificationPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt: string;
};

export async function sendEmailNotification(payload: EmailNotificationPayload): Promise<boolean> {
  if (!ENV.RESEND_API_KEY) {
    console.info("[Email Service] Notification recorded in database. (RESEND_API_KEY not configured)");
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ENV.OWNER_EMAIL,
        subject: `NEW PORTFOLIO CONTACT: ${payload.subject || "Message from " + payload.name}`,
        html: `
          <div style="font-family: monospace; line-height: 1.6; color: #222;">
            <h2>NEW PORTFOLIO CONTACT</h2>
            <hr />
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Subject:</strong> ${payload.subject || "Portfolio Contact"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f4f4f0; padding: 12px; border-left: 3px solid #2563eb;">
              ${payload.message.replace(/\n/g, "<br/>")}
            </blockquote>
            <p><strong>Submitted:</strong> ${payload.submittedAt}</p>
          </div>
        `,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn("[Email Service] Failed sending email notification:", err);
    return false;
  }
}
