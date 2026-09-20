import { pool } from "../config/db.js";
import type { RowDataPacket } from "mysql2";
import crypto from "node:crypto";

export type ProjectRecord = {
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

const staticFallbackProjects: ProjectRecord[] = [
  {
    id: "medconnect-uuid",
    slug: "medconnect",
    index_label: "001",
    title: "MedConnect",
    subtitle: "Full-Stack Healthcare Management Platform",
    summary: "A healthcare management platform covering appointment booking, patient records, health vitals monitoring and telemedicine workflows.",
    highlights: ["Role-based authentication with separate dashboards for patients, doctors and administrators.", "Appointment management, availability scheduling and patient history access.", "Express.js APIs and MongoDB data management behind a responsive frontend."],
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB"],
    image_url: "/src/assets/project-medconnect.jpg",
    image_alt: "MedConnect dashboard with appointments, patient vitals and doctor list",
    live_url: "https://medconnect-8x1l.onrender.com",
    github_url: "https://github.com/abhijit5996/MedConnect",
    status: "published",
    featured: true,
    year: "2026",
    sort_order: 1,
  },
  {
    id: "fiteats-uuid",
    slug: "fiteats",
    index_label: "002",
    title: "FitEats",
    subtitle: "Food Ordering & Recommendation Platform",
    summary: "A full-stack food ordering application featuring a personalized recommendation engine to enhance user engagement.",
    highlights: ["Developed and deployed the full-stack ordering application on Render.", "Personalized recommendation engine integrated into the ordering flow."],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    image_url: "/src/assets/project-fiteats.jpg",
    image_alt: "FitEats meal ordering interface with nutrition summary",
    live_url: "https://final-nutriorder.onrender.com",
    github_url: "https://github.com/abhijit5996/FitEats-Food-Recommendation-and-Delivery-Partner",
    status: "published",
    featured: true,
    year: "2026",
    sort_order: 2,
  },
  {
    id: "recsys-uuid",
    slug: "recommendation-system",
    index_label: "003",
    title: "Intelligent Recommendation System",
    subtitle: "ML-Based Suggestion Engine",
    summary: "A machine-learning recommendation engine using content-based filtering to provide tailored user suggestions.",
    highlights: ["Engineered a recommendation engine using content-based filtering techniques."],
    stack: ["Python", "Pandas", "NumPy", "Streamlit", "Machine Learning"],
    image_url: "/src/assets/project-recsys.jpg",
    image_alt: "Streamlit recommendation dashboard with similarity scores",
    live_url: null,
    github_url: "https://github.com/abhijit5996/Python-Project-Recommendation-System",
    status: "published",
    featured: false,
    year: "2026",
    sort_order: 3,
  },
  {
    id: "pathfinder-uuid",
    slug: "pathfinder",
    index_label: "004",
    title: "PathFinder",
    subtitle: "Travelling Salesman Problem Visualization Tool",
    summary: "An interactive algorithm visualization tool that computes and maps optimal routes across complex multi-node networks.",
    highlights: ["Interactive visualization of route optimization and TSP concepts."],
    stack: ["React.js", "JavaScript", "Algorithm Visualization"],
    image_url: "/src/assets/project-pathfinder.jpg",
    image_alt: "Route optimization visualizer with nodes and optimal path",
    live_url: null,
    github_url: "https://github.com/abhijit5996/pathfinder-pro",
    status: "published",
    featured: false,
    year: "2026",
    sort_order: 4,
  },
  {
    id: "transithub-uuid",
    slug: "transithub",
    index_label: "005",
    title: "TransitHub",
    subtitle: "Last-Mile Transit Solution",
    summary: "A scalable transit platform focused on last-mile transportation.",
    highlights: ["Architected with TypeScript for type-safe components, improving maintainability and reducing runtime errors."],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image_url: "/src/assets/project-transithub.jpg",
    image_alt: "Transit platform with routes, live map and schedules",
    live_url: null,
    github_url: "https://github.com/abhijit5996/Transit-Hub",
    status: "published",
    featured: false,
    year: "2026",
    sort_order: 5,
  },
  {
    id: "khet-uuid",
    slug: "khet-se-ghar-tak",
    index_label: "006",
    title: "Khet-se-ghar-tak",
    subtitle: "Farm-to-Table E-Commerce Platform",
    summary: "A responsive farm-to-consumer e-commerce platform designed to facilitate direct farmer-to-consumer transactions.",
    highlights: ["Engineered to streamline the supply chain between farmers and consumers."],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image_url: "/src/assets/project-khetseghartak.jpg",
    image_alt: "Farm-to-table e-commerce storefront with produce and farmer profiles",
    live_url: null,
    github_url: "https://github.com/abhijit5996/grocer-roots-link",
    status: "published",
    featured: false,
    year: "2026",
    sort_order: 6,
  },
];

export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC"
    );
    if (rows.length === 0) return staticFallbackProjects;
    return rows.map(formatProjectRow);
  } catch {
    return staticFallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM projects WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug]
    );
    if (rows.length === 0) return staticFallbackProjects.find((p) => p.slug === slug) || null;
    return formatProjectRow(rows[0]);
  } catch {
    return staticFallbackProjects.find((p) => p.slug === slug) || null;
  }
}

