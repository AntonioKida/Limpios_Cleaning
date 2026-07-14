/**
 * Clients Limpios has served, per Papo: State Farm, The UPS Store, United
 * Rentals, Riance Realty, Estrella Insurance.
 *
 * ⚠️  BUILT BUT DISABLED ON PURPOSE. Do NOT set `clientsServedEnabled` to true
 * until Papo has *written permission from each named client* to use their name
 * (and/or logo) publicly. Naming clients without consent is a legal and
 * misrepresentation risk — same reason the reviews stay placeholders. When the
 * permissions are on file, flip the flag below (a one-flag change) and the
 * "Trusted by" strip renders on the homepage. See `ClientsServed`.
 */
export const clientsServedEnabled = false;

export interface ClientRef {
  /** Client's public-facing name. */
  name: string;
  /** Optional logo path in /public — only add once we have a real, permitted file. */
  logo?: string;
}

export const clientsServed: ClientRef[] = [
  { name: "State Farm" },
  { name: "The UPS Store" },
  { name: "United Rentals" },
  { name: "Riance Realty" },
  { name: "Estrella Insurance" },
];
