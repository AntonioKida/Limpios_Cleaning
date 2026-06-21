import { z } from "zod";

/**
 * Server-side lead validation (independent of the client RHF schema — defense in
 * depth). Shared so it can be unit-tested. Lengths are bounded to limit abuse.
 */
export const leadSchema = z.object({
  service: z.string().min(1).max(60),
  propertyType: z.string().min(1).max(60),
  bedrooms: z.string().max(20).optional(),
  bathrooms: z.string().max(20).optional(),
  sqft: z.string().max(20).optional(),
  frequency: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(5).max(40),
  address: z.string().max(300).optional(),
  message: z.string().max(2000).optional(),
  locale: z.string().max(5).optional(),
  // Honeypot — bots tend to fill every field. Accepted here, checked separately.
  company: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** True when the honeypot field was filled (likely a bot). */
export function isHoneypotTripped(lead: { company?: string }): boolean {
  return Boolean(lead.company && lead.company.length > 0);
}
