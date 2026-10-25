import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Factory, Gauge,
  Package, Search, ShieldCheck, Truck, Wrench,
} from "lucide-react";
import { brandAPI, categoryAPI, productAPI } from "../services/api";
import HeroSlider from "../components/HeroSlider";

const familyArtwork = {
  hoses: "/jainam-slider-hydraulic-hoses.jpg",
  pipes: "/jainam-slider-formed-pipes.jpg",
  brake: "/jainam-slider-air-brake-tubes.jpg",
};

const officialFamilies = [
  { name: "Automotive pipes", icon: Factory, image: familyArtwork.pipes },
  { name: "Nozzle pipes", icon: Gauge, image: familyArtwork.pipes },
  { name: "Hydraulic hoses", icon: Wrench, image: familyArtwork.hoses },
  { name: "Nylon brake pipes", icon: Truck, image: familyArtwork.brake },
  { name: "Power steering hoses", icon: Gauge, image: familyArtwork.hoses },
  { name: "Teflon pipes", icon: Package, image: familyArtwork.pipes },
];

const applications = ["TATA", "Mahindra", "Eicher", "Ashok Leyland", "New Energy Vehicles"];

function formatPrice(price) {
  if (price === null || price === undefined || String(price).trim() === "") return "Request a quote";
  const value = Number(price);
  return Number.isFinite(value) ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : "Request a quote";
}

function artForCategory(name = "") {
  const value = name.toLowerCase();
  if (value.includes("brake") || value.includes("nylon")) return familyArtwork.brake;
  if (value.includes("hose") || value.includes("hydraulic") || value.includes("steering")) return familyArtwork.hoses;
  if (value.includes("pipe") || value.includes("teflon") || value.includes("nozzle")) return familyArtwork.pipes;
  return null;
}

export default function StoreHome() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [brandResult, categoryResult, productResult] = await Promise.all([
          brandAPI.getAll(), categoryAPI.getAll(), productAPI.getAll(),
        ]);
        if (!active) return;
        setBrands(brandResult.data || []);
        setCategories(categoryResult.data || []);
        setProducts((productResult.data || []).filter((product) => product.active !== false));
      } catch (error) {
        console.error("Unable to load Jainam storefront catalogue", error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const stats = {
    productCount: products.length,
    categoryCount: categories.length,
    brandCount: brands.length,
  };
  const featured = products.slice(0, 10);
  const spotlight = products.find((product) => product.imageUrl) || products[0] || null;
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return products.filter((product) => [product.name, product.productCode, product.category, product.description]
      .some((field) => String(field || "").toLowerCase().includes(query))).slice(0, 5);
  }, [products, search]);

  return (
    <div className="store-home bg-white text-royal">
      <HeroSlider stats={stats} />
      <ApplicationBand brands={brands} />
      <CategorySection categories={categories} products={products} loading={loading} />
      <ProductCollection products={featured} search={search} setSearch={setSearch} results={searchResults} loading={loading} />
      {!loading && spotlight && <ProductSpotlight product={spotlight} />}
      <ProcessSection />
      <WhySection stats={stats} loading={loading} />
      <FinalCTA />
    </div>
  );
}

