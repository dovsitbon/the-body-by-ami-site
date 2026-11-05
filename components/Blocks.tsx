import Image from "next/image";
import site from "@/data/site.json";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { hourLabel, upcomingClosures, weekRows } from "@/lib/shop";
import { intlLocale } from "@/lib/locales";
import { Reveal } from "@/components/Reveal";
import { OpenStatus } from "@/components/OpenStatus";
import { PhoneIcon, PinIcon, StarIcon, WhatsAppIcon } from "@/components/icons";

export const alt = (d: Dict, src: string) => d.alt[src.split("/").pop()!.replace(/\.\w+$/, "") as keyof Dict["alt"]] ?? "";

/** Photo de public/media avec ses vraies dimensions et son texte alternatif dans la langue de la page. */
export function Photo({ src, d, className = "", sizes, priority = false }: { src: string; d: Dict; className?: string; sizes: string; priority?: boolean }) {
  const i = img(src);
  return <Image src={i.src} width={i.width} height={i.height} alt={alt(d, src)} sizes={sizes} priority={priority} quality={priority ? 70 : 80} className={className} />;
}

export function SectionHead({ eyebrow, title, lead, center = false, id, light = false }: { eyebrow: string; title: string; lead?: string; center?: boolean; id?: string; light?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "!text-nude" : ""}`}>{eyebrow}</p>
      <h2 id={id} className="display mt-4 text-[clamp(2.2rem,4.6vw,3.5rem)]">
        {title}
      </h2>
      {lead && <p className={`lead mt-5 ${light ? "!text-paper/75" : ""}`}>{lead}</p>}
    </Reveal>
  );
}

/** Notes Google et Planity, avec la date du relevé, + la distinction citée dans la bio. */
export function Ratings({ lang, d, className = "", award = true }: { lang: Locale; d: Dict; className?: string; award?: boolean }) {
  const fmt = (v: number) => new Intl.NumberFormat(intlLocale[lang], { maximumFractionDigits: 1 }).format(v);
  const date = new Intl.DateTimeFormat(intlLocale[lang], { month: "long", year: "numeric" }).format(new Date(site.ratings.google.asOf));
  const items = [
    { key: "google", r: site.ratings.google, label: d.rating.google },
    { key: "planity", r: site.ratings.planity, label: d.rating.planity },
  ];
  return (
    <ul className={`flex flex-col gap-x-6 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      {items.map(({ key, r, label }) => (
        <li key={key}>
          <a href={r.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-colors hover:text-ink" title={fill(d.rating.asOf, { date })}>
            <span className="flex text-gold" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} />
              ))}
            </span>
            <span>
              {fill(label, { value: fmt(r.value) })} · {fill(d.rating.count, { count: new Intl.NumberFormat(intlLocale[lang]).format(r.count) })}
            </span>
          </a>
        </li>
      ))}
      {award && <li className="font-[family-name:var(--font-cormorant)] text-[1.05rem] italic">{d.rating.award}</li>}
    </ul>
  );
}

/** Bouton « Réserver » : ouvre la fiche Planity dans un nouvel onglet. */
export function PlanityButton({ d, label, className = "btn-solid" }: { d: Dict; label?: string; className?: string }) {
  return (
    <a href={site.bookingUrl} target="_blank" rel="noopener" title={d.nav.planityNote} className={className}>
      {label ?? d.nav.book}
    </a>
  );
}

export function PhoneLink({ className = "", label }: { className?: string; label?: string }) {
  return (
    <a href={`tel:${site.tel}`} className={className}>
      <PhoneIcon /> {label ?? site.phone}
    </a>
  );
}

/** Horaires de la semaine (data/horaires.json) et fermetures à venir. */
export function HoursTable({ lang, d }: { lang: Locale; d: Dict }) {
  const rows = weekRows();
  const today = new Date().toISOString().slice(0, 10);
  const closures = upcomingClosures(today);
  return (
    <div>
      <table className="w-full text-[0.9375rem]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.day} className="border-b border-line/70 last:border-0">
              <th scope="row" className="py-2 text-start font-light capitalize">
                {d.days[r.day]}
              </th>
              <td className={`py-2 text-end tabular-nums ${r.ranges ? "" : "text-muted"}`}>{r.ranges ? r.ranges.map(([a, b]) => `${hourLabel(a, lang)} – ${hourLabel(b, lang)}`).join(", ") : d.infos.closedDay}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {closures.length > 0 && (
        <p className="mt-4 text-[0.875rem] text-muted">
          {d.infos.closures}
          {lang === "fr" ? " : " : ": "}
          {closures
            .map((c) => {
              const f = new Intl.DateTimeFormat(intlLocale[lang], { day: "numeric", month: "long", timeZone: "UTC" });
              const from = f.format(new Date(c.from));
              return `${c.label[lang]} (${c.from === c.to ? from : `${from} – ${f.format(new Date(c.to))}`})`;
            })
            .join(", ")}
        </p>
      )}
    </div>
  );
}

/** Infos pratiques : adresse, carte, horaires, accès, téléphone. */
export function InfosBlock({ lang, d }: { lang: Locale; d: Dict }) {
  const i = d.infos;
  return (
    <section id="infos" aria-labelledby="infos-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
        <div>
          <SectionHead eyebrow={i.eyebrow} title={i.title} id="infos-title" />
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">{i.address}</dt>
              <dd className="mt-3 leading-relaxed">
                {site.address.street}, {site.address.floor[lang]}
                <br />
                {site.address.postalCode} {site.address.city}
                <br />
                <a href={site.maps} target="_blank" rel="noopener" className="link-line mt-2 inline-flex items-center gap-1.5 text-[0.9375rem]">
                  <PinIcon /> {i.route}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">{i.phone}</dt>
              <dd className="mt-3">
                <PhoneLink className="display inline-flex items-center gap-2 text-[1.7rem]" />
                <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.default)}`} target="_blank" rel="noopener" className="link-line mt-2 inline-flex items-center gap-1.5 text-[0.9375rem]">
                  <WhatsAppIcon /> {d.nav.whatsapp}
                </a>
                <div className="mt-3 text-[0.875rem] text-muted">
                  <OpenStatus />
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow">{i.hours}</dt>
              <dd className="mt-3">
                <HoursTable lang={lang} d={d} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow">{i.access}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{i.accessText}</dd>
            </div>
          </dl>
        </div>
        <Reveal className="min-h-[22rem] overflow-hidden bg-sand lg:min-h-0">
          <iframe title={i.mapTitle} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full min-h-[22rem] border-0 grayscale-[0.4] sepia-[0.12]" />
        </Reveal>
      </div>
    </section>
  );
}

export function Faq({ d, className = "" }: { d: Dict; className?: string }) {
  return (
    <section aria-labelledby="faq-title" className={`mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28 ${className}`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
        <div className="divide-y divide-line border-y border-line">
          {d.faq.items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.0625rem] font-normal [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="display text-[1.6rem] leading-none text-gold transition-transform duration-500 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bloc d'appel à l'action : « Réserver » (Planity) + téléphone. */
export function BookCta({ d, label }: { d: Dict; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <PlanityButton d={d} label={label} />
      <PhoneLink className="inline-flex items-center gap-2 text-[1.0625rem]" />
    </div>
  );
}
