import type { Request, Response } from "express";
import {
  getActiveResume,
  getAllResumesAdmin,
  createResumeRecordAdmin,
  setActiveResumeAdmin,
  deleteResumeAdmin,
} from "../services/resumeService.js";

export async function getActiveResumeHandler(req: Request, res: Response): Promise<void> {
  try {
    const resumeUrl = await getActiveResume();
    res.json({ resume_url: resumeUrl });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getAdminResumesHandler(req: Request, res: Response): Promise<void> {
  try {
    const resumes = await getAllResumesAdmin();
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function uploadResumeHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const fileUrl = `/uploads/resumes/${file.filename}`;
    const version = (req.body.version || "v1.0").trim();

    const created = await createResumeRecordAdmin(file.originalname, file.path, fileUrl, version);
    res.status(201).json({ success: true, resume: created });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function setActiveResumeHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await setActiveResumeAdmin(id);
    res.json({ success: true, message: "Active resume updated successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function deleteResumeHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await deleteResumeAdmin(id);
    res.json({ success: true, message: "Resume record deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
