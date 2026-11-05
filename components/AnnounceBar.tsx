"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers";
import { CloseIcon } from "@/components/icons";
import { activeOffer, parisNow, type Offre } from "@/lib/shop";
import { href } from "@/lib/routes";

const KEY = "body-by-ami-bandeau";

/** Bandeau d'infos pratiques : l'offre du moment (data/offres.json), qu'on peut fermer. Disparaît seul après la date. */
export function AnnounceBar() {
  const { lang, d } = useLocale();
  const [a, setA] = useState<Offre | null>(null);

  useEffect(() => {
    const next = activeOffer(parisNow().iso);
    let closed = false;
    try {
      closed = !!next && localStorage.getItem(KEY) === next.id;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour et localStorage, connus seulement côté client
    setA(closed ? null : next);
  }, []);

  if (!a) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, a.id);
    } catch {}
    setA(null);
  };

  return (
    <div className="fade-in relative bg-nude-soft text-ink">
      <p className="mx-auto max-w-6xl px-12 py-2.5 text-center text-[0.8125rem] leading-snug">
        {a.text[lang]}{" "}
        <Link href={href(lang, "home", a.hash)} className="link-line ms-1 whitespace-nowrap text-gold-ink">
          {a.link[lang]}
        </Link>
      </p>
      <button type="button" onClick={close} aria-label={d.announce.close} className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center opacity-70 hover:opacity-100">
        <CloseIcon />
      </button>
    </div>
  );
}
