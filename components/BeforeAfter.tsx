"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/components/providers";
import type { Img } from "@/lib/media";

export type Pair = { id: string; before: Img; after: Img; alt: string };

/**
 * Curseur de comparaison avant / après : un vrai <input type="range"> (clavier, lecteurs d'écran),
 * posé en transparence sur les deux photos. La photo « après » est découpée par clip-path.
 */
export function BeforeAfter({ pair }: { pair: Pair }) {
  const { d } = useLocale();
  const [pos, setPos] = useState(50);
  const t = d.beforeAfter;
  return (
    <figure className="compare relative aspect-[8/5] overflow-hidden bg-sand select-none">
      <Image src={pair.before.src} width={pair.before.width} height={pair.before.height} alt={`${t.before} : ${pair.alt}`} sizes="(min-width:1024px) 40vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src={pair.after.src} width={pair.after.width} height={pair.after.height} alt={`${t.after} : ${pair.alt}`} sizes="(min-width:1024px) 40vw, 100vw" className="size-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper bg-ink/40 text-paper backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
      <span className="eyebrow absolute top-4 left-4 bg-paper/85 px-2 py-1 !text-ink">{t.before}</span>
      <span className="eyebrow absolute top-4 right-4 bg-paper/85 px-2 py-1 !text-ink">{t.after}</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label={t.handle} className="absolute inset-0 size-full opacity-0" />
    </figure>
  );
}
