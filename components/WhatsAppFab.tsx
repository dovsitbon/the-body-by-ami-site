"use client";

import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { WhatsAppIcon } from "@/components/icons";

/** Bouton WhatsApp rond, flottant en bas à droite (au-dessus de la barre « Réserver » sur mobile). */
export function WhatsAppFab() {
  const { d } = useLocale();
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.default)}`}
      target="_blank"
      rel="noopener"
      aria-label={d.whatsapp.label}
      title={d.whatsapp.label}
      className="fixed right-4 bottom-[5.25rem] z-30 grid size-14 place-items-center rounded-full border border-gold/40 bg-paper text-ink shadow-[0_12px_32px_-14px_rgba(43,36,32,0.45)] transition-colors duration-500 hover:bg-ink hover:text-paper lg:right-6 lg:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
