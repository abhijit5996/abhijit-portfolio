import { pool } from "../config/db.js";
import type { RowDataPacket } from "mysql2";
import crypto from "node:crypto";

export type AnalyticsEventRecord = {
  id: string;
  event_name: string;
  page_path: string;
  project_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export async function logAnalyticsEvent(eventName: string, pagePath?: string, projectId?: string, metadata?: Record<string, unknown>): Promise<void> {
  const id = crypto.randomUUID();
  const path = pagePath || "/";
  const proj = projectId || null;
  const metaJson = metadata ? JSON.stringify(metadata) : null;

  try {
    await pool.query(
      "INSERT INTO analytics_events (id, event_name, page_path, project_id, metadata) VALUES (?, ?, ?, ?, ?)",
      [id, eventName, path, proj, metaJson]
    );
  } catch (err) {
    console.debug("[Analytics Service] DB record error:", (err as Error).message);
  }
}

export async function getAnalyticsAdmin(): Promise<{ events: AnalyticsEventRecord[]; counts: Record<string, number> }> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 200");
    const events = rows.map((r) => ({
      id: r.id,
      event_name: r.event_name,
      page_path: r.page_path,
      project_id: r.project_id,
      metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata,
      created_at: r.created_at,
    })) as AnalyticsEventRecord[];

    const counts: Record<string, number> = {};
    events.forEach((e) => {
      counts[e.event_name] = (counts[e.event_name] || 0) + 1;
    });

    return { events, counts };
  } catch {
    return { events: [], counts: {} };
  }
}
