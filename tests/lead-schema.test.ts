import { describe, it, expect } from "vitest";
import { leadSchema, isHoneypotTripped } from "@/lib/lead-schema";

const valid = {
  service: "deep-cleaning",
  propertyType: "house",
  frequency: "biweekly",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "4075551234",
  locale: "en",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional fields", () => {
    const r = leadSchema.safeParse({
      ...valid,
      bedrooms: "3",
      bathrooms: "2",
      sqft: "1800",
      address: "Clermont, FL",
      message: "Two cats at home",
    });
    expect(r.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    expect(leadSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, service: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, frequency: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(leadSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a too-short phone", () => {
    expect(leadSchema.safeParse({ ...valid, phone: "12" }).success).toBe(false);
  });

  it("bounds field lengths (anti-abuse)", () => {
    expect(leadSchema.safeParse({ ...valid, name: "x".repeat(200) }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "x".repeat(3000) }).success).toBe(false);
  });
});

describe("honeypot", () => {
  it("detects a filled honeypot", () => {
    expect(isHoneypotTripped({ company: "spammybot" })).toBe(true);
  });
  it("passes an empty/absent honeypot", () => {
    expect(isHoneypotTripped({ company: "" })).toBe(false);
    expect(isHoneypotTripped({})).toBe(false);
  });
});
