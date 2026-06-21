import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

// 5 requests per 10 minutes per IP. Sliding window when Redis is configured
// (global, accurate); otherwise a best-effort in-memory window (per-instance).
const MAX = 5;
const WINDOW_MS = 10 * 60 * 1000;

const redis = getRedis();
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX, "10 m"),
      prefix: "rl:lead",
      analytics: false,
    })
  : null;

const memory = new Map<string, number[]>();

function memoryLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  memory.set(ip, hits);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (memory.size > 5000) memory.clear();
  return hits.length <= MAX;
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  if (limiter) {
    const { success } = await limiter.limit(ip);
    return { success };
  }
  return { success: memoryLimit(ip) };
}
