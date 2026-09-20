import { pool } from "../config/db.js";
import type { RowDataPacket } from "mysql2";
import crypto from "node:crypto";

export type ResumeDocumentRecord = {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  is_active: boolean;
  version: string;
  created_at: string;
};

const defaultResumePath = "/abhijit-das-resume.pdf";

export async function getActiveResume(): Promise<string> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT file_url FROM resume_documents WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1"
    );
    if (rows.length > 0 && rows[0]?.file_url) {
      return rows[0].file_url;
    }
    return defaultResumePath;
  } catch {
    return defaultResumePath;
  }
}

export async function getAllResumesAdmin(): Promise<ResumeDocumentRecord[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM resume_documents ORDER BY created_at DESC");
    return rows as ResumeDocumentRecord[];
  } catch {
    return [];
  }
}

export async function createResumeRecordAdmin(fileName: string, filePath: string, fileUrl: string, version: string = "v1.0"): Promise<ResumeDocumentRecord> {
  const id = crypto.randomUUID();

  try {
    await pool.query("UPDATE resume_documents SET is_active = FALSE WHERE is_active = TRUE");
    await pool.query(
      "INSERT INTO resume_documents (id, file_name, file_path, file_url, is_active, version) VALUES (?, ?, ?, ?, ?, ?)",
      [id, fileName, filePath, fileUrl, true, version]
    );
  } catch (err) {
    console.warn("[Resume Service] DB query fallback:", (err as Error).message);
  }

  return {
    id,
    file_name: fileName,
    file_path: filePath,
    file_url: fileUrl,
    is_active: true,
    version,
    created_at: new Date().toISOString(),
  };
}

export async function setActiveResumeAdmin(id: string): Promise<void> {
  await pool.query("UPDATE resume_documents SET is_active = FALSE WHERE is_active = TRUE");
  await pool.query("UPDATE resume_documents SET is_active = TRUE WHERE id = ?", [id]);
}

export async function deleteResumeAdmin(id: string): Promise<void> {
  await pool.query("DELETE FROM resume_documents WHERE id = ?", [id]);
}
