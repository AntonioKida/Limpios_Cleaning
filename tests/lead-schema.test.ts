import { describe, it, expect } from "vitest";
import { leadSchema, isHoneypotTripped } from "@/lib/lead-schema";

const valid = {
  audience: "business",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "4075551234",
  locale: "en",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional branch fields (business + property-manager)", () => {
    const business = leadSchema.safeParse({
      ...valid,
      spaceType: "office",
      services: ["commercial", "window-cleaning"],
      restrooms: "4",
      firstTimeDeepClean: true,
      flooring: "lvt",
      frequency: "weekly",
      company: "Acme Facilities",
      preferredContact: "email",
      message: "After 6pm please",
    });
    expect(business.success).toBe(true);

    const pm = leadSchema.safeParse({
      ...valid,
      audience: "property-manager",
      bedrooms: "3",
      bathrooms: "2",
      sqft: "1800",
      appliances: true,
      carpetCleaning: "steam-deodorizer",
      lvtSteamGrout: true,
    });
    expect(pm.success).toBe(true);
  });

  it("rejects missing/invalid required fields", () => {
    expect(leadSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, audience: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, audience: "someone-else" }).success).toBe(false);
    const { email: _e, ...noEmail } = valid;
    expect(leadSchema.safeParse(noEmail).success).toBe(false);
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
    expect(isHoneypotTripped({ website: "https://spammybot.example" })).toBe(true);
  });
  it("passes an empty/absent honeypot", () => {
    expect(isHoneypotTripped({ website: "" })).toBe(false);
    expect(isHoneypotTripped({})).toBe(false);
  });
  it("treats company as a REAL field, not the honeypot", () => {
    // Regression guard for the rename: a business name must never drop a lead.
    expect(isHoneypotTripped({ company: "Acme Facilities" } as never)).toBe(false);
    expect(leadSchema.safeParse({ ...valid, company: "Acme Facilities" }).success).toBe(true);
  });
});