export async function getAllProjectsAdmin(): Promise<ProjectRecord[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM projects ORDER BY sort_order ASC");
    if (rows.length === 0) return staticFallbackProjects;
    return rows.map(formatProjectRow);
  } catch {
    return staticFallbackProjects;
  }
}

export async function createProjectAdmin(p: Omit<ProjectRecord, "id">): Promise<ProjectRecord> {
  const id = crypto.randomUUID();
  const highlightsJson = JSON.stringify(p.highlights || []);
  const stackJson = JSON.stringify(p.stack || []);

  const record: ProjectRecord = {
    ...p,
    id,
    highlights: p.highlights || [],
    stack: p.stack || [],
    image_url: p.image_url || "/placeholder.svg",
    image_alt: p.image_alt || p.title,
    live_url: p.live_url || null,
    github_url: p.github_url || "",
    status: p.status || "published",
    featured: Boolean(p.featured),
    year: p.year || "2026",
    sort_order: p.sort_order || staticFallbackProjects.length + 1,
  };

  try {
    await pool.query(
      `INSERT INTO projects (id, slug, index_label, title, subtitle, summary, highlights, stack, image_url, image_alt, live_url, github_url, status, featured, year, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        record.slug,
        record.index_label,
        record.title,
        record.subtitle,
        record.summary,
        highlightsJson,
        stackJson,
        record.image_url,
        record.image_alt,
        record.live_url,
        record.github_url,
        record.status,
        record.featured ? 1 : 0,
        record.year,
        record.sort_order,
      ]
    );
  } catch (err) {
    console.warn("[Projects Service] DB insert fallback:", (err as Error).message);
    staticFallbackProjects.push(record);
  }

  return record;
}

export async function updateProjectAdmin(id: string, p: Partial<ProjectRecord>): Promise<ProjectRecord> {
  const updates: string[] = [];
  const params: unknown[] = [];

  if (p.slug !== undefined) { updates.push("slug = ?"); params.push(p.slug); }
  if (p.index_label !== undefined) { updates.push("index_label = ?"); params.push(p.index_label); }
  if (p.title !== undefined) { updates.push("title = ?"); params.push(p.title); }
  if (p.subtitle !== undefined) { updates.push("subtitle = ?"); params.push(p.subtitle); }
  if (p.summary !== undefined) { updates.push("summary = ?"); params.push(p.summary); }
  if (p.highlights !== undefined) { updates.push("highlights = ?"); params.push(JSON.stringify(p.highlights)); }
  if (p.stack !== undefined) { updates.push("stack = ?"); params.push(JSON.stringify(p.stack)); }
  if (p.image_url !== undefined) { updates.push("image_url = ?"); params.push(p.image_url); }
  if (p.image_alt !== undefined) { updates.push("image_alt = ?"); params.push(p.image_alt); }
  if (p.live_url !== undefined) { updates.push("live_url = ?"); params.push(p.live_url || null); }
  if (p.github_url !== undefined) { updates.push("github_url = ?"); params.push(p.github_url); }
  if (p.status !== undefined) { updates.push("status = ?"); params.push(p.status); }
  if (p.featured !== undefined) { updates.push("featured = ?"); params.push(p.featured ? 1 : 0); }
  if (p.year !== undefined) { updates.push("year = ?"); params.push(p.year); }
  if (p.sort_order !== undefined) { updates.push("sort_order = ?"); params.push(p.sort_order); }

  try {
    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM projects WHERE id = ?", [id]);
    if (rows.length > 0) {
      return formatProjectRow(rows[0]);
    }
  } catch (err) {
    console.warn("[Projects Service] DB update fallback:", (err as Error).message);
  }

  // Fallback in-memory project update
  const staticIndex = staticFallbackProjects.findIndex((item) => item.id === id || item.slug === p.slug);
  if (staticIndex !== -1) {
    staticFallbackProjects[staticIndex] = {
      ...staticFallbackProjects[staticIndex],
      ...p,
    };
    return staticFallbackProjects[staticIndex];
  }

  return {
    id,
    slug: p.slug || "project",
    index_label: p.index_label || "001",
    title: p.title || "Project",
    subtitle: p.subtitle || "",
    summary: p.summary || "",
    highlights: p.highlights || [],
    stack: p.stack || [],
    image_url: p.image_url || "/placeholder.svg",
    image_alt: p.image_alt || "",
    live_url: p.live_url || null,
    github_url: p.github_url || "",
    status: p.status || "published",
    featured: Boolean(p.featured),
    year: p.year || "2026",
    sort_order: p.sort_order || 1,
  };
}

export async function deleteProjectAdmin(id: string): Promise<void> {
  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [id]);
  } catch (err) {
    console.warn("[Projects Service] DB delete fallback:", (err as Error).message);
  }

  const idx = staticFallbackProjects.findIndex((item) => item.id === id);
  if (idx !== -1) {
    staticFallbackProjects.splice(idx, 1);
  }
}

function formatProjectRow(row: RowDataPacket | any): ProjectRecord {
  return {
    id: row.id,
    slug: row.slug,
    index_label: row.index_label,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    highlights: typeof row.highlights === "string" ? JSON.parse(row.highlights) : row.highlights || [],
    stack: typeof row.stack === "string" ? JSON.parse(row.stack) : row.stack || [],
    image_url: row.image_url,
    image_alt: row.image_alt,
    live_url: row.live_url,
    github_url: row.github_url,
    status: row.status,
    featured: Boolean(row.featured),
    year: row.year,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
