import site from "@/data/site.json";
import horaires from "@/data/horaires.json";
import { getDict, type Locale } from "@/lib/i18n";
import { href, SOIN_PAGES } from "@/lib/routes";
import { categories, programmes } from "@/lib/services";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const BUSINESS_ID = `${site.url}/#institut`;

/** Schema.org BeautySalon + DaySpa : adresse, horaires, note Google datée, carte des soins, Instagram et Planity. */
export function businessJsonLd(lang: Locale) {
  const d = getDict(lang);
  const week = horaires.week as unknown as Record<string, [string, string][] | null>;
  const hours = Object.entries(week).flatMap(([day, ranges]) => (ranges ?? []).map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[Number(day)], opens, closes })));
  const g = site.ratings.google;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["BeautySalon", "DaySpa"],
        "@id": BUSINESS_ID,
        name: site.name,
        slogan: "Face · Body · Longevity",
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/hero/soin-visage-peau-lumineuse.jpg`],
        logo: `${site.url}/logo.svg`,
        telephone: site.phoneIntl,
        priceRange: "€€",
        currenciesAccepted: "EUR",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.street}, ${site.address.floor[lang]}`,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        hasMap: site.maps,
        openingHoursSpecification: hours,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: g.value,
          reviewCount: g.count,
          bestRating: 5,
          worstRating: 1,
          description: `Google, ${g.asOf}`,
        },
        founder: { "@type": "Person", name: "Ami Sene" },
        areaServed: { "@type": "City", name: "Amiens" },
        sameAs: [site.instagram, site.bookingUrl],
        potentialAction: { "@type": "ReserveAction", target: site.bookingUrl },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: d.soins.title,
          itemListElement: [
            ...categories.map((c) => ({
              "@type": "OfferCatalog",
              name: c.name[lang],
              itemListElement: c.items.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.name[lang], ...(s.page ? { url: `${site.url}${href(lang, s.page)}` } : {}) },
                ...(s.price != null ? { price: s.price, priceCurrency: "EUR" } : {}),
              })),
            })),
            {
              "@type": "OfferCatalog",
              name: d.programmes.title,
              itemListElement: programmes.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${p.name[lang]}, ${p.length[lang]}` }, price: p.price, priceCurrency: "EUR" })),
            },
          ],
        },
        makesOffer: SOIN_PAGES.map((id) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d.pages[id].title, url: `${site.url}${href(lang, id)}` } })),
      },
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: ["fr", "en"], publisher: { "@id": BUSINESS_ID } },
    ],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(lang: Locale, name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };
}

/** Page d'un soin : Service rattaché à l'institut, avec son prix. */
export function serviceJsonLd(lang: Locale, name: string, description: string, path: string, price: number | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site.url}${path}`,
    areaServed: { "@type": "City", name: "Amiens" },
    provider: { "@id": BUSINESS_ID },
    ...(price != null ? { offers: { "@type": "Offer", price, priceCurrency: "EUR", url: site.bookingUrl } } : {}),
  };
}
