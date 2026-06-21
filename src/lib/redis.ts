import { Redis } from "@upstash/redis";

/**
 * Lazily resolve an Upstash Redis client from env. Supports both the Upstash
 * naming (`UPSTASH_REDIS_REST_*`) and the Vercel KV / Marketplace naming
 * (`KV_REST_API_*`). Returns null when unconfigured (e.g. local dev) so callers
 * can fall back gracefully.
 */
let cached: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  cached = url && token ? new Redis({ url, token }) : null;
  return cached;
}

export function hasDurableStore(): boolean {
  return getRedis() !== null;
}
