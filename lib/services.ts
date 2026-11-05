import data from "@/data/soins.json";
import progs from "@/data/programmes.json";
import site from "@/data/site.json";
import type { L10n, Locale } from "@/lib/locales";
import type { PageId } from "@/lib/routes";

export type Soin = { id: string; name: L10n; duration: number | null; price: number | null; note?: L10n; page?: PageId };
export type Category = { id: string; name: L10n; items: Soin[] };
export type Programme = (typeof progs.items)[number];

export const categories = data.categories as Category[];
export const soins = categories.flatMap((c) => c.items);
export const soin = (id: string) => soins.find((s) => s.id === id);
export const programmes = progs.items;
export const bridal = progs.bridal;

/** Lien de réservation : la fiche Planity du salon (Planity n'offre pas de lien direct vers une prestation). */
export const BOOKING_URL = site.bookingUrl;

/** Barre de réservation : tranches de durée. */
export const DURATIONS = {
  court: [0, 44],
  moyen: [45, 75],
  long: [76, 999],
} as const;
export type DurationKey = keyof typeof DURATIONS;

/** Catégories proposées dans la barre de réservation (sans les bilans, proposés à part). */
export const BAR_CATEGORIES = ["visage", "corps", "head-spa", "massages", "bilans"] as const;

/** Soin suggéré par la barre : premier soin de la catégorie dans la tranche de durée choisie. */
export function suggest(cat: string, dur: DurationKey | "") {
  const c = categories.find((x) => x.id === cat);
  if (!c) return null;
  const list = c.items.filter((s) => s.duration != null && s.price != null);
  if (!dur) return list[0] ?? null;
  const [a, b] = DURATIONS[dur];
  return list.find((s) => s.duration! >= a && s.duration! <= b) ?? null;
}

export const name = (s: { name: L10n }, lang: Locale) => s.name[lang];
