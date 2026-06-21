import { getRedis } from "./redis";

export type EmailStatus = "pending" | "sent" | "failed" | "skipped";

export interface StoredLead {
  id: string;
  receivedAt: string;
  emailStatus: EmailStatus;
  [key: string]: unknown;
}

const NINETY_DAYS = 60 * 60 * 24 * 90;

function makeId(): string {
  // App-runtime id (Date/random are fine here — this is not a workflow script).
  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Persist a lead DURABLY before/independently of the email send, so a Resend
 * outage never drops a lead. When no store is configured (local dev) it logs to
 * the server console and reports persisted=false. Production should configure
 * Upstash Redis / Vercel KV (see .env.example) for true durability + retry.
 */
export async function persistLead(
  lead: Record<string, unknown>,
): Promise<{ id: string; persisted: boolean }> {
  const id = makeId();
  const record: StoredLead = {
    ...lead,
    id,
    receivedAt: new Date().toISOString(),
    emailStatus: "pending",
  };

  const redis = getRedis();
  if (!redis) {
    console.info("[lead-store] no durable store configured; lead:", record);
    return { id, persisted: false };
  }

  try {
    await redis.set(`lead:${id}`, record, { ex: NINETY_DAYS });
    await redis.lpush("leads:inbox", id);
    return { id, persisted: true };
  } catch (err) {
    console.error("[lead-store] persist failed:", err, record);
    return { id, persisted: false };
  }
}

/** Update a persisted lead's email status; queue failures for retry. */
export async function markEmailStatus(
  id: string,
  status: EmailStatus,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const record = await redis.get<StoredLead>(`lead:${id}`);
    if (record) {
      record.emailStatus = status;
      await redis.set(`lead:${id}`, record, { ex: NINETY_DAYS });
    }
    if (status === "failed") {
      await redis.lpush("leads:retry", id);
    }
  } catch (err) {
    console.error("[lead-store] markEmailStatus failed:", err);
  }
}
