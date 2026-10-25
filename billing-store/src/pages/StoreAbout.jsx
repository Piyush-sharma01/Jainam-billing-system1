import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Factory, Gauge, MapPin, MoveRight, ShieldCheck, Truck, Wrench } from "lucide-react";

const productLines = [
  { icon: Gauge, title: "Automobile pipes", detail: "Precision fluid and fuel-transmission lines for commercial vehicle applications." },
  { icon: Wrench, title: "Nozzle pipes", detail: "Engineered diesel injection and fuel-delivery pipe assemblies." },
  { icon: Truck, title: "Hydraulic hoses", detail: "High-pressure hose lines for heavy commercial vehicles and equipment." },
  { icon: ShieldCheck, title: "Brake pipe systems", detail: "Hydraulic and nylon pneumatic brake lines for commercial vehicles." },
  { icon: MoveRight, title: "Power steering hoses", detail: "Heavy-duty power-steering fluid lines for trucks and buses." },
  { icon: Factory, title: "Teflon pipes", detail: "PTFE fluid-transmission lines for demanding applications." },
];

export default function StoreAbout() {
  return (
    <div className="page-enter">
      <section className="relative overflow-hidden bg-royal text-white">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "54px 54px" }} />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-6 -top-6 h-44 w-44 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70"><MapPin size={12} className="text-habanero" /> Pune, Maharashtra · Since 2002</p>
          <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">Engineering the flow<br /><span className="text-habanero">of every journey.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">Jainam Auto Industries makes automotive pipes and hoses for commercial vehicles, OEMs and replacement markets across India.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/store/catalogue" className="inline-flex items-center gap-2 rounded-full bg-habanero px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-royal">Explore products <ArrowRight size={15} /></Link>
            <Link to="/store/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10">Talk to Jainam <ArrowUpRight size={15} /></Link>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["01", "Pune, Maharashtra"],
              ["02", "Since 2002"],
              ["03", "ISO 9001:2015"],
            ].map(([num, label]) => <div key={num} className="flex items-center gap-3 border-t border-white/20 py-4"><span className="font-mono text-[10px] text-habanero">{num}</span><span className="text-sm font-medium text-white/80">{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-24">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">Who we are</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-royal sm:text-4xl">A Pune-based specialist in fluid transmission.</h2>
        </div>
        <div className="space-y-5 text-[15px] leading-7 text-ink-soft">
          <p>Based in Sanaswadi, Pune, Jainam Auto Industries manufactures and distributes fluid-transmission components for traditional commercial vehicles and next-generation New Energy Vehicles.</p>
          <p>The range serves TATA, Mahindra, Eicher, Ashok Leyland and other commercial vehicle applications. Jainam supplies OEM and replacement-market parts across India through an authorized distributor and dealer network.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Automotive pipes and fuel lines", "Braided and hydraulic hoses", "Nylon air-brake tubing", "OEM and replacement-market supply"].map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-paper/60 p-4 text-sm font-medium text-royal"><Check size={16} className="mt-0.5 shrink-0 text-habanero" />{item}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">Main manufacturing lines</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-royal sm:text-4xl">Automotive products, built around the flow.</h2>
            </div>
            <Link to="/store/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:text-habanero">Browse the catalogue <ArrowRight size={15} /></Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productLines.map(({ icon: Icon, title, detail }, index) => <article key={title} className="group rounded-2xl border border-royal/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-royal/10 sm:p-7">
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.18em] text-ink-soft/50">0{index + 1}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper text-royal transition-colors group-hover:bg-habanero group-hover:text-white"><Icon size={18} /></span></div>
              <h3 className="mt-7 font-display text-lg font-semibold text-royal">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{detail}</p>
              <div className="mt-6 h-px w-full bg-line"><div className="h-px w-0 bg-habanero transition-all duration-500 group-hover:w-full" /></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-deadly p-7 text-white sm:p-10 lg:p-14">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-habanero/30 bg-habanero/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-habanero"><BadgeCheck size={13} /> Quality assurance</span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">ISO 9001:2015 certified</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">The official company site identifies its quality management system as audited and certified by ICV Assessments Pvt. Ltd.</p>
              <div className="mt-6 space-y-2 text-sm text-white/75">
                <p><span className="text-white/45">Certificate:</span> IN/89327141/5147</p>
                <p><span className="text-white/45">Scope:</span> Manufacturing of automotive pipes and hoses</p>
              </div>
            </div>
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-habanero/40 bg-habanero/10 text-habanero sm:h-36 sm:w-36"><ShieldCheck size={54} strokeWidth={1.2} /></div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div><p className="font-display text-xl font-semibold text-royal">Have a vehicle or pipe specification to match?</p><p className="mt-1 text-sm text-ink-soft">Share the requirement with Jainam's team.</p></div>
          <Link to="/store/contact" className="inline-flex items-center gap-2 self-start rounded-full bg-habanero px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-royal md:self-auto">Contact Jainam <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
