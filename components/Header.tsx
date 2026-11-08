"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { Logo } from "@/components/Logo";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { locales } from "@/lib/locales";
import { href, switchPath } from "@/lib/routes";

/** En-tête : navigation à gauche, logo centré, langue + Instagram + « Réserver » (Planity) à droite, toujours visible. */
export function Header() {
  const { lang, d } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refermer le menu au changement de page
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [open]);

  const n = d.nav;
  const links = [
    { label: n.visage, to: href(lang, "home", "soins-visage") },
    { label: n.corps, to: href(lang, "home", "soins-corps") },
    { label: n.headspa, to: href(lang, "headSpa") },
    { label: n.programmes, to: href(lang, "home", "programmes") },
    { label: n.academy, to: href(lang, "home", "academy") },
    { label: n.infos, to: href(lang, "home", "infos") },
  ];

  const langSwitch = (
    <nav aria-label={n.lang} className="flex items-center gap-1 text-[0.75rem] tracking-[0.14em]">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="text-muted">·</span>}
          {l === lang ? (
            <span aria-current="true" className="px-1 py-2 text-ink">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={switchPath(pathname, l)}
              hrefLang={l}
              lang={l}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
              }}
              className="px-1 py-2 text-muted hover:text-ink"
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );

  useEffect(() => {
    if (!open) return;
    // Le panneau commence sous le header, quelle que soit la hauteur du bandeau au-dessus
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mesure du DOM à l'ouverture
    setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
  }, [open]);

  return (
    // Pas de backdrop-blur quand le menu est ouvert : il ferait du header le bloc conteneur du panneau `fixed` (hauteur 0)
    <header ref={headerRef} className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${open ? "bg-paper shadow-[0_1px_0_var(--color-line)]" : scrolled ? "bg-paper/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur" : "bg-paper"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:px-4 focus:py-2">
        {n.skip}
      </a>
      <div className="mx-auto grid h-[4.5rem] max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-24 lg:px-10">
        <div className="flex items-center">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" className="-ms-2 grid size-11 place-items-center xl:hidden" aria-label={open ? n.close : n.menu}>
            {open ? <CloseIcon className="size-5" /> : <MenuIcon />}
          </button>
          <nav aria-label={n.menu} className="hidden xl:block">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {links.map((l) => (
                <li key={l.to}>
                  <Link href={l.to} className="nav-link py-2 text-ink/80 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link href={href(lang, "home")} aria-label={n.home} className="block text-ink">
          <Logo tagline={false} className="h-10 w-auto lg:h-[3.1rem]" />
        </Link>

        <div className="flex items-center justify-end gap-3 lg:gap-5">
          <div className="hidden sm:block">{langSwitch}</div>
          <a href={site.instagram} target="_blank" rel="noopener" aria-label={n.instagram} className="hidden size-10 place-items-center text-ink/80 hover:text-ink sm:grid">
            <InstagramIcon className="size-[1.1rem]" />
          </a>
          <a href={`tel:${site.tel}`} aria-label={`${n.call} ${site.phone}`} className="grid size-11 place-items-center text-ink lg:hidden">
            <PhoneIcon className="size-5" />
          </a>
          <a href={site.bookingUrl} target="_blank" rel="noopener" title={n.planityNote} className="btn-solid hidden !min-h-11 !px-6 whitespace-nowrap lg:inline-flex">
            {n.book}
          </a>
        </div>
      </div>

      {open && (
        <div id="menu" style={{ top: panelTop }} className="fade-in fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-paper px-6 pt-6 pb-28 xl:hidden">
          <nav aria-label={n.menu}>
            <ul className="divide-y divide-line border-y border-line">
              {links.map((l) => (
                <li key={l.to}>
                  <Link href={l.to} onClick={() => setOpen(false)} className="display block py-4 text-[1.9rem]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex items-center justify-between">
            {langSwitch}
            <a href={site.instagram} target="_blank" rel="noopener" className="flex items-center gap-2 text-[0.9375rem]">
              <InstagramIcon /> {site.instagramHandle}
            </a>
          </div>
          <a href={`tel:${site.tel}`} className="mt-6 flex items-center gap-2 text-[1.0625rem]">
            <PhoneIcon /> {site.phone}
          </a>
        </div>
      )}
    </header>
  );
}

/** Barre fixée en bas de l'écran sur mobile : « Réserver » (Planity) + « Appeler », toujours visibles. */
export function MobileBookBar() {
  const { d } = useLocale();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="flex gap-2">
        <a href={site.bookingUrl} target="_blank" rel="noopener" className="btn-solid flex-1 !px-3">
          {d.nav.book}
        </a>
        <a href={`tel:${site.tel}`} className="btn-line !px-4 text-ink" aria-label={`${d.nav.call} ${site.phone}`}>
          <PhoneIcon /> {d.nav.call}
        </a>
      </div>
    </div>
  );
}
