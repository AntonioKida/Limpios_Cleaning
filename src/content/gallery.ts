/**
 * Before/after gallery pairs. Image paths point at LOCAL labeled placeholders in
 * /public/placeholders. TODO: replace every pair with the client's real
 * before/after work photography. Captions/room labels are translatable and live
 * in messages under `Home.beforeAfter.items.<id>`.
 */
export interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
}

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "kitchen",
    before: "/placeholders/before-kitchen.svg",
    after: "/placeholders/after-kitchen.svg",
  },
  {
    id: "bathroom",
    before: "/placeholders/before-bathroom.svg",
    after: "/placeholders/after-bathroom.svg",
  },
  {
    id: "living",
    before: "/placeholders/before-living.svg",
    after: "/placeholders/after-living.svg",
  },
];
