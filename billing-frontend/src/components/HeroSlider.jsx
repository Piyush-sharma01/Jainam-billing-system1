import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  MoveUpRight,
} from "lucide-react";

export default function HeroSlider({
  products = [],
  stats = {},
}) {
  const slides = useMemo(() => {
    const productSlides = products.slice(0, 3).map((p) => ({
      kind: "product",
      eyebrow: p.category || p.brand || "Featured Product",
      title: p.name,
      body: p.description || "Explore this product in the Jainam catalogue.",
      image: p.imageUrl,
      primaryTo: `/store/product/${p.id}`,
      primaryLabel: "View Product",
    }));

    const catalogueSlide = {
      kind: "catalogue",
      eyebrow: "JAINAM CATALOGUE",
      title: "Everything your project needs, in one catalogue.",
      body:
        stats.productCount != null
          ? `Explore ${stats.productCount} products across ${
              stats.categoryCount || 0
            } categories.`
          : "Explore Jainam products, categories and solutions.",
      image: products[0]?.imageUrl,
      primaryTo: "/store/catalogue",
      primaryLabel: "Explore Catalogue",
    };

    return [...productSlides, catalogueSlide];
  }, [products, stats]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);

    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
  };

  useEffect(() => {
    startTimer();

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (newIndex) => {
    const next =
      ((newIndex % slides.length) + slides.length) %
      slides.length;

    setIndex(next);
    startTimer();
  };

  const previous = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => startTimer();

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;

    const delta =
      e.changedTouches[0].clientX -
      touchStartX.current;

    if (Math.abs(delta) > 45) {
      delta < 0 ? next() : previous();
    }

    touchStartX.current = null;
  };

  if (!slides.length) return null;

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-luster text-deadly"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Jainam featured catalogue"
    >
      {/* Architectural grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(#223382 1px, transparent 1px),
            linear-gradient(90deg, #223382 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Large background blocks */}
      <div className="absolute right-0 top-0 h-full w-[42%] bg-aster hidden lg:block" />

      <div className="absolute right-[8%] bottom-0 w-32 h-32 bg-habanero hidden lg:block" />

      <div className="absolute left-0 bottom-0 w-24 h-24 bg-tan hidden lg:block" />

      <div className="relative z-10 min-h-[600px] lg:min-h-[680px] grid grid-cols-1 lg:grid-cols-12">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-20">

          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-habanero" />

            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-royal uppercase">
              {slide.eyebrow}
            </span>
          </div>

          <h1
            key={index}
            className="font-display font-semibold text-display-xl text-deadly max-w-4xl animate-fade-up"
          >
            {slide.title}
          </h1>

          {slide.body && (
            <p
              key={`body-${index}`}
              className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-deadly/65 animate-fade-up-d"
            >
              {slide.body}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-4">

            <Link
              to={slide.primaryTo}
              className="
                group
                inline-flex
                items-center
                gap-3
                bg-habanero
                text-white
                px-7
                py-4
                font-display
                text-sm
                font-semibold
                transition-all
                duration-300
                hover:bg-deadly
              "
            >
              {slide.primaryLabel}

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/store/catalogue"
              className="
                group
                inline-flex
                items-center
                gap-2
                border
                border-royal
                text-royal
                px-7
                py-4
                font-display
                text-sm
                font-semibold
                transition-all
                duration-300
                hover:bg-royal
                hover:text-white
              "
            >
              Catalogue

              <MoveUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {/* Slider controls */}
          <div className="mt-12 flex items-center gap-6">

            <div className="font-mono text-xs text-deadly/50">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2">/</span>
              {String(slides.length).padStart(2, "0")}
            </div>

            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`
                    h-1
                    transition-all
                    duration-300
                    ${
                      i === index
                        ? "w-12 bg-habanero"
                        : "w-5 bg-royal/25 hover:bg-royal/50"
                    }
                  `}
                />
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={previous}
                aria-label="Previous slide"
                className="
                  w-11 h-11
                  border border-royal/30
                  text-royal
                  flex items-center justify-center
                  hover:bg-royal
                  hover:text-white
                  transition-colors
                "
              >
                <ArrowLeft size={17} />
              </button>

              <button
                onClick={next}
                aria-label="Next slide"
                className="
                  w-11 h-11
                  bg-royal
                  text-white
                  flex items-center justify-center
                  hover:bg-deadly
                  transition-colors
                "
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PRODUCT IMAGE */}
        <div className="lg:col-span-5 relative flex items-center justify-center px-6 sm:px-10 lg:px-10 py-12 lg:py-16">

          <div className="relative w-full max-w-[520px] aspect-square">

            {/* offset architectural block */}
            <div className="absolute inset-0 translate-x-5 translate-y-5 bg-royal" />

            <div className="absolute -top-5 -right-5 w-24 h-24 bg-habanero z-0" />

            {/* Product image surface */}
            <div className="
              relative
              z-10
              w-full
              h-full
              bg-white
              flex
              items-center
              justify-center
              overflow-hidden
              shadow-2xl
            ">
              {slide.image ? (
                <img
                  key={`image-${index}`}
                  src={slide.image}
                  alt={slide.title}
                  className="
                    w-full
                    h-full
                    object-contain
                    p-8
                    sm:p-12
                    animate-fade-in
                    transition-transform
                    duration-700
                    hover:scale-105
                  "
                />
              ) : (
                <div className="text-center px-8">
                  <div className="font-display text-6xl text-royal/10">
                    J
                  </div>
                </div>
              )}

              {/* Product label */}
              <div className="
                absolute
                left-5
                bottom-5
                bg-deadly
                text-white
                px-4
                py-3
                font-mono
                text-[10px]
                tracking-[0.12em]
                uppercase
              ">
                Jainam Catalogue
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
