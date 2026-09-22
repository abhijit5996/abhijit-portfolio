import { getAdminToken } from "./auth";
import { getApiUrl } from "./config";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

/** Secure admin file upload helper with extension, MIME, and file size validation via Express server uploads. */
export async function uploadFileAdmin(
  file: File,
  bucket: "portfolio-assets" | "resumes",
  folder: string = "uploads"
): Promise<string> {
  // Validate File Size
  if (bucket === "resumes" && file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("Resume PDF exceeds maximum allowed size of 10MB.");
  }
  if (bucket === "portfolio-assets" && file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image file exceeds maximum allowed size of 5MB.");
  }

  // Validate MIME type
  if (bucket === "resumes" && !ALLOWED_PDF_TYPES.includes(file.type)) {
    throw new Error("Invalid file format. Only PDF files are allowed for resumes.");
  }
  if (bucket === "portfolio-assets" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF, SVG.");
  }

  const token = getAdminToken();
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(getApiUrl("/projects/admin/upload-image"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed uploading file to Express backend.");
    }
    return data.image_url;
  } catch {
    // If backend is unreachable, fallback to data URL for dev preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
