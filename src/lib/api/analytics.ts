import { getAdminToken } from "./auth";
import { getApiUrl } from "./config";

export type EventName =
  | "page_view"
  | "project_view"
  | "resume_download"
  | "github_click"
  | "live_demo_click"
  | "contact_submit";

export type DbAnalyticsEvent = {
  id: string;
  event_name: string;
  page_path: string;
  project_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export async function trackEvent(
  eventName: EventName,
  data?: { pagePath?: string; projectId?: string; [key: string]: unknown }
): Promise<void> {
  try {
    const pagePath = data?.pagePath || (typeof window !== "undefined" ? window.location.pathname : "/");
    const projectId = data?.projectId || null;
    const metadata = data ? { ...data } : {};

    delete metadata.pagePath;
    delete metadata.projectId;

    await fetch(getApiUrl("/analytics/event"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        page_path: pagePath,
        project_id: projectId,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      }),
    });
  } catch (err) {
    console.debug("[Analytics API] Failed tracking event:", err);
  }
}

/** Admin: Fetch analytics events and metric counts. */
export async function getAnalyticsAdmin(): Promise<{
  events: DbAnalyticsEvent[];
  counts: Record<string, number>;
}> {
  const token = getAdminToken();
  const res = await fetch(getApiUrl("/analytics/admin"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed fetching analytics.");
  }
  return res.json();
}
