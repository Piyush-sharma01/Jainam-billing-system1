import React, { useEffect, useState } from "react";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";
import { productAPI, categoryAPI, brandAPI } from "../services/api";

const pillars = [
  { icon: ShieldCheck, title: "Trusted Quality",    body: "Every product sourced directly from established manufacturers, verified for spec compliance before reaching our catalogue." },
  { icon: Truck,       title: "Reliable Supply",    body: "Consistent stock levels maintained so your projects aren't held up waiting for materials." },
  { icon: Headphones,  title: "Dedicated Support",  body: "Each client has a named account manager — a real person who knows your business and handles your orders personally." },
  { icon: Award,       title: "Trusted Brands",     body: "We work only with brands whose quality standards meet ours — so you know what you're getting, every time." },
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
      {/* Hero section */}
      <section className="bg-navy py-16 sm:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase mb-4">
            About Us
          </p>
          <h1 className="font-display font-600 text-3xl sm:text-4xl text-white leading-tight">
            A supplier built on long-term relationships
          </h1>
        </div>
      </section>

      {/* Body copy */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-navy leading-relaxed text-base mb-5">
          Jainam is a dependable supplier of pipes, valves, fittings and related hardware,
          working directly with leading brands to keep our catalogue current, competitively
          priced, and consistently in stock.
        </p>
        <p className="text-ink-soft leading-relaxed mb-5">
          Every client works with a dedicated account manager who personally handles their
          orders, pricing, and invoicing — so there's always a familiar face behind every order,
          not just a form.
        </p>
        <p className="text-ink-soft leading-relaxed">
          Whether you're sourcing for a single project or maintaining an ongoing supply
          relationship, our team is set up to make ordering simple and predictable.
        </p>
      </section>

      {/* Stats — pulled live from the catalogue, not fixed numbers */}
      <section className="border-y border-line bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {[
            { num: stats ? stats.products : "—", label: "Active products" },
            { num: stats ? stats.categories : "—", label: "Product categories" },
            { num: stats ? stats.brands : "—", label: "Brands carried" },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="font-mono font-600 text-2xl sm:text-3xl text-navy">{num}</p>
              <p className="text-xs text-ink-soft mt-1 font-display">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase mb-3">
          Why Jainam
        </p>
        <h2 className="font-display font-600 text-2xl sm:text-3xl text-navy mb-10">
          What we stand for
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div 
              key={title}
              className="bg-white border border-line p-6 flex gap-4 hover-lift"
            >
              <div className="w-10 h-10 bg-line flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={18} className="text-navy" />
              </div>
              <div>
                <h3 className="font-display font-600 text-sm text-navy mb-1">{title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
