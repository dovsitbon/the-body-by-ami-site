import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { locales } from "@/lib/locales";
import { href, type PageId } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const ids: (PageId | "home")[] = ["home", "drainage", "kobido", "facePilates", "headSpa", "demande"];
  return ids.flatMap((id) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, id)}`,
      lastModified: new Date(),
      changeFrequency: id === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: id === "home" ? 1 : id === "demande" ? 0.6 : 0.9,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${href(l, id)}`])) },
    })),
  );
}

