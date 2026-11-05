import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import site from "@/data/site.json";
import { getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { href, PAGES, pageOf, SOIN_PAGES, type PageId, type SoinPage } from "@/lib/routes";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { ogLocale } from "@/lib/locales";
import { categories, soin } from "@/lib/services";
import { durationLabel, money } from "@/lib/shop";
import { PhoneLink, Photo, PlanityButton, Ratings } from "@/components/Blocks";
import { DemandeForm } from "@/components/DemandeForm";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, Curve, WhatsAppIcon } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => Object.values(PAGES).map((s) => ({ lang, slug: s[lang] })));
}

const isSoin = (id: PageId): id is SoinPage => (SOIN_PAGES as readonly string[]).includes(id);

function metaOf(id: PageId, d: Dict) {
  if (id === "legal") return { title: d.legal.metaTitle, description: d.meta.description };
  if (id === "demande") return { title: d.demande.metaTitle, description: d.demande.metaDescription };
  const p = d.pages[id];
  return { title: p.metaTitle, description: p.metaDescription };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const id = pageOf(lang, slug);
  if (!id) return {};
  const d = getDict(lang);
  const m = metaOf(id, d);
  const og = SOIN[id as SoinPage]?.img ?? "/og.jpg";
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: {
      canonical: href(lang, id),
      languages: { ...Object.fromEntries(locales.map((l) => [l, href(l, id)])), "x-default": href("fr", id) },
    },
    openGraph: { type: "website", url: href(lang, id), siteName: site.name, title: m.title, description: m.description, locale: ogLocale[lang], images: [{ url: og, alt: d.meta.ogAlt }] },
    robots: id === "legal" ? { index: false, follow: true } : undefined,
  };
}

/** Photo, soin de référence (prix et durée) et famille de soins de chaque page. */
const SOIN: Record<SoinPage, { img: string; ref: string; cat: string; position?: string }> = {
  drainage: { img: "/media/corps/drainage-lymphatique-mains.jpg", ref: "drainage", cat: "corps" },
  kobido: { img: "/media/visage/soin-visage-allongee.jpg", ref: "kobido", cat: "visage" },
  facePilates: { img: "/media/visage/face-pilates-pendant-le-soin.jpg", ref: "face-pilates", cat: "visage", position: "object-[70%_50%]" },
  headSpa: { img: "/media/head-spa/rituel-head-spa-eau.jpg", ref: "head-spa-detente", cat: "head-spa" },
};

