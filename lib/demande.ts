import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay } from "@/lib/shop";
import { bridal, programmes } from "@/lib/services";

/** Types de demande qui passent par le formulaire (le reste se réserve sur Planity). */
export const TYPES = ["programme", "mariee", "academy", "cadeau"] as const;
export type DemandeType = (typeof TYPES)[number];

export type Demande = { type: DemandeType | ""; option: string; date: string; goal: string; name: string; phone: string; email: string };
export const emptyDemande = (): Demande => ({ type: "", option: "", date: "", goal: "", name: "", phone: "", email: "" });

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Choix proposés selon le type de demande (programmes, offres mariée). */
export function optionsOf(type: DemandeType | "", lang: Locale, d: Dict) {
  if (type === "programme") return programmes.map((p) => ({ id: p.id, label: `${p.name[lang]} · ${p.length[lang]}` }));
  if (type === "mariee") return bridal.map((p) => ({ id: p.id, label: p.name[lang] }));
  if (type === "academy") return d.academy.courses.map((c, i) => ({ id: `academy-${i}`, label: c.title }));
  return [];
}

/** Récapitulatif envoyé sur WhatsApp, dans la langue de la page. */
export function demandeMessage(q: Demande, lang: Locale, d: Dict) {
  const m = d.demande.wa;
  const c = lang === "fr" ? " :" : ":";
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  const option = optionsOf(q.type, lang, d).find((o) => o.id === q.option)?.label ?? "";
  const blocks = [
    [m.hello],
    [line(m.type, q.type ? d.demande.types[q.type] : ""), line(m.option, option), line(m.date, q.date ? formatDay(q.date, lang) : ""), line(m.goal, q.goal.trim())],
    [line(m.name, q.name.trim()), line(m.phone, q.phone.trim()), line(m.email, q.email.trim())],
  ];
  return blocks
    .map((b) => b.filter(Boolean).join("\n"))
    .filter(Boolean)
    .join("\n\n");
}

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
