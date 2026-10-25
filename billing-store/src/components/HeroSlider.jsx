import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/jainam-fluid-systems-hero.jpg",
    alt: "Illustrative automotive pipes and fluid-system components",
    eyebrow: "Jainam Auto Industries · Pune",
    title: <>Precision in every <span className="text-habanero">line.</span></>,
    copy: "Automotive pipes, hoses and fluid-transmission components for commercial vehicle, OEM and replacement-market applications.",
    family: "Automotive fluid systems",
  },
  {
    image: "/jainam-slider-hydraulic-hoses.jpg",
    alt: "Illustrative braided hydraulic hoses and fittings",
    eyebrow: "Product family 01",
    title: <>Hose lines for <span className="text-habanero">tough routes.</span></>,
    copy: "Explore hydraulic and power-steering hose families listed in the Jainam product range.",
    family: "Hydraulic & power-steering hoses",
  },
  {
    image: "/jainam-slider-formed-pipes.jpg",
    alt: "Illustrative formed metal automotive pipe assemblies",
    eyebrow: "Product family 02",
    title: <>Formed pipes.<br /><span className="text-habanero">Purpose-built.</span></>,
    copy: "Browse automotive, fuel and nozzle pipe categories for commercial vehicle applications.",
    family: "Automotive & nozzle pipes",
  },
  {
    image: "/jainam-slider-air-brake-tubes.jpg",
    alt: "Illustrative color-coded nylon air-brake tubes and connectors",
    eyebrow: "Product family 03",
    title: <>Flow that keeps<br /><span className="text-habanero">vehicles moving.</span></>,
    copy: "Discover brake-pipe and nylon tubing categories from Jainam Auto Industries.",
    family: "Brake pipes & nylon tubing",
  },
];

const whatsappHref = "https://wa.me/919422308740?text=Hello%20Jainam%20Auto%20Industries%2C%20I%20need%20a%20product%20quote.";

export default function HeroSlider({ stats = {} }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  useEffect(() => {
    if (paused || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const show = (index) => setActive((index + slides.length) % slides.length);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#07142f] text-white"
      aria-label="Jainam product image carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="absolute inset-0 jainam-hero-atmosphere" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 top-[42%] h-[24rem] w-[24rem] rounded-full border border-habanero/15" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-10 lg:py-16">
        <div key={active} className="jainam-slide-copy order-2 lg:order-1">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/75">
            <MapPin size={12} className="text-habanero" /> {slide.eyebrow}
          </p>
          <h1 className="max-w-2xl font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.97] tracking-[-0.045em]">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{slide.copy}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/store/catalogue" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-habanero px-6 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-royal">
              Explore catalogue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white/90 transition-colors hover:border-white hover:bg-white/10">
              Talk to Jainam <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/55">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-habanero" /> ISO 9001:2015</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-habanero" /> Pune, Maharashtra · Since 2002</span>
            {Number(stats.productCount) > 0 && <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {stats.productCount} catalogue products</span>}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="pointer-events-none absolute -right-4 -top-4 z-0 h-36 w-36 rounded-full border border-habanero/35 sm:-right-7 sm:-top-7 sm:h-48 sm:w-48" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 z-0 h-24 w-24 rounded-3xl bg-habanero sm:-bottom-7 sm:-left-7 sm:h-32 sm:w-32" aria-hidden="true" />
          <div className="relative z-10 overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#121f3c] shadow-[0_30px_90px_-28px_rgba(0,0,0,0.8)] sm:rounded-[2rem]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img key={slide.image} src={slide.image} alt={slide.alt} className="jainam-carousel-photo absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07142f]/90 via-[#07142f]/8 to-[#07142f]/5" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07142f]/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur sm:left-6 sm:top-6">
                <span className="h-1.5 w-1.5 rounded-full bg-habanero" /> Illustrative product-family image
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">Jainam product range</p>
                    <p className="mt-1 truncate font-display text-lg font-semibold text-white sm:text-xl">{slide.family}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => show(active - 1)} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-royal"><ChevronLeft size={18} /></button>
                    <button type="button" onClick={() => show(active + 1)} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-royal"><ChevronRight size={18} /></button>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2" role="group" aria-label="Choose carousel slide">
                    {slides.map((item, index) => <button key={item.image} type="button" onClick={() => show(index)} aria-label={`Show slide ${index + 1}: ${item.family}`} aria-current={index === active ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${index === active ? "w-9 bg-habanero" : "w-2 bg-white/45 hover:bg-white"}`} />)}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-white/55">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 right-6 z-20 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-royal shadow-xl sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-habanero"><BadgeCheck size={19} /></span>
            <span><span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Quality system</span><span className="mt-0.5 block text-sm font-semibold">ISO 9001:2015</span></span>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Commercial vehicle fluid systems</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-medium uppercase tracking-[0.13em] text-white/55">
            <span>Fuel injection pipes</span><span className="text-habanero">·</span><span>Hydraulic hoses</span><span className="text-habanero">·</span><span>Nylon brake pipes</span><span className="text-habanero">·</span><span>Power steering hoses</span>
          </div>
        </div>
      </div>
    </section>
  );
}
