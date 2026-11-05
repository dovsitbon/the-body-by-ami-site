"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { useLocale } from "@/components/providers";
import { ArrowIcon } from "@/components/icons";
import { BAR_CATEGORIES, BOOKING_URL, DURATIONS, suggest, type DurationKey } from "@/lib/services";
import { durationLabel, formatDay, money, nextOpenDays } from "@/lib/shop";
import { fill } from "@/lib/i18n";

/**
 * Barre de réservation façon hôtel (type de soin, durée, jour), sous le hero.
 * Planity ne permet pas de lien direct vers une prestation : la barre suggère le soin à choisir,
 * rappelle le jour voulu, puis ouvre la fiche Planity de l'institut.
 */
export function BookingBar({ className = "" }: { className?: string }) {
  const { lang, d } = useLocale();
  const id = useId();
  const [cat, setCat] = useState<string>("");
  const [dur, setDur] = useState<DurationKey | "">("");
  const [day, setDay] = useState("");
  const [days, setDays] = useState<{ iso: string; day: number }[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour, connue seulement côté client
  useEffect(() => setDays(nextOpenDays(18)), []);

  const b = d.bar;
  const s = cat ? suggest(cat, dur) : null;
  const dayText = day ? fill(b.hintDay, { day: formatDay(day, lang, true) }) : "";

  const field = "flex flex-col bg-paper px-5 pt-3 pb-2 focus-within:outline focus-within:outline-1 focus-within:-outline-offset-4 focus-within:outline-gold-ink";
  const label = "eyebrow !text-[0.625rem] !tracking-[0.22em] !text-muted";
  const select = "-mx-1 min-h-10 cursor-pointer bg-paper px-1 text-[1rem] text-ink focus:outline-none";

  return (
    <div className={className}>
      <form
        aria-label={b.label}
        onSubmit={(e) => {
          e.preventDefault();
          window.open(BOOKING_URL, "_blank", "noopener");
        }}
        className="grid gap-px border border-line bg-line shadow-[0_24px_60px_-40px_rgba(43,36,32,0.35)] sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <label htmlFor={`${id}-c`} className={field}>
          <span className={label}>{b.service}</span>
          <select id={`${id}-c`} value={cat} onChange={(e) => setCat(e.target.value)} className={select}>
            <option value="">{b.any}</option>
            {BAR_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {b.cats[c]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-t`} className={field}>
          <span className={label}>{b.duration}</span>
          <select id={`${id}-t`} value={dur} onChange={(e) => setDur(e.target.value as DurationKey | "")} className={select}>
            <option value="">{b.durAny}</option>
            {(Object.keys(DURATIONS) as DurationKey[]).map((k) => (
              <option key={k} value={k}>
                {b.durations[k]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-d`} className={field}>
          <span className={label}>{b.day}</span>
          <select id={`${id}-d`} value={day} onChange={(e) => setDay(e.target.value)} className={select}>
            <option value="">{b.dayAny}</option>
            {days.map((x) => (
              <option key={x.iso} value={x.iso}>
                {formatDay(x.iso, lang, true)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-solid !min-h-16 gap-3 !px-8 sm:col-span-3 lg:col-span-1">
          {b.submit} <ArrowIcon />
        </button>
      </form>
      <div aria-live="polite" className="min-h-12">
        <AnimatePresence mode="wait">
          {cat && (
            <motion.p
              key={`${cat}-${dur}-${day}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              className="border-x border-b border-line bg-paper px-5 py-3 text-[0.9375rem] text-muted"
            >
              {s ? (
                <>
                  <span className="eyebrow me-3 !text-[0.625rem]">{b.suggestion}</span>
                  <span className="text-ink">{s.name[lang]}</span> · {durationLabel(s.duration!, lang)} · {money(s.price!, lang)}
                  <span className="mt-1 block text-[0.8125rem] sm:ms-3 sm:mt-0 sm:inline">{fill(b.hint, { soin: s.name[lang], day: dayText })}</span>
                </>
              ) : (
                b.none
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
