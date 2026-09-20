import type { Request, Response } from "express";
import { logAnalyticsEvent, getAnalyticsAdmin } from "../services/analyticsService.js";

export async function logEventHandler(req: Request, res: Response): Promise<void> {
  try {
    const { event_name, page_path, project_id, metadata } = req.body;
    if (!event_name) {
      res.status(400).json({ error: "event_name is required." });
      return;
    }

    await logAnalyticsEvent(event_name, page_path, project_id, metadata);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getAdminAnalyticsHandler(req: Request, res: Response): Promise<void> {
  try {
    const data = await getAnalyticsAdmin();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
