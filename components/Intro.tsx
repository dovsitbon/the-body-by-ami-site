"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PROFILE } from "@/components/Logo";

const KEY = "body-by-ami-intro";
const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * Ouverture (1,5 s, une fois par session), tout en CSS (globals.css) :
 * fond blanc lait, une fine ligne dorée trace un profil de visage, un halo de lumière douce passe dessus,
 * « THE BODY BY AMI » apparaît puis « FACE · BODY · LONGEVITY », fondu sur le hero.
 * Ignorée si l'utilisateur préfère réduire les animations (script en tête du layout).
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-ink">
      <svg viewBox="20 0 100 160" className="h-40 w-auto overflow-visible sm:h-44" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="intro-glow">
            <stop offset="0" stopColor="#fff6e6" stopOpacity="1" />
            <stop offset="0.5" stopColor="#f3dcc2" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f3dcc2" stopOpacity="0" />
          </radialGradient>
          <clipPath id="intro-clip">
            <rect x="20" y="0" width="100" height="160" />
          </clipPath>
        </defs>
        <g clipPath="url(#intro-clip)">
          <ellipse className="intro-halo" cx="80" cy="78" rx="34" ry="42" fill="url(#intro-glow)" />
        </g>
        <path className="intro-line" pathLength={1} d={PROFILE} stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="intro-fade mt-6 ps-[0.3em] text-center font-[family-name:var(--font-cormorant)] text-[1.45rem] leading-none font-light tracking-[0.26em] whitespace-nowrap sm:text-[1.9rem] sm:tracking-[0.3em]" style={at(0.7)} translate="no" aria-hidden="true">
        THE BODY BY AMI
      </p>
      <p className="intro-fade mt-4 ps-[0.3em] text-[0.6875rem] tracking-[0.3em] text-muted" style={at(0.9)} translate="no" aria-hidden="true">
        FACE · BODY · LONGEVITY
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute right-4 bottom-4 min-h-11 px-4 text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}
