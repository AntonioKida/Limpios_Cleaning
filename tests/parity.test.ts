import { describe, it, expect } from "vitest";
import en from "../messages/en.json";
import es from "../messages/es.json";

/** Flatten an object/array to its leaf key paths (so missing keys are caught). */
function leafKeys(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => leafKeys(v, `${prefix}.${i}`));
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) =>
      leafKeys(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

/** Extract ICU placeholder names ({name}) from a string. */
function placeholders(s: string): string[] {
  return [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();
}

function flatStrings(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => Object.assign(out, flatStrings(v, `${prefix}.${i}`)));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      Object.assign(out, flatStrings(v, prefix ? `${prefix}.${k}` : k));
    }
  } else if (typeof obj === "string") {
    out[prefix] = obj;
  }
  return out;
}

describe("i18n catalog parity (EN ⇄ ES)", () => {
  const enKeys = leafKeys(en).sort();
  const esKeys = leafKeys(es).sort();

  it("EN and ES have identical key sets", () => {
    const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
    const missingInEn = esKeys.filter((k) => !enKeys.includes(k));
    expect({ missingInEs, missingInEn }).toEqual({
      missingInEs: [],
      missingInEn: [],
    });
  });

  it("ICU placeholders match per key", () => {
    const enS = flatStrings(en);
    const esS = flatStrings(es);
    const mismatches: string[] = [];
    for (const key of Object.keys(enS)) {
      const a = placeholders(enS[key]).join(",");
      const b = placeholders(esS[key] ?? "").join(",");
      if (a !== b) mismatches.push(`${key}: en[${a}] vs es[${b}]`);
    }
    expect(mismatches).toEqual([]);
  });
});