function SoinPageView({ id, lang, d }: { id: SoinPage; lang: Locale; d: Dict }) {
  const p = d.pages[id];
  const t = d.pages;
  const conf = SOIN[id];
  const cat = categories.find((c) => c.id === conf.cat)!;
  const ref = soin(conf.ref);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(lang, p.title, p.metaDescription, href(lang, id), ref?.price ?? null)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(p.faq)) }} />

      <section className="mx-auto grid max-w-[90rem] items-center gap-10 px-5 pt-10 pb-16 sm:px-8 md:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:pt-16 lg:pb-24">
        <div>
          <Link href={href(lang, "home", "soins")} className="nav-link inline-flex items-center gap-2 text-muted hover:text-ink">
            <ArrowIcon className="size-3.5 rotate-180" /> {t.back}
          </Link>
          <p className="eyebrow mt-8">{p.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.7rem,6vw,4.8rem)]">{p.title}</h1>
          <p className="lead mt-6 max-w-xl">{p.intro}</p>
          <p className="display mt-7 text-[1.8rem] tabular-nums">{p.price}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PlanityButton d={d} label={t.book} />
            <Link href={href(lang, "home", "soins-bilans")} className="btn-line text-ink">
              {t.bilan}
            </Link>
          </div>
          <Ratings lang={lang} d={d} award={false} className="mt-7 text-[0.875rem] text-muted" />
        </div>
        <div className="shine aspect-[4/5] overflow-hidden bg-sand">
          <Photo src={conf.img} d={d} priority sizes="(min-width:768px) 45vw, 100vw" className={`size-full object-cover ${conf.position ?? ""}`} />
        </div>
      </section>

      <section className="border-y border-line bg-sand-soft">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10 lg:py-24">
          {p.sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <Curve className="h-3 w-14 text-gold" />
              <h2 className="display mt-5 text-[1.9rem] leading-tight">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 lg:gap-20 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="display text-[clamp(1.9rem,3.4vw,2.5rem)]">{t.forTitle}</h2>
          <ul className="mt-6 space-y-3 text-[1.0625rem]">
            {p.for.map((x) => (
              <li key={x} className="flex gap-4">
                <span className="mt-[0.75em] h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display text-[clamp(1.9rem,3.4vw,2.5rem)]">{t.contraTitle}</h2>
          <p className="mt-6 leading-relaxed text-muted">{p.contra}</p>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">{d.method.note}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">
        <div className="flex items-baseline justify-between gap-4 border-b border-ink/70 pb-3">
          <h2 className="display text-[1.9rem]">{t.related}</h2>
          <PlanityButton d={d} label={d.soins.book} className="link-line shrink-0 text-[0.8125rem] text-gold-ink" />
        </div>
        <ul className="divide-y divide-line">
          {cat.items.map((s) => (
            <li key={s.id} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-4 sm:grid-cols-[1fr_5.5rem_5.5rem]">
              {s.page && s.page !== id ? (
                <Link href={href(lang, s.page)} className="hover:text-gold-ink">
                  {s.name[lang]}
                </Link>
              ) : (
                <span className={s.page === id ? "text-ink" : ""}>{s.name[lang]}</span>
              )}
              <span className="order-3 col-span-2 text-[0.8125rem] text-muted tabular-nums sm:order-none sm:col-span-1 sm:text-end">{s.duration ? durationLabel(s.duration, lang) : ""}</span>
              <span className="text-end tabular-nums">{s.price != null ? money(s.price, lang) : <span className="text-[0.8125rem] text-muted">{d.soins.onPlanity}</span>}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-10 lg:py-24">
          <h2 className="display text-[clamp(2rem,4vw,3rem)]">{t.faqTitle}</h2>
          <div className="divide-y divide-line border-y border-line">
            {p.faq.map((f) => (
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

      <section className="bg-night text-paper">
        <div className="mx-auto flex max-w-[90rem] flex-col items-center px-5 py-20 text-center sm:px-8 lg:px-10">
          <Curve className="h-4 w-24 text-gold" />
          <p className="display mt-6 max-w-2xl text-[clamp(2rem,4vw,3rem)]">{d.hero.title}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <PlanityButton d={d} label={t.book} className="btn-solid on-dark" />
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.default)}`} target="_blank" rel="noopener" className="btn-line on-dark text-paper">
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function DemandePage({ lang, d }: { lang: Locale; d: Dict }) {
  const t = d.demande;
  return (
    <section className="mx-auto grid max-w-[90rem] gap-12 px-5 pt-10 pb-20 sm:px-8 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:px-10 lg:pt-16 lg:pb-28">
      <div className="max-w-3xl">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.2rem)]">{t.title}</h1>
        <p className="lead mt-5 max-w-2xl">{t.lead}</p>
        <div className="mt-12">
          <Suspense>
            <DemandeForm />
          </Suspense>
        </div>
      </div>
      <aside className="h-fit space-y-6 lg:sticky lg:top-32">
        <div className="bg-sand-soft p-6">
          <Curve className="h-3 w-14 text-gold" />
          <p className="mt-4 leading-relaxed">{t.planity}</p>
          <PlanityButton d={d} className="btn-solid mt-5 w-full" />
        </div>
        <div className="space-y-3 px-1 text-[0.875rem] text-muted">
          <PhoneLink className="inline-flex items-center gap-2 text-[1.0625rem] text-ink" />
          <OpenStatus />
          <p>
            {site.address.street}, {site.address.floor[lang]}, {site.address.postalCode} {site.address.city}
          </p>
          <p className="whitespace-pre-line">{d.footer.days}</p>
        </div>
      </aside>
    </section>
  );
}

function Legal({ d, lang }: { d: Dict; lang: Locale }) {
  const l = d.legal;
  const rows: [string, string][] = [
    [l.editor, l.editorText],
    [l.company, [site.legal.company, site.legal.siret].filter(Boolean).join(", ") || l.pending],
    [l.director, site.legal.director ?? l.pending],
    [l.host, site.legal.host],
    [l.data, l.dataText],
    [l.photos, l.photosText],
  ];
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24" lang={lang}>
      <h1 className="display text-[clamp(2.4rem,5vw,3.6rem)]">{l.title}</h1>
      <dl className="mt-10 space-y-8">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 leading-relaxed text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const id = pageOf(lang, slug);
  if (!id) notFound();
  const d = getDict(lang);
  const m = metaOf(id, d);
  const crumbs = breadcrumbJsonLd(lang, m.title.split(" | ")[0], href(lang, id));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {isSoin(id) && <SoinPageView id={id} lang={lang} d={d} />}
      {id === "demande" && <DemandePage lang={lang} d={d} />}
      {id === "legal" && <Legal d={d} lang={lang} />}
    </>
  );
}
