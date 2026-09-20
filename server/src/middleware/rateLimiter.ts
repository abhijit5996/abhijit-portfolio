import type { Request, Response, NextFunction } from "express";

const requestsMap = new Map<string, number[]>();

export function rateLimiter(limit: number = 5, windowMs: number = 5 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const timestamps = requestsMap.get(ip) || [];

    const recent = timestamps.filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      res.status(429).json({ error: "Too many requests. Please wait a few minutes before trying again." });
      return;
    }

    recent.push(now);
    requestsMap.set(ip, recent);
    next();
  };
}
