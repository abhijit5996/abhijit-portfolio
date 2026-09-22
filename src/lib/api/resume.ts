import { profile } from "@/data/profile";
import { getAdminToken } from "./auth";
import { getApiBaseUrl } from "./config";

const API_BASE_URL = getApiBaseUrl();

export type DbResumeDocument = {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  is_active: boolean;
  version: string | null;
  created_at: string;
};

/** Get the currently active public resume URL. Falls back to static resume path if API call fails. */
export async function getActiveResumeUrl(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/resume/active`);
    if (!res.ok) return profile.resumeUrl;
    const data = await res.json();
    return data.resume_url || profile.resumeUrl;
  } catch {
    return profile.resumeUrl;
  }
}

/** Admin: Fetch all uploaded resumes. */
export async function getAllResumesAdmin(): Promise<DbResumeDocument[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/resume/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch resumes.");
  }
  const data = await res.json();
  return data.resumes || [];
}

/** Admin: Upload a new resume PDF file via Express server Multer storage. */
export async function uploadNewResumeAdmin(file: File, versionStr: string = "v1.0"): Promise<DbResumeDocument> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF documents are supported for resume management.");
  }

  const token = getAdminToken();
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("version", versionStr);

  const res = await fetch(`${API_BASE_URL}/resume/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed uploading resume.");
  return data.resume;
}

/** Admin: Set a specific existing resume document as active. */
export async function setActiveResumeAdmin(id: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/resume/admin/${id}/active`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed setting active resume.");
}

/** Admin: Delete resume document. */
export async function deleteResumeAdmin(id: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/resume/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed deleting resume.");
}
