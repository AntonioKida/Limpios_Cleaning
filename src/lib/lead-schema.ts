import { z } from "zod";

/**
 * Server-side lead validation (independent of the client RHF schema — defense in
 * depth). Shared so it can be unit-tested. The estimate form forks by AUDIENCE
 * (business vs property manager); most branch fields are optional — they make the
 * lead quote-ready, but the free walkthrough confirms specifics — so only the
 * audience + contact details are required. Lengths are bounded to limit abuse.
 */
const optStr = (max: number) => z.string().max(max).optional();

export const leadSchema = z.object({
  audience: z.enum(["business", "property-manager"]),

  // ── Business branch (all optional) ─────────────────────────────────────────
  spaceType: optStr(40),
  services: z.array(z.string().max(40)).max(12).optional(),
  restrooms: optStr(20),
  offices: optStr(20),
  conferenceRooms: optStr(20),
  windows: optStr(20),
  flooring: optStr(40),
  lastCleaning: optStr(120),
  firstTimeDeepClean: z.boolean().optional(),
  blindsType: optStr(120),
  specialSurfaces: optStr(400),

  // ── Property-manager branch (all optional) ─────────────────────────────────
  bedrooms: optStr(20),
  bathrooms: optStr(20),
  sqft: optStr(20),
  carpetCleaning: optStr(40),
  appliances: z.boolean().optional(),
  blinds: z.boolean().optional(),
  lvtSteam: z.boolean().optional(),
  lvtSteamGrout: z.boolean().optional(),

  // ── Shared ─────────────────────────────────────────────────────────────────
  frequency: optStr(40),
  name: z.string().min(1).max(120),
  company: optStr(160),
  email: z.string().email().max(160),
  phone: z.string().min(5).max(40),
  preferredContact: optStr(20),
  message: optStr(2000),
  consent: z.boolean().optional(),
  locale: optStr(5),

  // Honeypot — bots tend to fill every field. Accepted here, checked separately.
  website: optStr(200),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** True when the honeypot field was filled (likely a bot). */
export function isHoneypotTripped(lead: { website?: string }): boolean {
  return Boolean(lead.website && lead.website.length > 0);
}
