import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Quality Pipes, Valves & Fittings",
    subtitle: "Everything you need for your project, sourced from trusted brands.",
    cta: "Browse Catalogue",
    to: "/store/catalogue",
  },
  {
    title: "Trusted by Businesses Across India",
    subtitle: "Decades of reliable supply and after-sales support.",
    cta: "About Us",
    to: "/store/about",
  },  
  {
    title: "Browse Our Full Catalogue",
    subtitle: "Shop by brand or category and place your order in minutes.",
    cta: "Shop Now",
    to: "/store/catalogue",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
    startTimer();
  };

  // Pause on hover/focus
  const pause = () => clearInterval(timerRef.current);
  const resume = () => startTimer();

  return (
    <div
      className="relative overflow-hidden bg-primary select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`transition-opacity duration-700 ${
            i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0"
          }`}
          aria-hidden={i !== index}
        >
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 40px)"
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
            {/* Slide number — mono accent */}
            <span className="inline-block font-mono text-xs text-secondary mb-4 tracking-widest">
              {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <h1 className="font-display font-600 text-3xl sm:text-5xl text-white leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
              {slide.subtitle}
            </p>
            <Link
              to={slide.to}
              className="inline-block border border-secondary text-secondary font-display font-medium px-6 py-3 rounded hover:bg-secondary hover:text-white transition-colors text-sm"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        onClick={() => goTo(index - 1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index ? "w-5 h-1.5 bg-secondary" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
