import type { Request, Response } from "express";
import {
  getPublishedProjects,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProjectAdmin,
  updateProjectAdmin,
  deleteProjectAdmin,
} from "../services/projectsService.js";

export async function getProjectsHandler(req: Request, res: Response): Promise<void> {
  try {
    const projects = await getPublishedProjects();
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getProjectBySlugHandler(req: Request, res: Response): Promise<void> {
  try {
    const slug = String(req.params.slug);
    const project = await getProjectBySlug(slug);
    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getAdminProjectsHandler(req: Request, res: Response): Promise<void> {
  try {
    const projects = await getAllProjectsAdmin();
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function createProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    if (!body.title || !body.slug) {
      res.status(400).json({ error: "Title and slug are required." });
      return;
    }
    const created = await createProjectAdmin(body);
    res.status(201).json({ success: true, project: created });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function updateProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const updated = await updateProjectAdmin(id, req.body);
    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function deleteProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await deleteProjectAdmin(id);
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
