export const getApiBaseUrl = (): string => {
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
  return `http://localhost:${port}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
