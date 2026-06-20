/**
 * ⚠️  PLACEHOLDER / SAMPLE TESTIMONIALS — NOT real customer reviews.
 *
 * These exist only to demonstrate the reviews UI. They must be REPLACED with
 * real, verifiable Google reviews before launch. Do NOT ship fake reviews to
 * production. The `reviewsArePlaceholder` flag gates AggregateRating/Review
 * JSON-LD so structured data is never emitted for fabricated reviews.
 *
 * Names/cities are sample proper nouns; quote text is translatable and lives in
 * the message catalogs under `Reviews.items.<id>`.
 */

export const reviewsArePlaceholder = true;

export type ReviewId = "r1" | "r2" | "r3" | "r4" | "r5" | "r6";

export interface Review {
  id: ReviewId;
  /** Sample name — replace with real reviewer. */
  name: string;
  /** Sample city. */
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date — placeholder. */
  date: string;
  /** Show on the homepage testimonials section. */
  featured: boolean;
}

export const reviews: Review[] = [
  { id: "r1", name: "Jessica M.", city: "Clermont", rating: 5, date: "2025-09-12", featured: true },
  { id: "r2", name: "David R.", city: "Winter Garden", rating: 5, date: "2025-08-03", featured: true },
  { id: "r3", name: "María G.", city: "Minneola", rating: 5, date: "2025-07-21", featured: true },
  { id: "r4", name: "Brandon T.", city: "Horizon West", rating: 5, date: "2025-10-05", featured: true },
  { id: "r5", name: "Ana L.", city: "Groveland", rating: 5, date: "2025-06-18", featured: false },
  { id: "r6", name: "Kevin P.", city: "Four Corners", rating: 5, date: "2025-05-29", featured: false },
];
