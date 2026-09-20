/**
 * Email Notification Service Abstraction
 * Configurable via environment variables (e.g. RESEND_API_KEY, OWNER_EMAIL, SMTP_SERVER)
 */

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt: string;
};

export async function sendContactEmailNotification(payload: ContactEmailPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = import.meta.env["VITE_RESEND_API_KEY"] || (typeof process !== "undefined" ? process.env["RESEND_API_KEY"] : undefined);
  const recipientEmail = import.meta.env["VITE_OWNER_EMAIL"] || "abhijitskv3@gmail.com";

  if (!apiKey) {
    console.info("[Email Service] Notification saved to DB. (RESEND_API_KEY not configured for live SMTP relay)");
    return { success: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: recipientEmail,
        subject: `NEW PORTFOLIO CONTACT: ${payload.subject || "Message from " + payload.name}`,
        html: `
          <div style="font-family: monospace; line-height: 1.6; color: #222;">
            <h2>NEW PORTFOLIO CONTACT</h2>
            <hr />
            <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(payload.subject || "Portfolio Contact")}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f4f4f0; padding: 12px; border-left: 3px solid #2563eb;">
              ${escapeHtml(payload.message).replace(/\n/g, "<br/>")}
            </blockquote>
            <p><strong>Submitted:</strong> ${payload.submittedAt}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("[Email Service] Failed sending notification:", errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[Email Service] Network/Email error:", msg);
    return { success: false, error: msg };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
