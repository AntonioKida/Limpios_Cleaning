import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { serviceSlugs } from "@/content/services";
import { citySlugs } from "@/content/cities";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const entries: Entry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  ...serviceSlugs.map((s) => ({
    path: `/services/${s}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/service-areas", changeFrequency: "monthly", priority: 0.8 },
  ...citySlugs.map((c) => ({
    path: `/service-areas/${c}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/trusted-by", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/quote", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return entries.flatMap((entry) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${site.url}/${locale}${entry.path}`;
    }
    return routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }));
  });
}
