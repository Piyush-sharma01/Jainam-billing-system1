import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Package } from "lucide-react";

/**
 * HeroSlider — asymmetric, product-led hero.
 *
 * Slides are generated from REAL data passed in as props:
 *  - `products`: active products from the API (used for the first slides)
 *  - `stats`: real counts computed from the API (categories/brands/products)
 * No fabricated product names, prices or business claims are introduced here.
 */
export default function HeroSlider({ products = [], stats = {} }) {
  const slides = useMemo(() => {
    const productSlides = products.slice(0, 3).map((p) => ({
      kind: "product",
      eyebrow: p.category || p.brand || "Featured",
      title: p.name,
      body: p.description || "",
      price: p.price,
      image: p.imageUrl,
      primaryTo: `/store/product/${p.id}`,
      primaryLabel: "View Product",
    }));

    const catalogueSlide = {
      kind: "catalogue",
      eyebrow: "Pipes · Valves · Fittings",
      title: "Everything your project needs, in one catalogue.",
      body:
        stats.productCount != null
          ? `Browse ${stats.productCount} active products across ${stats.categoryCount || 0} categories — filtered by brand, category or specification.`
          : "Browse pipes, valves, fittings and hardware — filtered by brand, category or specification.",
      image: products[0]?.imageUrl,
      primaryTo: "/store/catalogue",
      primaryLabel: "Explore Catalogue",
    };

    const all = [...productSlides, catalogueSlide];
    return all.length ? all : [catalogueSlide];
  }, [products, stats]);

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
            <p key={`body-${index}`} className="text-white/60 text-base sm:text-lg leading-relaxed max-w-md mb-4 animate-fade-up-d line-clamp-3">
              {slide.body}
            </p>
          )}

          {slide.price != null && (
            <p className="font-mono font-600 text-2xl text-habanero mb-8">
              ₹{Number(slide.price).toFixed(2)}
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

        {/* RIGHT — large product imagery, overlapping the coral block */}
        <div className="hidden lg:flex relative items-center justify-center z-10 px-10">
          <div className="relative w-full max-w-md aspect-square bg-white flex items-center justify-center shadow-2xl">
            {slide.image ? (
              <img
                key={`img-${index}`}
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain p-10 animate-fade-in"
              />
            ) : (
              <Package size={72} strokeWidth={1} className="text-royal/20" />
            )}
            {/* Corner tag */}
            <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-royal/50 uppercase">
              {slide.kind === "product" ? "Product" : "Catalogue"}
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
