import { useEffect, useState } from "react";
import { getApiBaseUrl } from "./config";

const API_BASE_URL = getApiBaseUrl();

export type AdminUser = {
  id: string;
  email: string;
  role: string;
};

export type AdminSession = {
  token: string;
  user: AdminUser;
};

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export async function signInAdmin(email: string, pass: string): Promise<{ user: AdminUser | null; token: string | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { user: null, token: null, error: data.error || "Login failed" };
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("admin-auth-change"));
    }

    return { user: data.user, token: data.token };
  } catch (err) {
    return { user: null, token: null, error: (err as Error).message };
  }
}

export async function signOutAdmin(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.dispatchEvent(new Event("admin-auth-change"));
  }
}

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(getAdminToken());
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const syncAuth = () => {
    const currentToken = getAdminToken();
    const storedUser = localStorage.getItem("admin_user");
    setToken(currentToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    const handleAuthChange = () => {
      syncAuth();
    };

    window.addEventListener("admin-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    const currentToken = getAdminToken();
    if (!currentToken) {
      setLoading(false);
      return () => {
        window.removeEventListener("admin-auth-change", handleAuthChange);
        window.removeEventListener("storage", handleAuthChange);
      };
    }

    void fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
      .then((res) => {
        if (!res.ok) {
          void signOutAdmin();
        }
      })
      .catch(() => {
        // Keep offline cached user session if backend is temporarily unreachable
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      window.removeEventListener("admin-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return { session: token ? { token, user: user || { id: "admin", email: "admin@example.com", role: "admin" } } : null, user, isAuthenticated: !!token, loading };
}
