/**
 * Logo de The Body by Ami, redessiné d'après la photo de profil Instagram :
 * « THE BODY BY » en petites capitales espacées au-dessus de « AMI » (le ruban rose d'Octobre rose n'est pas repris),
 * une fine courbe dorée comme le contour d'une joue, et « FACE · BODY · LONGEVITY » en petit.
 * Prend la couleur du texte (currentColor) ; la courbe reste dorée, sauf `mono`.
 * Pour le remplacer : changer ce composant et public/logo.svg (même viewBox de préférence).
 */

/** Profil de visage au trait (front, nez, lèvres, menton, cou), dessiné pour l'ouverture et les ornements. */
export const PROFILE = "M50 6C69 8 80 22 81 39C82 47 80 53 84 59L92 72C93 75 91 77 87 77C88 80 88 83 86 85C88 87 88 90 85 92C86 97 86 102 81 107C74 113 64 115 57 112C53 123 52 137 55 154";

/** Courbe de joue sous « AMI ». */
export const CHEEK = "M62 71C86 80 132 80 158 70";

export function Logo({ className = "", title, mono = false, tagline = true }: { className?: string; title?: string; mono?: boolean; tagline?: boolean }) {
  const serif = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: 300 } as const;
  return (
    <svg viewBox={tagline ? "0 0 220 96" : "0 0 220 80"} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <text x="110" y="20" textAnchor="middle" fill="currentColor" style={{ ...serif, fontSize: 13, letterSpacing: "0.34em" }}>
        THE BODY BY
      </text>
      <text x="113" y="62" textAnchor="middle" fill="currentColor" style={{ ...serif, fontSize: 46, letterSpacing: "0.16em" }}>
        AMI
      </text>
      <path d={CHEEK} fill="none" stroke={mono ? "currentColor" : "var(--color-gold, #BFA06A)"} strokeWidth="1" strokeLinecap="round" />
      {tagline && (
        <text x="111" y="92" textAnchor="middle" fill="currentColor" style={{ fontFamily: "var(--font-jost), Jost, 'Helvetica Neue', Arial, sans-serif", fontWeight: 300, fontSize: 7.6, letterSpacing: "0.3em" }}>
          FACE · BODY · LONGEVITY
        </text>
      )}
    </svg>
  );
}
