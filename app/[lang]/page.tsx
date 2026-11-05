import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import equipe from "@/data/equipe.json";
import presse from "@/data/presse.json";
import avantApres from "@/data/avant-apres.json";
import { fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { href } from "@/lib/routes";
import { bridal, categories, programmes } from "@/lib/services";
import { activeOffer, durationLabel, formatDay, money, parisNow } from "@/lib/shop";
import { faqJsonLd } from "@/lib/jsonld";
import { Faq, InfosBlock, Photo, PlanityButton, Ratings, SectionHead } from "@/components/Blocks";
import { BookingBar } from "@/components/BookingBar";
import { BeforeAfter } from "@/components/BeforeAfter";
import { DateGate } from "@/components/DateGate";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, Curve, InstagramIcon } from "@/components/icons";

const demande = (lang: Locale, type: string, choix = "") => `${href(lang, "demande")}?type=${type}${choix ? `&choix=${choix}` : ""}`;

function Hero({ lang, d }: { lang: Locale; d: Dict }) {
  const h = d.hero;
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="grid lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative order-1 h-[40svh] min-h-64 overflow-hidden bg-sand lg:order-2 lg:h-auto">
          <Photo src="/media/visage/soin-visage-allongee.jpg" d={d} priority sizes="(min-width:1024px) 52vw, 100vw" className="settle absolute inset-0 size-full object-cover object-[50%_45%]" />
        </div>
        <div className="order-2 flex flex-col justify-center px-5 pt-10 pb-24 sm:px-8 lg:order-1 lg:px-10 lg:pt-16 lg:pb-32 xl:ps-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))]">
          <p className="eyebrow rise">{h.eyebrow}</p>
          <h1 id="hero-title" className="display rise mt-5 max-w-[14ch] text-[clamp(2.7rem,5.6vw,5.4rem)] [animation-delay:0.1s]">
            {h.title}
          </h1>
          <p className="lead rise mt-6 max-w-md [animation-delay:0.2s]">{h.lead}</p>
          <div className="rise mt-9 flex flex-wrap gap-3 [animation-delay:0.3s]">
            <PlanityButton d={d} label={h.book} />
            <Link href={href(lang, "home", "soins-bilans")} className="btn-line text-ink">
              {h.bilan}
            </Link>
          </div>
          <Ratings lang={lang} d={d} className="rise mt-8 text-[0.875rem] text-muted [animation-delay:0.4s]" />
        </div>
      </div>
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="relative z-10 -mt-12 lg:-mt-14">
          <BookingBar />
        </div>
      </div>
    </section>
  );
}

const TILES = [
  { id: "visage", img: "/media/visage/face-pilates-pendant-le-soin.jpg", to: (l: Locale) => href(l, "home", "soins-visage") },
  { id: "corps", img: "/media/corps/drainage-lymphatique-mains.jpg", to: (l: Locale) => href(l, "drainage") },
  { id: "headspa", img: "/media/head-spa/rituel-head-spa-eau.jpg", to: (l: Locale) => href(l, "headSpa") },
  { id: "programmes", img: null, to: (l: Locale) => href(l, "home", "programmes") },
  { id: "mariee", img: null, to: (l: Locale) => href(l, "home", "mariee") },
  { id: "academy", img: null, to: (l: Locale) => href(l, "home", "academy") },
] as const;

