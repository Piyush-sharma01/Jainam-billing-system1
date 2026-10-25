import React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, MapPin, MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const whatsappHref = "https://wa.me/919422308740?text=Hello%20Jainam%20Auto%20Industries%2C%20I%20need%20a%20product%20quote.";

export default function HeroSlider({ stats = {} }) {
  return (
    <section className="jainam-hero relative isolate overflow-hidden bg-royal text-white">
      <div className="jainam-hero-grid absolute inset-0" aria-hidden="true" />
      <div className="jainam-hero-orbit jainam-hero-orbit-one" aria-hidden="true" />
      <div className="jainam-hero-orbit jainam-hero-orbit-two" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl grid-cols-1 items-center gap-9 px-5 py-14 sm:px-8 sm:py-16 lg:min-h-[650px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10 lg:py-20">
        <div className="relative z-10 animate-fade-up">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
            <MapPin size={12} className="text-habanero" /> Pune, Maharashtra <span className="text-white/25">/</span> Since 2002
          </div>

          <h1 className="max-w-2xl font-display text-[clamp(2.6rem,6vw,5.35rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
            Precision in every <span className="jainam-heading-accent">line.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
            Automotive pipes, hoses and fluid-transmission components for commercial vehicles, OEMs and replacement markets.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/store/catalogue" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-habanero px-6 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-royal">
              Explore catalogue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white/90 transition-colors hover:border-white hover:bg-white/10">
              Talk to our team <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-xs text-white/55">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-habanero" /> ISO 9001:2015</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-habanero" /> Pan-India distribution</span>
            {Number(stats.productCount) > 0 && <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {stats.productCount} products in catalogue</span>}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[640px] animate-fade-in lg:ml-auto">
          <div className="jainam-hero-media relative aspect-[1.12/1] overflow-hidden rounded-[2rem] border border-white/15 bg-deadly shadow-[0_30px_100px_-32px_rgba(0,0,0,0.8)] sm:aspect-[1.22/1]">
            <img src="/jainam-fluid-systems-hero.jpg" alt="Illustrative arrangement of braided hoses and precision formed metal pipes" className="jainam-hero-product-image absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deadly/75 via-transparent to-royal/10" />
            <div className="jainam-scanline absolute inset-x-0 top-0 h-1/2" aria-hidden="true" />

            <svg className="jainam-flow-svg absolute inset-0 h-full w-full" viewBox="0 0 680 560" fill="none" aria-hidden="true">
              <path className="jainam-flow-path" d="M-18 378C108 378 87 450 210 450C344 450 303 324 431 324C542 324 526 390 705 390" stroke="#F98513" strokeWidth="2" />
              <path className="jainam-flow-path jainam-flow-path-blue" d="M-24 398C92 398 100 472 216 472C360 472 328 347 443 347C560 347 565 414 700 414" stroke="#64B5FF" strokeWidth="1.4" />
              <circle cx="210" cy="450" r="5" fill="#F98513" />
              <circle cx="431" cy="324" r="5" fill="#64B5FF" />
            </svg>

            <div className="jainam-hero-badge absolute left-5 top-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-royal/75 px-4 py-3 shadow-xl backdrop-blur-md sm:left-7 sm:top-7">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-habanero/15 text-habanero"><BadgeCheck size={19} /></span>
              <span><span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">Quality system</span><span className="mt-0.5 block text-sm font-semibold text-white">ISO 9001:2015</span></span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-habanero">Fluid transmission</p>
                <p className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">Made for demanding routes</p>
              </div>
              <Link to="/store/about" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur transition-all hover:rotate-45 hover:bg-habanero hover:border-habanero" aria-label="Learn about Jainam"><MoveUpRight size={17} /></Link>
            </div>
          </div>

          <div className="jainam-float-card absolute -bottom-5 right-4 rounded-2xl border border-white/10 bg-white px-4 py-3 text-royal shadow-xl sm:-right-5 sm:px-5 sm:py-4">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-ink-soft">Built in</p>
            <p className="mt-0.5 font-display text-base font-semibold">Pune, India <ArrowDownRight size={14} className="ml-1 inline text-habanero" /></p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-deadly/25">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Commercial vehicle fluid systems</p>
          <div className="jainam-category-ticker flex gap-6 overflow-hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-white/55" aria-label="Product categories">
            <span>Fuel injection pipes</span><span className="text-habanero">·</span><span>Hydraulic hoses</span><span className="text-habanero">·</span><span>Nylon brake pipes</span><span className="text-habanero">·</span><span>Power steering hoses</span>
          </div>
        </div>
      </div>
    </section>
  );
}
