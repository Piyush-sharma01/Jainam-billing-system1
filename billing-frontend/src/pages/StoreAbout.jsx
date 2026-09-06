import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Truck, Headphones, Award, PackageSearch, Navigation,
  Package, LayoutGrid, Phone, Boxes, UserCheck, ArrowRight,
} from "lucide-react";
import { productAPI, categoryAPI, brandAPI } from "../services/api";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    body: "Every product sourced directly from established manufacturers, verified for spec compliance before reaching our catalogue.",
    highlight: true,
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    body: "Consistent stock levels maintained so your projects aren't held up waiting for materials.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    body: "Each client has a named account manager — a real person who knows your business and handles your orders personally.",
  },
  {
    icon: Award,
    title: "Trusted Brands",
    body: "We work only with brands whose quality standards meet ours — so you know what you're getting, every time.",
  },
  {
    icon: PackageSearch,
    title: "Custom Sourcing",
    body: "Can't find an exact spec in the catalogue? Send your requirement and we'll help source it.",
  },
  {
    icon: Navigation,
    title: "Reliable Dispatch",
    body: "Orders are confirmed and dispatched on a predictable timeline, with your account manager keeping you updated.",
  },
];

export default function StoreAbout() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([productAPI.getAll(), categoryAPI.getAll(), brandAPI.getAll()])
      .then(([pRes, cRes, bRes]) => {
        const products = (pRes.data || []).filter((p) => p.active !== false);
        setStats({
          products: products.length,
          categories: (cRes.data || []).length,
          brands: (bRes.data || []).length,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-enter">

      {/* ══════════════════════════════════════
          PAGE BANNER
      ══════════════════════════════════════ */}
      <section className="relative h-[280px] sm:h-[340px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1636887584784-954392022b75?fm=jpg&q=70&w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-royal/85" />
        <div className="relative text-center px-4">
          <h1 className="font-display font-600 text-3xl sm:text-5xl text-white leading-none mb-4">
            About Us
          </h1>
          <p className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
            Home <span className="mx-2 text-habanero">/</span> About Us
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTRO
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-habanero uppercase mb-3">
              Who We Are
            </p>
            <h2 className="font-display font-600 text-2xl sm:text-4xl text-royal leading-tight">
              Built for Reliable Industrial Supply.
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-ink-soft leading-relaxed">
              Jainam is a dependable supplier of pipes, valves, fittings and related hardware,
              working directly with leading brands to keep our catalogue current, competitively
              priced, and consistently in stock.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Every client works with a dedicated account manager who personally handles their
              orders, pricing, and invoicing — so there's always a familiar face behind every
              order, not just a form.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PILLARS GRID — first tile highlighted
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map(({ icon: Icon, title, body, highlight }) => (
            <div
              key={title}
              className={`p-7 flex flex-col ${
                highlight
                  ? "bg-habanero"
                  : "bg-white border border-tan"
              }`}
            >
              <div
                className={`w-11 h-11 flex items-center justify-center mb-6 ${
                  highlight ? "bg-white/20" : "bg-tan"
                }`}
              >
                <Icon size={20} className={highlight ? "text-white" : "text-royal"} />
              </div>
              <h3
                className={`font-display font-600 text-base mb-2 ${
                  highlight ? "text-white" : "text-royal"
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-6 flex-1 ${
                  highlight ? "text-white/80" : "text-ink-soft"
                }`}
              >
                {body}
              </p>
              <Link
                to="/store/contact"
                className={`inline-flex items-center gap-2 text-xs font-display font-medium uppercase tracking-wide transition-colors ${
                  highlight
                    ? "text-white hover:text-royal"
                    : "text-royal hover:text-habanero"
                }`}
              >
                Read More <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND — real counts from the catalogue
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
        <div className="relative bg-royal overflow-hidden">
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-habanero/90"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
          />
          <div className="relative grid grid-cols-3 gap-4 px-6 sm:px-12 py-10 sm:py-14 text-center">
            {[
              { icon: Package, num: stats ? stats.products : "—", label: "Active Products" },
              { icon: LayoutGrid, num: stats ? stats.categories : "—", label: "Categories" },
              { icon: Award, num: stats ? stats.brands : "—", label: "Brands Carried" },
            ].map(({ icon: Icon, num, label }) => (
              <div key={label} className="flex flex-col items-center">
                <Icon size={24} className="text-white/70 mb-3" strokeWidth={1.5} />
                <p className="font-display font-600 text-2xl sm:text-4xl text-white leading-none">
                  {num}
                </p>
                <p className="font-mono text-[9px] sm:text-[10px] tracking-widest text-white/70 uppercase mt-2">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US — split layout
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-8 lg:gap-6 items-start">

          {/* Left — image + call-us overlay card */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden bg-tan">
              <img
                src="https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?fm=jpg&q=70&w=1200&auto=format&fit=crop"
                alt="Industrial valve and equipment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-6 left-6 right-6 sm:right-auto sm:w-52 bg-habanero p-5">
              <Phone size={20} className="text-white mb-3" />
              <p className="font-display font-600 text-sm text-white leading-snug mb-2">
                Have a question? Call us now.
              </p>
              <p className="font-mono text-xs text-white/80 tracking-wide">
                +91 00000 00000
              </p>
            </div>
          </div>

          {/* Middle — copy + feature bullets */}
          <div className="lg:pt-2">
            <p className="font-mono text-[11px] tracking-widest text-habanero uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="font-display font-600 text-2xl sm:text-3xl text-royal leading-tight mb-5">
              Built to Support Your Projects, Start to Finish.
            </h2>
            <p className="text-ink-soft leading-relaxed mb-8">
              Whether you're sourcing for a single project or maintaining an ongoing supply
              relationship, our team is set up to make ordering simple and predictable.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-tan">
                <Boxes size={22} className="text-habanero shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-600 text-sm text-royal mb-1">
                    Consistent Stock Levels
                  </h4>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    Maintained inventory so your projects aren't held up waiting for materials.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <UserCheck size={22} className="text-habanero shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-600 text-sm text-royal mb-1">
                    Dedicated Account Manager
                  </h4>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    One point of contact who knows your orders, pricing, and history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — mission, vision, testimonial */}
          <div className="space-y-4">
            <div className="bg-tan/40 p-6">
              <p className="font-display font-600 text-sm text-habanero uppercase tracking-wide mb-2">
                Our Mission
              </p>
              <p className="text-ink-soft text-sm leading-relaxed">
                To make sourcing industrial hardware simple, predictable, and backed by a
                team that treats every order personally.
              </p>
            </div>
            <div className="bg-tan/40 p-6">
              <p className="font-display font-600 text-sm text-habanero uppercase tracking-wide mb-2">
                Our Vision
              </p>
              <p className="text-ink-soft text-sm leading-relaxed">
                To be the supplier businesses default to — reliable, well-stocked, and easy
                to work with.
              </p>
            </div>

            {/* Placeholder testimonial — swap in a real client quote before launch */}
            <div className="bg-royal p-6">
              <p className="text-white/80 text-sm leading-relaxed italic mb-5">
                "Consistent stock and a single point of contact made ordering so much
                easier for our team."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-habanero flex items-center justify-center font-display font-600 text-xs text-white shrink-0">
                  RM
                </div>
                <div>
                  <p className="font-display font-600 text-sm text-white">Rahul Mehta</p>
                  <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
                    Procurement Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
