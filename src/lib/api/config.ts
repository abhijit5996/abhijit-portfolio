export function getApiBaseUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_API_URL"]) {
    return import.meta.env["VITE_API_URL"];
  }
  if (typeof process !== "undefined" && process.env && process.env["VITE_API_URL"]) {
    return process.env["VITE_API_URL"];
  }
  if (typeof window !== "undefined") {
    return "/api";
  }
  const port = (typeof process !== "undefined" && process.env && process.env.PORT) || "5000";
  return `http://127.0.0.1:${port}/api`;
}

export function getApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
