import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Quality Pipes, Valves & Fittings",
    subtitle: "Everything you need for your project, sourced from trusted brands.",
    gradient: "from-primary to-blue-700",
  },
  {
    title: "Trusted by Businesses Across India",
    subtitle: "Decades of reliable supply and after-sales support.",
    gradient: "from-blue-800 to-primary",
  },
  {
    title: "Browse Our Full Catalogue",
    subtitle: "Shop by brand or category and place your order in minutes.",
    gradient: "from-secondary to-orange-600",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${slide.gradient} text-white transition-opacity duration-700 ${
            i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">{slide.title}</h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
            <Link
              to="/store/catalogue"
              className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={() => goTo(index - 1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
