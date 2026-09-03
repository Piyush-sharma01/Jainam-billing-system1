import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Package, ShieldCheck, Workflow, Headphones,
} from "lucide-react";

/**
 * HeroSlider — asymmetric, editorial hero.
 *
 * All slides are static marketing content (no individual product names,
 * prices, or descriptions are pulled in here). Only `stats` (real counts
 * computed from the API — categories/brands/products) is used, for the
 * catalogue slide's copy.
 */
export default function HeroSlider({ stats = {} }) {
  const slides = useMemo(() => {
    return [
      {
        icon: Package,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87CSfTcCMM85KZqUXTUgHXJUbM0Vv4ststZjvUmFsgg&s=10",
        eyebrow: "Pipes · Valves · Fittings",
        title: "Everything your project needs, in one catalogue.",
        body:
          stats.productCount != null
            ? `Browse ${stats.productCount} active products across ${stats.categoryCount || 0} categories — filtered by brand, category or specification.`
            : "Browse pipes, valves, fittings and hardware — filtered by brand, category or specification.",
        primaryTo: "/store/catalogue",
        primaryLabel: "Explore Catalogue",
      },
      {
        icon: Pipes,
        image: "https://png.pngtree.com/thumb_back/fh260/background/20241015/pngtree-steel-pipes-stacked-in-a-factory-closeup-blurred-background-image_16395356.jpg",
        eyebrow: "Quality You Can Trust",
        title: "Sourced from established manufacturers.",
        body: "Every product is verified for spec compliance before it reaches our catalogue — no substitutions, no surprises.",
        primaryTo: "/store/about",
        primaryLabel: "About Jainam",
      },
      {
        icon: Workflow,
        image:"https://mediaassets.cbre.com/-/media/project/cbre/shared-site/insights/articles/2023-article-media-folder/now-is-the-time-media-folder/now-is-the-time-hero.jpg",
        eyebrow: "How It Works",
        title: "From enquiry to delivery, simplified.",
        body: "Browse the catalogue, send your requirement, and let a dedicated account manager take it from confirmation to shipment.",
        primaryTo: "/store/catalogue",
        primaryLabel: "Start Browsing",
      },
      {
        icon: Person-working,
        image:"https://media.istockphoto.com/id/2142837149/photo/engineer-male-work-checking-water-pipe-inspecting-valve-testing-water-pump.jpg?s=612x612&w=0&k=20&c=sXnfOffJSA-aQ5PoL6SFD3C0zzh-5tXZKg4-Npobtt0=",
        eyebrow: "Get In Touch",
        title: "Have a requirement? Let's talk.",
        body: "Send your enquiry directly — our team responds with pricing and availability, fast.",
        primaryTo: "/store/contact",
        primaryLabel: "Contact Us",
      },
    ];
  }, [stats]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (i) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
    startTimer();
  };

  const pause = () => clearInterval(timerRef.current);
  const resume = () => startTimer();

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const slide = slides[index];
  const total = slides.length;
  const Icon = slide.icon || Package;

  return (
    <section
      className="relative bg-royal overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Fine engineered grid, very low opacity — technical texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Large coral geometric block — structural accent, offset/asymmetric */}
      <div className="hidden lg:block absolute top-0 right-0 w-[38%] h-full bg-habanero clip-hero-block" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[560px] sm:min-h-[620px]">
        {/* LEFT — editorial text column */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16 sm:py-20 z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-habanero" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase">
              {slide.eyebrow}
            </span>
          </div>

          <h1
            key={index}
            className="font-display font-600 text-display-lg text-white leading-[1.05] mb-6 max-w-xl animate-fade-up"
          >
            {slide.title}
          </h1>

          {slide.body && (
            <p key={`body-${index}`} className="text-white/60 text-base sm:text-lg leading-relaxed max-w-md mb-8 animate-fade-up-d line-clamp-3">
              {slide.body}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              to={slide.primaryTo}
              className="inline-flex items-center gap-2 bg-habanero text-white font-display font-medium text-sm px-6 py-3.5 hover:bg-white hover:text-royal transition-colors"
            >
              {slide.primaryLabel}
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/store/contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white font-display font-medium text-sm px-6 py-3.5 hover:border-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* RIGHT — image or editorial icon mark, overlapping the coral block */}
        <div className="hidden lg:flex relative items-center justify-center z-10 px-10">
          <div
            key={`visual-${index}`}
            className="relative w-full max-w-md aspect-square bg-white flex items-center justify-center shadow-2xl animate-fade-in overflow-hidden"
          >
            {slide.image ? (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon size={96} strokeWidth={1} className="text-royal/25" />
            )}
            {/* Corner tag */}
            <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-royal/50 uppercase bg-white/80 px-1.5 py-0.5">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="relative z-10 border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between py-4">
          {/* Progress */}
          <span className="font-mono text-[11px] tracking-widest text-white/50">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          {/* Dot / bar indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 transition-all duration-300 ${
                  i === index ? "w-7 bg-habanero" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>

          {/* Prev / next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(index - 1)}
              className="w-9 h-9 flex items-center justify-center border border-white/20 text-white hover:border-habanero hover:text-habanero transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="w-9 h-9 flex items-center justify-center border border-white/20 text-white hover:border-habanero hover:text-habanero transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