function Tiles({ lang, d }: { lang: Locale; d: Dict }) {
  const photos = TILES.filter((t) => t.img);
  const texts = TILES.filter((t) => !t.img);
  return (
    <section aria-labelledby="tiles-title" className="mx-auto max-w-[90rem] px-5 pt-16 pb-20 sm:px-8 lg:px-10 lg:pt-20 lg:pb-28">
      <SectionHead eyebrow={d.tiles.eyebrow} title={d.tiles.title} id="tiles-title" />
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {photos.map((t, i) => {
          const it = d.tiles.items[t.id];
          return (
            <Reveal as="li" key={t.id} delay={i * 0.07} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
              <Link href={t.to(lang)} className="group block">
                <div className={`shine bg-sand ${i === 2 ? "aspect-[8/5] md:aspect-[4/5]" : "aspect-[4/5]"}`}>
                  <Photo src={t.img!} d={d} sizes="(min-width:768px) 31vw, 48vw" className="size-full object-cover" />
                </div>
                <h3 className="display mt-4 flex items-center justify-between gap-2 text-[1.5rem]">
                  {it.title}
                  <ArrowIcon className="size-4 shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-1" />
                </h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{it.text}</p>
              </Link>
            </Reveal>
          );
        })}
      </ul>
      <ul className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
        {texts.map((t, i) => {
          const it = d.tiles.items[t.id];
          return (
            <Reveal as="li" key={t.id} delay={i * 0.07} className="bg-paper">
              <Link href={t.to(lang)} className="group flex h-full items-center justify-between gap-6 p-6 transition-colors duration-700 hover:bg-sand-soft lg:p-8">
                <span>
                  <span className="display block text-[1.75rem] leading-none">{it.title}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted">{it.text}</span>
                </span>
                <ArrowIcon className="size-4 shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

function Method({ lang, d }: { lang: Locale; d: Dict }) {
  const m = d.method;
  return (
    <section id="methode" aria-labelledby="method-title" className="bg-sand-soft">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-10 lg:py-28">
        <Reveal className="relative">
          <div className="aspect-[5/4] overflow-hidden bg-sand lg:sticky lg:top-32 lg:aspect-[6/5]">
            <Photo src="/media/hero/soin-visage-peau-lumineuse.jpg" d={d} sizes="(min-width:1024px) 42vw, 100vw" className="size-full object-cover object-[55%_50%]" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">{m.eyebrow}</p>
            <h2 id="method-title" className="display mt-4 max-w-[18ch] text-[clamp(2.2rem,4.4vw,3.4rem)]">
              {m.title}
            </h2>
            <p className="lead mt-6 max-w-xl">{m.lead}</p>
          </Reveal>
          <ol className="mt-12 border-t border-line">
            {m.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.05} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7 sm:grid-cols-[4.5rem_1fr]">
                <span className="display text-[2rem] leading-none text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.125rem] font-normal">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <Link href={href(lang, "home", "soins-bilans")} className="btn-solid">
              {m.cta}
            </Link>
            <p className="mt-6 max-w-lg text-[0.8125rem] leading-relaxed text-muted">{m.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Soins({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.soins;
  return (
    <section id="soins" aria-labelledby="soins-title">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-10 lg:py-28">
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} id="soins-title" />
          <Reveal className="mt-8">
            <PlanityButton d={d} label={p.cta} />
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">{p.asOf}</p>
          </Reveal>
        </div>
        <div className="space-y-16">
          {categories.map((c) => (
            <Reveal key={c.id}>
              <div id={`soins-${c.id}`} className="flex scroll-mt-32 items-baseline justify-between gap-4 border-b border-ink/70 pb-3">
                <h3 className="display text-[1.9rem]">{c.name[lang]}</h3>
                <PlanityButton d={d} label={p.book} className="link-line shrink-0 text-[0.8125rem] text-gold-ink" />
              </div>
              <ul className="divide-y divide-line">
                {c.items.map((s) => (
                  <li key={s.id} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 py-4 sm:grid-cols-[1fr_5.5rem_5.5rem]">
                    <div>
                      {s.page ? (
                        <Link href={href(lang, s.page)} className="group text-[1rem] hover:text-gold-ink">
                          {s.name[lang]} <ArrowIcon className="inline size-3.5 text-gold transition-transform duration-500 group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <span className="text-[1rem]">{s.name[lang]}</span>
                      )}
                      {s.note && <span className="mt-0.5 block text-[0.8125rem] text-muted">{s.note[lang]}</span>}
                    </div>
                    <span className="order-3 col-span-2 text-[0.8125rem] text-muted tabular-nums sm:order-none sm:col-span-1 sm:text-end">{s.duration ? durationLabel(s.duration, lang) : ""}</span>
                    <span className="text-end text-[0.9375rem] tabular-nums">{s.price != null ? money(s.price, lang) : <span className="text-[0.8125rem] text-muted">{p.onPlanity}</span>}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Offre datée (data/offres.json) : rendue au build si active, masquée côté client après la date de fin. */
function Offers({ lang, d }: { lang: Locale; d: Dict }) {
  const o = activeOffer(parisNow().iso);
  if (!o) return null;
  const t = d.offers;
  return (
    <DateGate from={o.from} to={o.to}>
      <section id="offres" aria-labelledby="offres-title" className="bg-nude-soft">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-10 lg:py-20">
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="offres-title" className="display mt-4 text-[clamp(2rem,4vw,3rem)]">
              {o.title[lang]}
            </h2>
            <p className="mt-3 text-[0.9375rem] text-muted">{fill(t.until, { date: formatDay(o.to, lang) })}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={site.giftUrl} target="_blank" rel="noopener" className="btn-solid">
                {t.cta}
              </a>
              <Link href={demande(lang, "cadeau")} className="link-line text-[0.9375rem]">
                {t.or}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {o.list.map((it) => (
                <li key={it.name.fr} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-4 sm:grid-cols-[1fr_5.5rem_7rem]">
                  <span>{it.name[lang]}</span>
                  <span className="order-3 col-span-2 text-[0.8125rem] text-muted tabular-nums sm:order-none sm:col-span-1 sm:text-end">{durationLabel(it.duration, lang)}</span>
                  <span className="text-end tabular-nums">
                    <span className="display text-[1.45rem]">{money(it.price, lang)}</span>
                    {it.was && <span className="block text-[0.75rem] text-muted">{fill(t.was, { price: money(it.was, lang) })}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </DateGate>
  );
}

function Programmes({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.programmes;
  const cols = programmes.filter((x) => x.compare);
  const also = programmes.filter((x) => !x.compare);
  const rowLabel = "eyebrow !text-[0.625rem] !text-muted";
  return (
    <section id="programmes" aria-labelledby="prog-title" className="border-t border-line">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} id="prog-title" />
        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-0 md:border md:border-line">
          {cols.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} className={`relative flex flex-col border border-line p-7 md:border-0 lg:p-9 ${i > 0 ? "md:border-s md:border-line" : ""} ${c.featured ? "bg-sand-soft" : "bg-paper"}`}>
              {c.featured && <span className="eyebrow absolute top-0 left-7 -translate-y-1/2 bg-paper px-2 lg:left-9">{p.featured}</span>}
              <h3 className="display text-[2.3rem] leading-none">{c.name[lang]}</h3>
              <dl className="mt-7 flex-1 space-y-5 text-[0.9375rem]">
                <div className="grid grid-cols-2 gap-4 border-b border-line pb-5">
                  <div>
                    <dt className={rowLabel}>{p.rows.length}</dt>
                    <dd className="mt-1.5">{c.length[lang]}</dd>
                  </div>
                  <div>
                    <dt className={rowLabel}>{p.rows.sessions}</dt>
                    <dd className="mt-1.5">{c.sessions ? fill(p.sessionsN, { n: c.sessions }) : p.sessionsBilan}</dd>
                  </div>
                </div>
                <div>
                  <dt className={rowLabel}>{p.rows.includes}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5">
                      {c.includes[lang].map((x) => (
                        <li key={x} className="flex gap-3">
                          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className={rowLabel}>{p.rows.for}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted">{c.for[lang]}</dd>
                </div>
              </dl>
              <div className="mt-8 border-t border-line pt-6">
                <p>
                  <span className="sr-only">{p.rows.price} : </span>
                  <span className="display text-[2.6rem] leading-none tabular-nums">{money(c.price, lang)}</span>
                </p>
                <Link href={demande(lang, "programme", c.id)} className={`${c.featured ? "btn-solid" : "btn-line text-ink"} mt-5 w-full`}>
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-col gap-4 text-[0.9375rem] text-muted md:flex-row md:items-baseline md:justify-between">
          {also.map((a) => (
            <p key={a.id}>
              <span className="eyebrow me-3">{p.also}</span>
              <Link href={demande(lang, "programme", a.id)} className="link-line text-ink">
                {fill(p.alsoText, { name: a.name[lang], length: a.length[lang], for: a.for[lang], price: money(a.price, lang) })}
              </Link>
            </p>
          ))}
          <Link href={href(lang, "home", "soins-bilans")} className="link-line shrink-0 text-ink">
            {p.help}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Bridal({ lang, d }: { lang: Locale; d: Dict }) {
  const b = d.bridal;
  return (
    <section id="mariee" aria-labelledby="bridal-title" className="bg-night text-paper">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
        <SectionHead eyebrow={b.eyebrow} title={b.title} lead={b.lead} id="bridal-title" light />
        <Reveal delay={0.08} className="lg:pt-12">
          <ul className="divide-y divide-paper/15 border-y border-paper/15">
            {bridal.map((x) => (
              <li key={x.id} className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-5">
                <div>
                  <p className="display text-[1.6rem] leading-tight">{x.name[lang]}</p>
                  <p className="mt-1 text-[0.875rem] text-paper/65">{x.length[lang]}</p>
                </div>
                <p className="display text-[1.6rem] tabular-nums">{money(x.price, lang)}</p>
              </li>
            ))}
          </ul>
          <Link href={demande(lang, "mariee")} className="btn-solid on-dark mt-10">
            {b.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Team({ lang, d }: { lang: Locale; d: Dict }) {
  const t = d.team;
  const f = t.founder;
  return (
    <section id="equipe" aria-labelledby="team-title" className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1fr] lg:gap-24">
        <Reveal className="relative">
          <div className="aspect-[4/5] overflow-hidden bg-sand">
            <Photo src={equipe.founder.photo} d={d} sizes="(min-width:768px) 42vw, 100vw" className="size-full object-cover" />
          </div>
          <Curve className="absolute -bottom-6 left-1/2 h-4 w-40 -translate-x-1/2 text-gold" />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 id="team-title" className="display mt-4 text-[clamp(3rem,6vw,4.6rem)] leading-none">
            {f.name}
          </h2>
          <p className="mt-3 text-[0.9375rem] text-muted">{f.role}</p>
          <p className="lead mt-7 max-w-lg">{f.text}</p>
          <PlanityButton d={d} label={f.cta} className="btn-line mt-9 text-ink" />
        </Reveal>
      </div>
      <div className="mt-24">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h3 className="display mt-3 text-[clamp(1.9rem,3.4vw,2.6rem)]">{t.title}</h3>
        </Reveal>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
          {equipe.members.map((m, i) => (
            <Reveal as="li" key={m.id} delay={i * 0.06} className="flex items-center gap-5 bg-paper p-6 lg:p-8">
              {m.photo ? (
                <Image src={img(m.photo).src} width={img(m.photo).width} height={img(m.photo).height} alt={m.name} sizes="80px" className="size-20 rounded-full object-cover" />
              ) : (
                <span className="display grid size-20 shrink-0 place-items-center rounded-full bg-nude-soft text-[2rem] text-taupe" aria-hidden="true">
                  {m.name[0]}
                </span>
              )}
              <div>
                <p className="display text-[1.7rem] leading-none">{m.name}</p>
                <p className="mt-2 text-[0.9375rem] text-muted">{m.role[lang]}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Press({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.press;
  const withImg = presse.items.filter((x) => "image" in x && x.image);
  return (
    <section id="presse" aria-labelledby="press-title" className="border-y border-line bg-sand-soft">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <SectionHead eyebrow={p.eyebrow} title={p.title} id="press-title" center />
        <Reveal>
          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 text-center md:grid-cols-5">
            {presse.items.map((x) => (
              <li key={x.id} className="flex flex-col items-center">
                <span className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">{x.name}</span>
                <span className="eyebrow mt-2 !text-[0.625rem]">
                  {x.kind === "award" ? p.award : p.pressKind}
                  {x.year ? ` · ${x.year}` : ""}
                </span>
                <span className="mt-2 max-w-[18ch] text-[0.8125rem] leading-snug text-muted">{x.detail[lang]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4">
          {withImg.map((x, i) => (
            <Reveal key={x.id} delay={i * 0.08} className="aspect-[4/5] overflow-hidden bg-sand">
              <Photo src={(x as { image: string }).image} d={d} sizes="(min-width:768px) 24rem, 48vw" className="size-full object-cover object-top" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Academy({ lang, d }: { lang: Locale; d: Dict }) {
  const a = d.academy;
  return (
    <section id="academy" aria-labelledby="academy-title" className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <SectionHead eyebrow={a.eyebrow} title={a.title} lead={a.lead} id="academy-title" />
          <Reveal className="mt-9">
            <Link href={demande(lang, "academy")} className="btn-solid">
              {a.cta}
            </Link>
            <p className="mt-5 text-[0.8125rem] text-muted">{a.note}</p>
          </Reveal>
        </div>
        <ol className="border-t border-line">
          {a.courses.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.06} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7">
              <span className="display text-[1.6rem] leading-none text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="display text-[1.7rem] leading-tight">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BeforeAfterSection({ lang, d }: { lang: Locale; d: Dict }) {
  const pairs = avantApres.pairs.filter((p) => p.consent);
  if (!pairs.length) return null;
  const t = d.beforeAfter;
  return (
    <section aria-labelledby="ba-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:px-10 lg:py-28">
        <div>
          <SectionHead eyebrow={t.eyebrow} title={t.title} lead={t.lead} id="ba-title" />
          <Reveal className="mt-8">
            <a href={site.instagram} target="_blank" rel="noopener" className="link-line inline-flex items-center gap-2 text-[0.9375rem]">
              <InstagramIcon /> {t.more}
            </a>
          </Reveal>
        </div>
        <div className="grid gap-6">
          {pairs.map((p) => (
            <figure key={p.id}>
              <BeforeAfter pair={{ id: p.id, before: img(p.before), after: img(p.after), alt: p.alt[lang] }} />
              <figcaption className="mt-3 text-[0.875rem] text-muted">{p.label[lang]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ lang, d }: { lang: Locale; d: Dict }) {
  const r = d.reviews;
  const g = site.ratings.google;
  const value = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 1 }).format(g.value);
  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
      <Reveal className="grid items-center gap-10 border-y border-line py-12 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
        <p className="display text-[clamp(5rem,10vw,7.5rem)] leading-[0.8]">{value}</p>
        <div>
          <h2 id="reviews-title" className="display text-[clamp(1.8rem,3.2vw,2.3rem)]">
            {r.title}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[1.0625rem]">
            {r.themes.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-px w-4 bg-gold" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Ratings lang={lang} d={d} award={false} className="mt-6 text-[0.875rem] text-muted" />
        </div>
        <PlanityButton d={d} className="btn-solid shrink-0" />
      </Reveal>
    </section>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(d.faq.items)) }} />
      <Hero lang={lang} d={d} />
      <Tiles lang={lang} d={d} />
      <Method lang={lang} d={d} />
      <Soins lang={lang} d={d} />
      <Offers lang={lang} d={d} />
      <Programmes lang={lang} d={d} />
      <Bridal lang={lang} d={d} />
      <Team lang={lang} d={d} />
      <Press lang={lang} d={d} />
      <Academy lang={lang} d={d} />
      <BeforeAfterSection lang={lang} d={d} />
      <Reviews lang={lang} d={d} />
      <InfosBlock lang={lang} d={d} />
      <Faq d={d} className="border-t border-line" />
    </>
  );
}
