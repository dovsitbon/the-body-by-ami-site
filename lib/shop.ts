import horaires from "@/data/horaires.json";
import offres from "@/data/offres.json";
import { intlLocale, type L10n, type Locale } from "@/lib/locales";

type Range = [string, string];
const week = horaires.week as unknown as Record<string, Range[] | null>;
const closures = horaires.closures as { from: string; to: string; label: L10n }[];

export const money = (n: number, lang: Locale) =>
  new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** « 19:00 » → « 19 h » en français, « 7pm » en anglais. */
export function hourLabel(hhmm: string, lang: Locale) {
  const [h, m] = hhmm.split(":").map(Number);
  if (lang === "fr") return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

/** 150 → « 2 h 30 » / « 2h 30min » ; 45 → « 45 min ». */
export function durationLabel(min: number, lang: Locale) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  if (lang === "fr") return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  return m ? `${h}h ${m}min` : `${h}h`;
}

/** Date et heure actuelles à Paris : { iso: AAAA-MM-JJ, day: 0-6, minutes depuis minuit }. */
export function parisNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: horaires.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { iso: `${parts.year}-${parts.month}-${parts.day}`, day, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { iso: t.toISOString().slice(0, 10), day: t.getUTCDay() };
};

const closedOn = (iso: string) => closures.some((c) => c.from <= iso && iso <= c.to);
/** Plages d'ouverture d'un jour donné (null si fermé, fermeture exceptionnelle comprise). */
export const rangesOn = (iso: string, day: number) => (closedOn(iso) ? null : week[String(day)]);

export type OpenStatus = { open: true; until: string } | { open: false; nextDay: number; offset: number; at: string } | { open: false; nextDay: null };

/** Ouvert / fermé maintenant, et prochaine ouverture. */
export function openStatus(date = new Date()): OpenStatus {
  const now = parisNow(date);
  const today = rangesOn(now.iso, now.day) ?? [];
  for (const [a, b] of today) {
    if (now.minutes >= toMin(a) && now.minutes < toMin(b)) return { open: true, until: b };
    if (now.minutes < toMin(a)) return { open: false, nextDay: now.day, offset: 0, at: a };
  }
  for (let i = 1; i <= 21; i++) {
    const next = addDays(now.iso, i);
    const r = rangesOn(next.iso, next.day);
    if (r?.length) return { open: false, nextDay: next.day, offset: i, at: r[0][0] };
  }
  return { open: false, nextDay: null };
}

/** Prochains jours d'ouverture (barre de rendez-vous), à partir de demain. */
export function nextOpenDays(count: number, date = new Date()) {
  const now = parisNow(date);
  const out: { iso: string; day: number }[] = [];
  for (let i = 1; out.length < count && i < 60; i++) {
    const d = addDays(now.iso, i);
    if (rangesOn(d.iso, d.day)?.length) out.push(d);
  }
  return out;
}

/** Jours d'ouverture habituels, du lundi au dimanche. */
export const openWeekdays = () => [1, 2, 3, 4, 5, 6, 0].filter((d) => week[String(d)]?.length);

/** Les horaires de la semaine, du lundi au dimanche. */
export function weekRows() {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => ({ day, ranges: week[String(day)] }));
}

export const upcomingClosures = (fromIso: string) => closures.filter((c) => c.to >= fromIso);

/** Offre datée active (bandeau + section « Offres ») : la plus récente en cours, sinon null. */
export type Offre = (typeof offres.items)[number];
export function activeOffer(iso: string): Offre | null {
  const items = offres.items.filter((a) => a.from <= iso && iso <= a.to).sort((a, b) => (a.from < b.from ? 1 : -1));
  return items[0] ?? null;
}

export function formatDay(iso: string, lang: Locale, short = false) {
  const [y, m, d] = iso.split("-").map(Number);
  const opts: Intl.DateTimeFormatOptions = short
    ? { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }
    : { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat(intlLocale[lang], opts).format(new Date(Date.UTC(y, m - 1, d)));
}
