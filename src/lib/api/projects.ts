import { projects as staticProjects, type Project } from "@/data/projects";
import { getAdminToken } from "./auth";

const API_BASE_URL = import.meta.env["VITE_API_URL"] || "http://localhost:5000/api";

export type DbProject = {
  id: string;
  slug: string;
  index_label: string;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  stack: string[];
  image_url: string;
  image_alt: string;
  live_url: string | null;
  github_url: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  year: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export function mapDbProjectToProject(db: DbProject): Project {
  const p: Project = {
    id: db.slug || db.id,
    index: db.index_label,
    title: db.title,
    subtitle: db.subtitle,
    status: db.status === "published" ? (db.live_url ? "LIVE" : "SOURCE") : "IN BUILD",
    summary: db.summary,
    highlights: db.highlights || [],
    stack: db.stack || [],
    image: db.image_url,
    imageAlt: db.image_alt,
    repo: db.github_url,
    featured: db.featured,
  };
  if (db.live_url) {
    p.live = db.live_url;
  }
  return p;
}

/** Fetch published projects for public portfolio. Falls back seamlessly to static data if Express server is unreachable. */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) return staticProjects;
    const data = await res.json();
    if (!data.projects || data.projects.length === 0) return staticProjects;
    return (data.projects as DbProject[]).map(mapDbProjectToProject);
  } catch {
    return staticProjects;
  }
}

/** Fetch all projects for Admin CMS (includes drafts & archived). */
export async function getAllProjectsAdmin(): Promise<DbProject[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/projects/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch projects.");
  }
  const data = await res.json();
  return data.projects || [];
}

/** Create new project (Admin). */
export async function createProjectAdmin(project: Omit<DbProject, "id" | "created_at" | "updated_at">): Promise<DbProject> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/projects/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed creating project.");
  return data.project;
}

/** Update project (Admin). */
export async function updateProjectAdmin(id: string, updates: Partial<DbProject>): Promise<DbProject> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/projects/admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed updating project.");
  return data.project;
}

/** Delete project (Admin). */
export async function deleteProjectAdmin(id: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/projects/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed deleting project.");
}