function ApplicationBand({ brands }) {
  const list = brands.length ? brands : applications.map((name) => ({ name }));
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:gap-8 lg:px-10">
        <div className="shrink-0">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-habanero">Vehicle applications</p>
          <p className="mt-1 text-xs text-ink-soft">Listed by Jainam Auto Industries</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-7 gap-y-3 md:justify-between">
          {list.map((item, index) => item.logoUrl ? (
            <img key={`${item.id || item.name}-${index}`} src={item.logoUrl} alt={item.name} className="h-8 max-w-28 object-contain opacity-75 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
          ) : (
            <span key={`${item.id || item.name}-${index}`} className="font-display text-sm font-bold tracking-wide text-slate-400 transition-colors hover:text-royal sm:text-base">{item.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ kicker, title, copy, link, linkLabel }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-habanero">{kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-royal sm:text-4xl lg:text-5xl">{title}</h2>
        {copy && <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">{copy}</p>}
      </div>
      {link && <Link to={link} className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-slate-200 px-5 text-xs font-semibold text-royal transition hover:border-royal hover:bg-royal hover:text-white sm:self-auto">{linkLabel || "View catalogue"}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>}
    </div>
  );
}

function CategorySection({ categories, products, loading }) {
  const list = categories.length ? categories.slice(0, 6).map((category) => ({ ...category, live: true })) : officialFamilies;
  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading kicker="01 / Product families" title={<>A clear view of<br className="hidden sm:block" /> the range.</>} copy="Browse Jainam's automotive pipe, hose and fluid-system product families." link="/store/catalogue" linkLabel="Explore full range" />

        {loading ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[1.35/1] animate-pulse rounded-2xl bg-slate-200" />)}</div> : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {list.map((category, index) => {
              const exactProduct = category.live && products.find((product) => product.category === category.name && product.imageUrl);
              const image = exactProduct?.imageUrl || category.image || artForCategory(category.name);
              const destination = category.live ? `/store/catalogue?category=${encodeURIComponent(category.name)}` : "/store/catalogue";
              return (
                <Link key={category.id || category.name} to={destination} className={`store-category-card group relative isolate min-h-[180px] overflow-hidden rounded-2xl bg-royal shadow-sm sm:min-h-[235px] ${index === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
                  {image ? <img src={image} alt={exactProduct ? exactProduct.name : `Illustrative range image for ${category.name}`} loading="lazy" className="absolute inset-0 z-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#11234f] via-[#1b3472] to-[#07142f]" />}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07142f]/95 via-[#07142f]/30 to-[#07142f]/5" />
                  <div className="relative z-20 flex h-full min-h-[180px] flex-col justify-between p-4 sm:min-h-[235px] sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full border border-white/20 bg-[#07142f]/45 px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">{exactProduct ? "Catalogue photo" : "Range illustration"}</span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition group-hover:border-habanero group-hover:bg-habanero"><ArrowRight size={15} /></span>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">{String(index + 1).padStart(2, "0")} · Jainam Auto</p>
                      <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-white sm:text-2xl">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCollection({ products, search, setSearch, results, loading }) {
  const railRef = useRef(null);
  const scrollRail = (direction) => railRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-habanero">02 / Catalogue picks</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-royal sm:text-4xl lg:text-5xl">Featured products</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">Product images and details are shown from the live catalogue. Confirm pricing and availability with Jainam.</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-royal/50" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, code or category" className="h-12 w-full rounded-full border border-slate-200 bg-[#f7f8fb] pl-11 pr-4 text-sm text-royal outline-none transition focus:border-royal focus:bg-white focus:ring-4 focus:ring-royal/10" aria-label="Search catalogue products" />
            {results.length > 0 && <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">{results.map((product) => <Link key={product.id} to={`/store/product/${product.id}`} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"><span className="min-w-0 truncate text-sm font-medium text-royal">{product.name}</span><span className="shrink-0 text-xs font-semibold text-habanero">{formatPrice(product.price)}</span></Link>)}</div>}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft/70">{loading ? "Loading catalogue" : `${products.length} featured ${products.length === 1 ? "item" : "items"}`}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollRail(-1)} aria-label="Scroll featured products left" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-royal transition hover:border-royal hover:bg-royal hover:text-white"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => scrollRail(1)} aria-label="Scroll featured products right" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-royal transition hover:border-royal hover:bg-royal hover:text-white"><ChevronRight size={18} /></button>
          </div>
        </div>

        {loading ? <div className="flex gap-4 overflow-hidden">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="w-[74%] shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-[32%] lg:w-[24%]"><div className="aspect-[4/3] rounded-t-2xl bg-slate-200" /><div className="space-y-3 p-5"><div className="h-3 w-1/3 rounded bg-slate-200" /><div className="h-5 w-2/3 rounded bg-slate-200" /></div></div>)}</div> : products.length ? (
          <div ref={railRef} className="store-product-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pt-1" aria-label="Featured catalogue products">
            {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
            <Link to="/store/catalogue" className="group flex min-h-[390px] w-[78%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl bg-[#0a1735] p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[42%] lg:w-[27%]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-habanero text-white transition group-hover:rotate-45"><ArrowRight size={20} /></span>
              <span><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">Browse by range</span><span className="mt-2 block font-display text-3xl font-semibold leading-tight">See the<br />full catalogue.</span><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-habanero">View products <ArrowRight size={14} /></span></span>
            </Link>
          </div>
        ) : <div className="rounded-2xl border border-dashed border-slate-200 bg-[#f7f8fb] px-6 py-10 text-center"><Package size={25} className="mx-auto text-royal/30" /><p className="mt-3 font-display text-lg font-semibold text-royal">Catalogue items will appear here</p><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-soft">For product availability or a specific vehicle application, send your requirement to Jainam.</p><Link to="/store/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-habanero">Contact Jainam <ArrowRight size={14} /></Link></div>}
      </div>
    </section>
  );
}

function ProductCard({ product, index }) {
  const hasImage = Boolean(product.imageUrl);
  return (
    <article className="store-product-card group w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_34px_-26px_rgba(8,24,59,0.45)] transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_22px_44px_-24px_rgba(8,24,59,0.35)] sm:w-[42%] lg:w-[27%]">
      <Link to={`/store/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#f3f5fa] via-white to-[#e9edf7]">
          {hasImage ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.06] sm:p-8" loading={index < 3 ? "eager" : "lazy"} /> : <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_70%_30%,rgba(249,133,19,.11),transparent_38%),linear-gradient(135deg,#f5f7fb,#e8edf8)] text-royal/30"><Package size={44} strokeWidth={1.1} /><span className="mt-3 font-mono text-[8px] uppercase tracking-[0.18em]">Image unavailable</span></div>}
          <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full border border-white/70 bg-white/90 px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-royal shadow-sm">{product.category || product.brand || "Jainam Auto"}</span>
          {Number(product.stock) === 0 && <span className="absolute right-4 top-4 rounded-full bg-slate-900/75 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-white">Check availability</span>}
          <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-habanero text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowRight size={16} /></span>
        </div>
        <div className="p-4 sm:p-5">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-soft/70">{product.brand || "Jainam Auto Industries"}</p>
          <h3 className="mt-1.5 line-clamp-2 min-h-[2.8rem] font-display text-base font-semibold leading-snug text-royal transition-colors group-hover:text-habanero">{product.name}</h3>
          {(product.productCode || product.size) && <p className="mt-2 flex flex-wrap gap-2">{product.productCode && <span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[9px] text-ink-soft">{product.productCode}</span>}{product.size && <span className="rounded-md bg-slate-50 px-2 py-1 text-[9px] text-ink-soft">{product.size}</span>}</p>}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><span className={`text-sm font-bold ${product.price === null || product.price === undefined || String(product.price).trim() === "" ? "text-habanero" : "text-royal"}`}>{formatPrice(product.price)}</span><span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">View item</span></div>
        </div>
      </Link>
    </article>
  );
}

function ProductSpotlight({ product }) {
  return (
    <section className="bg-[#07142f] py-14 text-white sm:py-18 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-10">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111f42]">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="aspect-[4/3] w-full object-contain p-8 sm:p-12" loading="lazy" /> : <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(249,133,19,.16),transparent_55%)]"><Package size={72} strokeWidth={1} className="text-white/30" /></div>}
          <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/70">Featured catalogue item</span>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-habanero">03 / Product spotlight</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">{product.name}</h2>
          {product.description && <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/60">{product.description}</p>}
          <div className="mt-6 flex flex-wrap gap-2">{product.brand && <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75">{product.brand}</span>}{product.category && <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75">{product.category}</span>}{product.size && <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75">Size: {product.size}</span>}</div>
          <p className="mt-7 text-xl font-bold text-habanero">{formatPrice(product.price)}</p>
          <Link to={`/store/product/${product.id}`} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-royal transition hover:bg-habanero hover:text-white">View product details <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ["01", "Tell us what you need", "Share the component, vehicle model, size and quantity."],
    ["02", "Explore the range", "Browse product families and catalogue listings."],
    ["03", "Send an enquiry", "Reach Jainam by email, WhatsApp or the enquiry form."],
    ["04", "Discuss your quote", "Confirm current pricing and availability with the team."],
  ];
  return (
    <section className="bg-[#f5f7fb] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading kicker="04 / Simple enquiry" title="From requirement to conversation." copy="A clear way to find a product and ask the Jainam team about it." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, copy]) => <article key={number} className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg sm:p-6"><span className="font-mono text-xs font-bold text-habanero">{number}</span><div className="my-4 h-px bg-gradient-to-r from-habanero/60 to-slate-100" /><h3 className="font-display text-lg font-semibold text-royal">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-soft">{copy}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function WhySection({ stats, loading }) {
  const reasons = [
    [ShieldCheck, "Quality system", "ISO 9001:2015 quality management system listed by Jainam Auto Industries."],
    [Factory, "Pune-based", "Manufacturing and company base in Sanaswadi, Pune, Maharashtra."],
    [Truck, "Across India", "OEM and replacement-market supply through the company's dealer network."],
  ];
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
          <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-habanero p-7 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="relative"><p className="font-mono text-[9px] font-bold uppercase tracking-[0.19em] text-white/65">Live product catalogue</p><p className="mt-4 font-display text-6xl font-semibold leading-none">{loading ? "—" : stats.productCount}</p><p className="mt-2 text-sm text-white/75">active catalogue products</p></div>
            <div className="relative flex items-center gap-2 border-t border-white/20 pt-4 text-xs text-white/80"><BadgeCheck size={15} /> Product listings are maintained by Jainam.</div>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-habanero">05 / Jainam Auto Industries</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-royal sm:text-4xl">Built around reliable fluid transmission.</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {reasons.map(([Icon, title, copy]) => <article key={title} className="rounded-2xl border border-slate-100 bg-[#f8f9fc] p-5 transition hover:bg-white hover:shadow-md"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-habanero shadow-sm"><Icon size={18} /></span><h3 className="mt-4 font-display text-base font-semibold text-royal">{title}</h3><p className="mt-2 text-xs leading-5 text-ink-soft">{copy}</p></article>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-[#07142f] py-16 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-0 jainam-hero-atmosphere opacity-70" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="max-w-3xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-habanero">06 / Talk to Jainam</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">Looking for a specific pipe or hose?</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">Share your vehicle application or product code and contact the Jainam team about the right catalogue item.</p></div>
        <div className="flex shrink-0 flex-wrap gap-3"><Link to="/store/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-habanero px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-royal">Send an enquiry <ArrowRight size={15} /></Link><Link to="/store/catalogue" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">Browse catalogue <ArrowRight size={15} /></Link></div>
      </div>
    </section>
  );
}
