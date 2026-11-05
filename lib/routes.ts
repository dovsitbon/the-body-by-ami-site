import type { Locale } from "@/lib/locales";

// Adresses des pages, traduites. Chaque soin phare a sa page, avec une adresse propre à chaque langue (hreflang).
export const PAGES = {
  demande: { fr: "demande", en: "request" },
  drainage: { fr: "drainage-lymphatique-amiens", en: "lymphatic-drainage-amiens" },
  kobido: { fr: "kobido-amiens", en: "kobido-amiens" },
  facePilates: { fr: "face-pilates-amiens", en: "face-pilates-amiens" },
  headSpa: { fr: "head-spa-amiens", en: "head-spa-amiens" },
  legal: { fr: "mentions-legales", en: "legal-notice" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageId = keyof typeof PAGES;
export const SOIN_PAGES = ["drainage", "kobido", "facePilates", "headSpa"] as const;
export type SoinPage = (typeof SOIN_PAGES)[number];

/** Chemin d'une page (« home » = accueil), avec une ancre facultative. */
export function href(lang: Locale, page: PageId | "home", hash = "") {
  const base = page === "home" ? `/${lang}` : `/${lang}/${PAGES[page][lang]}`;
  return hash ? `${base}#${hash}` : base;
}

/** Retrouve la page correspondant à un slug, quelle que soit la langue. */
export function pageOf(lang: Locale, slug: string): PageId | null {
  for (const [id, s] of Object.entries(PAGES)) if (s[lang] === slug) return id as PageId;
  return null;
}

/** Même page dans l'autre langue (sélecteur FR · EN). */
export function switchPath(pathname: string, to: Locale) {
  const [, from, slug = ""] = pathname.split("/");
  if (!slug) return `/${to}`;
  for (const s of Object.values(PAGES)) if ((s as Record<string, string>)[from] === slug) return `/${to}/${s[to]}`;
  return `/${to}`;
}
