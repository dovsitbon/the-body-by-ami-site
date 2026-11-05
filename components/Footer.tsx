import Link from "next/link";
import site from "@/data/site.json";
import type { Dict, Locale } from "@/lib/i18n";
import { href, SOIN_PAGES } from "@/lib/routes";
import { Logo } from "@/components/Logo";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const f = d.footer;
  const links = [
    ...SOIN_PAGES.map((id) => ({ label: d.pages[id].title, to: href(lang, id) })),
    { label: d.programmes.eyebrow, to: href(lang, "home", "programmes") },
    { label: d.academy.eyebrow, to: href(lang, "home", "academy") },
  ];
  return (
    <footer className="bg-night pb-28 text-paper/85 lg:pb-0">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-10 lg:py-20">
        <div>
          <Logo className="h-20 w-auto text-paper" title="The Body by Ami, Face · Body · Longevity, Amiens" />
          <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-paper/70">{f.tagline}</p>
          <a href={site.bookingUrl} target="_blank" rel="noopener" className="btn-solid on-dark mt-8">
            {f.booking}
          </a>
        </div>
        <div>
          <p className="eyebrow !text-nude">{f.contact}</p>
          <address className="mt-4 text-[0.9375rem] leading-relaxed not-italic">
            {site.address.street}, {site.address.floor[lang]}
            <br />
            {site.address.postalCode} {site.address.city}
            <br />
            <a href={`tel:${site.tel}`} className="mt-3 inline-flex items-center gap-2 hover:text-paper">
              <PhoneIcon /> {site.phone}
            </a>
            <br />
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.default)}`} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-2 hover:text-paper">
              <WhatsAppIcon /> WhatsApp
            </a>
          </address>
        </div>
        <div>
          <p className="eyebrow !text-nude">{d.infos.hours}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed whitespace-pre-line">{f.days}</p>
          <p className="mt-1 text-[0.9375rem] text-paper/60">{f.closed}</p>
        </div>
        <div>
          <p className="eyebrow !text-nude">{f.pages}</p>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            {links.map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-4 border-t border-paper/15 px-5 py-6 text-[0.8125rem] text-paper/60 sm:px-8 lg:px-10">
        <p>
          © {new Date().getFullYear()} {f.rights}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={site.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-paper">
            <InstagramIcon /> {site.instagramHandle}
          </a>
          <a href={site.bookingUrl} target="_blank" rel="noopener" className="hover:text-paper">
            Planity
          </a>
          <Link href={href(lang, "legal")} className="hover:text-paper">
            {f.legal}
          </Link>
        </div>
      </div>
    </footer>
  );
}
