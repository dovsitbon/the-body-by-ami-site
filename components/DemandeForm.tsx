"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useLocale } from "@/components/providers";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { demandeMessage, emptyDemande, isEmail, isPhone, optionsOf, TYPES, waLink, type Demande, type DemandeType } from "@/lib/demande";
import { parisNow } from "@/lib/shop";

/**
 * Formulaire court (programmes, mariée, Academy, cartes cadeaux) : demande, choix, date, objectif, nom, téléphone, e-mail.
 * Rien n'est envoyé au serveur : le récapitulatif s'ouvre dans WhatsApp (33623081054), dans la langue de la page.
 * Préremplissage par l'adresse : ?type=programme&choix=face-longevity
 */
export function DemandeForm() {
  const { lang, d } = useLocale();
  const t = d.demande;
  const params = useSearchParams();
  const id = useId();
  const [q, setQ] = useState<Demande>(emptyDemande);
  const [errors, setErrors] = useState<Partial<Record<"type" | "name" | "phone" | "email", string>>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const type = params.get("type") as DemandeType | null;
    const choix = params.get("choix") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- préremplissage depuis l'adresse, côté client
    setToday(parisNow().iso);
    if (type && TYPES.includes(type)) setQ((v) => ({ ...v, type, option: choix }));
  }, [params]);

  const set = <K extends keyof Demande>(k: K, v: Demande[K]) => setQ((x) => ({ ...x, [k]: v }));
  const options = optionsOf(q.type, lang, d);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!q.type) err.type = t.errors.type;
    if (!q.name.trim()) err.name = t.errors.name;
    if (!isPhone(q.phone)) err.phone = t.errors.phone;
    if (q.email.trim() && !isEmail(q.email)) err.email = t.errors.email;
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`${id}-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    const link = waLink(demandeMessage(q, lang, d));
    setSent(link);
    window.open(link, "_blank", "noopener");
  };

  const err = (k: keyof typeof errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 text-[0.875rem] text-[#9b3b2a]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof typeof errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <fieldset>
        <legend className="label">{t.type}</legend>
        <div className="flex flex-wrap gap-2" id={`${id}-type`} tabIndex={-1} {...aria("type")}>
          {TYPES.map((ty) => (
            <label key={ty} className="chip">
              <input type="radio" name="type" value={ty} checked={q.type === ty} onChange={() => setQ((x) => ({ ...x, type: ty, option: "" }))} className="sr-only" />
              {t.types[ty]}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      {options.length > 0 && (
        <div>
          <label htmlFor={`${id}-option`} className="label">
            {t.option}
          </label>
          <select id={`${id}-option`} name="choix" value={q.option} onChange={(e) => set("option", e.target.value)} className="field">
            <option value="">{t.optionAny}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-date`} className="label">
            {q.type === "mariee" ? t.dateMariee : t.date} <span className="text-muted">({t.optional})</span>
          </label>
          <input id={`${id}-date`} name="date" type="date" min={today || undefined} value={q.date} onChange={(e) => set("date", e.target.value)} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-goal`} className="label">
          {q.type === "cadeau" ? t.goalCadeau : t.goal} <span className="text-muted">({t.optional})</span>
        </label>
        <textarea id={`${id}-goal`} name="objectif" rows={3} value={q.goal} maxLength={800} onChange={(e) => set("goal", e.target.value)} placeholder={t.goalPh} className="field resize-y" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-name`} className="label">
            {t.name}
          </label>
          <input id={`${id}-name`} name="name" autoComplete="name" value={q.name} onChange={(e) => set("name", e.target.value)} className="field" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="label">
            {t.phone}
          </label>
          <input id={`${id}-phone`} name="tel" type="tel" inputMode="tel" autoComplete="tel" value={q.phone} onChange={(e) => set("phone", e.target.value)} className="field" {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label">
            {t.email} <span className="text-muted">({t.optional})</span>
          </label>
          <input id={`${id}-email`} name="email" type="email" spellCheck={false} autoComplete="email" value={q.email} onChange={(e) => set("email", e.target.value)} className="field" {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div className="border-t border-line pt-8">
        <button type="submit" className="btn-solid w-full gap-3 sm:w-auto">
          <WhatsAppIcon /> {t.submit} <ArrowIcon />
        </button>
        <p className="mt-4 max-w-xl text-[0.875rem] leading-relaxed text-muted">{t.privacy}</p>
        {sent && (
          <p role="status" className="mt-6 border-s-2 border-gold bg-sand-soft px-5 py-4 text-[0.9375rem]">
            {t.sent}{" "}
            <a href={sent} target="_blank" rel="noopener" className="link-line whitespace-nowrap text-gold-ink">
              {t.fallback}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
