import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Check, ArrowRight, ChevronRight, Search,
  Package, Truck, Headphones, ShieldCheck,
} from "lucide-react";
import { brandAPI, categoryAPI, productAPI } from "../services/api";
import { useCart } from "../services/cartContext";
import HeroSlider from "../components/HeroSlider";

/* ─────────────────────────────────────────────
   UTILITY: simple intersection-observer hook
   for triggering entrance animations
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function StoreHome() {
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [addedId,    setAddedId]    = useState(null);
  const { addItem } = useCart();
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [bRes, cRes, pRes] = await Promise.all([
          brandAPI.getAll(),
          categoryAPI.getAll(),
          productAPI.getAll(),
        ]);
        setBrands(bRes.data || []);
        setCategories(cRes.data || []);
        setProducts((pRes.data || []).filter((p) => p.active !== false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const featured  = products.slice(0, 8);
  const spotlight = products[Math.min(3, products.length - 1)] || products[0] || null;

  const stats = {
    productCount: products.length,
    categoryCount: categories.length,
    brandCount: brands.length,
  };

  return (
    <div className="bg-white bg-habanero">

      {/* ═══════════════════════════════════════
          01 — HERO SLIDER
      ═══════════════════════════════════════ */}
      {!loading && <HeroSlider products={products} stats={stats} />}
      {loading && (
        <div className="h-[560px] sm:h-[620px] bg-royal animate-pulse" />
      )}

      {/* ═══════════════════════════════════════
          BRAND STRIP
      ═══════════════════════════════════════ */}
      {!loading && brands.length > 0 && <BrandStrip brands={brands} />}

      {/* ═══════════════════════════════════════
          02 — CATEGORY EXPLORER (bento)
      ═══════════════════════════════════════ */}
      <CategoryExplorer categories={categories} loading={loading} />

      {/* ═══════════════════════════════════════
          03 — PRODUCT DISCOVERY + FEATURED
      ═══════════════════════════════════════ */}
      <ProductDiscovery
        products={products}
        featured={featured}
        loading={loading}
        addedId={addedId}
        onAdd={handleAdd}
        search={search}
        setSearch={setSearch}
      />

      {/* ═══════════════════════════════════════
          04 — PRODUCT SPOTLIGHT
      ═══════════════════════════════════════ */}
      {!loading && spotlight && <ProductSpotlight product={spotlight} />}

      {/* ═══════════════════════════════════════
          05 — PROCESS FLOW
      ═══════════════════════════════════════ */}
      <ProcessFlow />

      {/* ═══════════════════════════════════════
          06 — WHY JAINAM (bento)
      ═══════════════════════════════════════ */}
      <WhySection stats={stats} loading={loading} />

      {/* ═══════════════════════════════════════
          07 — FINAL CTA
      ═══════════════════════════════════════ */}
      <FinalCTA />
    </div>
  );
}

/* ─────────────────────────────────────────────
   BRAND STRIP
───────────────────────────────────────────── */
function BrandStrip({ brands }) {
  const items = [...brands, ...brands];
  return (
    <div className="border-b border-tan bg-white overflow-hidden py-5">
      <div className="flex w-max animate-ticker gap-0">
        {items.map((brand, i) => (
          <div key={`${brand.id}-${i}`} className="flex items-center gap-6 px-8 shrink-0">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-6 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity grayscale"
              />
            ) : (
              <span className="font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase whitespace-nowrap">
                {brand.name}
              </span>
            )}
            <span className="w-px h-4 bg-tan shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   02 CATEGORY EXPLORER — bento composition
───────────────────────────────────────────── */
function CategoryExplorer({ categories, loading }) {
  const [ref, visible] = useReveal();
  const display = loading
    ? Array.from({ length: 5 }, (_, i) => ({ id: i, name: "", _skeleton: true }))
    : categories;

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 border-b border-tan">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase">
              02 / Product Range
            </span>
            <h2 className="font-display font-600 text-display-lg bg-habanero mt-2">
              Explore our<br />products
            </h2>
          </div>
          <Link
            to="/store/catalogue"
            className="inline-flex items-center gap-2 text-sm font-display font-medium text-ink-soft hover:bg-habanero transition-colors group"
          >
            View full catalogue
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento grid: large navy "PRODUCTS" panel + category tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-tan border border-tan">
          {/* Large lead panel */}
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-royal relative overflow-hidden p-8 sm:p-10 flex flex-col justify-between min-h-[220px] sm:min-h-[320px]">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative z-10 w-10 h-10 bg-habanero flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="font-display font-600 text-display-md text-white leading-none mb-3">
                Products
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-sm">
                {loading
                  ? "Loading the current catalogue…"
                  : `${categories.length} categories of pipes, valves, fittings and hardware — all in stock and ready to order.`}
              </p>
            </div>
          </div>

          {/* Category tiles */}
          {display.map((cat, idx) => (
            <CategoryTile key={cat.id} cat={cat} idx={idx} visible={visible} skeleton={cat._skeleton} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ cat, idx, visible, skeleton }) {
  if (skeleton) {
    return <div className="bg-white p-6 min-h-[130px] animate-pulse" />;
  }
  const isCoral = idx % 3 === 1;
  return (
    <Link
      to={`/store/catalogue?category=${encodeURIComponent(cat.name)}`}
      className={`group relative flex flex-col justify-between p-6 min-h-[130px] transition-colors duration-300 ${
        isCoral ? "bg-habanero hover:bg-royal" : "bg-white hover:bg-royal"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(10px)",
        transition: `opacity 0.5s ${idx * 70}ms, transform 0.5s ${idx * 70}ms`,
      }}
    >
      <span className={`font-mono text-[10px] tracking-widest ${isCoral ? "text-white/70" : "text-ink-soft"} group-hover:text-white/60`}>
        {String(idx + 1).padStart(2, "0")}
      </span>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-display font-600 text-base sm:text-lg leading-tight ${isCoral ? "text-white" : "bg-habanero"} group-hover:text-white transition-colors`}>
          {cat.name}
        </span>
        <ChevronRight
          size={16}
          className={`shrink-0 ${isCoral ? "text-white" : "bg-habanero"} group-hover:text-habanero group-hover:translate-x-1 transition-all`}
        />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   03 PRODUCT DISCOVERY + FEATURED SLIDER
───────────────────────────────────────────── */
function ProductDiscovery({ products, featured, loading, addedId, onAdd, search, setSearch }) {
  const results = search.trim()
    ? products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  return (
    <section className="bg-royal py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-10 lg:gap-6 mb-16">

          {/* Search panel */}
          <div className="bg-habanero p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/70 uppercase">
                03 / Product Discovery
              </span>
              <h2 className="font-display font-600 text-2xl sm:text-3xl text-white mt-3 mb-6 leading-tight">
                Find your product
              </h2>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative"
            >
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 bg-habanero/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-white pl-11 pr-4 py-3.5 text-sm bg-habanero placeholder:bg-habanero/40 focus:outline-none"
              />
            </form>
            <Link
              to="/store/catalogue"
              className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] tracking-widest uppercase text-white hover:bg-habanero transition-colors group"
            >
              Full search &amp; filters
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Live search results */}
            {results.length > 0 && (
              <div className="mt-6 bg-white divide-y divide-line">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    to={`/store/product/${p.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-tan/50 transition-colors"
                  >
                    <span className="text-sm bg-habanero truncate">{p.name}</span>
                    <span className="font-mono text-xs text-habanero shrink-0">₹{Number(p.price).toFixed(0)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Featured heading */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase mb-3">
              Featured Products
            </span>
            <h3 className="font-display font-600 text-display-md text-white leading-tight mb-4">
              A current sample of<br />what's in stock
            </h3>
            <p className="text-white/60 text-sm sm:text-base max-w-md leading-relaxed">
              Scroll to browse — every item shown is live from the catalogue, with real pricing
              and availability.
            </p>
          </div>
        </div>

        {/* Horizontal product slider */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[45%] sm:w-[220px] shrink-0 aspect-square bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-white/50 text-sm">No products available yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-1 px-1">
            {featured.map((product) => (
              <FeaturedCard
                key={product.id}
                product={product}
                added={addedId === product.id}
                onAdd={() => onAdd(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ product, added, onAdd }) {
  const outOfStock = product.stock === 0;
  return (
    <div className="w-[70%] xs:w-[55%] sm:w-[240px] shrink-0 snap-start bg-white group flex flex-col">
      <Link
        to={`/store/product/${product.id}`}
        className="relative block aspect-square bg-tan/40 overflow-hidden"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} strokeWidth={1} className="bg-habanero/20" />
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); if (!outOfStock) onAdd(); }}
          disabled={outOfStock}
          aria-label={`Add ${product.name} to cart`}
          className={`absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center transition-colors ${
            outOfStock
              ? "opacity-0"
              : added
              ? "bg-green-700 text-white"
              : "bg-royal text-white hover:bg-habanero"
          }`}
        >
          {added ? <Check size={14} /> : <ShoppingCart size={14} />}
        </button>
      </Link>
      <div className="p-4 border-t border-tan">
        {(product.brand || product.category) && (
          <p className="font-mono text-[9px] tracking-widest text-ink-soft uppercase mb-1 truncate">
            {product.brand || product.category}
          </p>
        )}
        <Link
          to={`/store/product/${product.id}`}
          className="font-display font-medium text-sm bg-habanero leading-snug line-clamp-2 hover:text-habanero transition-colors block min-h-[2.5em]"
        >
          {product.name}
        </Link>
        <p className="font-mono font-600 text-base text-habanero mt-2">
          ₹{Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   04 PRODUCT SPOTLIGHT — editorial, dramatic
───────────────────────────────────────────── */
function ProductSpotlight({ product }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 border-b border-tan overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">

          {/* LEFT — huge image on navy, overlapping coral shape */}
          <div
            className="relative bg-royal min-h-[340px] sm:min-h-[440px] flex items-center justify-center clip-spotlight-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-habanero rotate-12" />
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain p-12 sm:p-16"
              />
            ) : (
              <Package size={80} strokeWidth={1} className="relative z-10 text-white/20" />
            )}
          </div>

          {/* RIGHT — copy */}
          <div
            className="bg-royal lg:bg-white flex flex-col justify-center px-8 sm:px-12 py-12 lg:py-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(20px)",
              transition: "opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease",
            }}
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase mb-4">
              04 / Product Spotlight
            </span>
            <h2 className="font-display font-600 text-display-lg bg-habanero leading-none mb-5">
              {product.name}
            </h2>
            {product.description && (
              <p className="text-ink-soft text-base leading-relaxed mb-6 max-w-md line-clamp-4">
                {product.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {product.brand && (
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Brand</p>
                  <p className="font-display font-600 text-sm bg-habanero mt-1">{product.brand}</p>
                </div>
              )}
              {product.category && (
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Category</p>
                  <p className="font-display font-600 text-sm bg-habanero mt-1">{product.category}</p>
                </div>
              )}
              <div>
                <p className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Price</p>
                <p className="font-mono font-600 text-lg text-habanero mt-1">₹{Number(product.price).toFixed(2)}</p>
              </div>
            </div>
            <Link
              to={`/store/product/${product.id}`}
              className="inline-flex items-center gap-2 bg-royal text-white font-display font-medium text-sm px-6 py-3.5 hover:bg-habanero transition-colors w-fit"
            >
              View Product
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   05 PROCESS FLOW
───────────────────────────────────────────── */
function ProcessFlow() {
  const [ref, visible] = useReveal(0.1);
  const steps = [
    { n: "01", label: "Requirement", body: "Tell us what you need — by phone, message, or the enquiry form." },
    { n: "02", label: "Product Selection", body: "Browse the catalogue or get help finding the right spec." },
    { n: "03", label: "Enquiry", body: "Send your enquiry or place an order directly from the storefront." },
    { n: "04", label: "Confirmation", body: "Your account manager confirms pricing and generates the invoice." },
    { n: "05", label: "Delivery", body: "Order is fulfilled and shipped to your site." },
  ];
  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 border-b border-tan">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase">
          05 / How It Works
        </span>
        <h2 className="font-display font-600 text-display-lg bg-habanero mt-2 mb-14">
          From enquiry to delivery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="relative"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(14px)",
                transition: `opacity 0.5s ${i * 90}ms, transform 0.5s ${i * 90}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-600 text-3xl bg-habanero/15">{step.n}</span>
                <span className="flex-1 h-px bg-tan hidden sm:block" />
                {i < steps.length - 1 && (
                  <ArrowRight size={14} className="text-habanero hidden sm:block" />
                )}
              </div>
              <h3 className="font-display font-600 text-sm bg-habanero uppercase tracking-wide mb-2">
                {step.label}
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   06 WHY JAINAM — bento
───────────────────────────────────────────── */
function WhySection({ stats, loading }) {
  const [ref, visible] = useReveal(0.1);

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Consistent quality",
      body: "Products sourced from established manufacturers. What's in the catalogue is what you receive — no substitutions.",
    },
    {
      icon: Truck,
      title: "Stock you can rely on",
      body: "Maintained inventory levels so your procurement doesn't stall. Regular restocking across active SKUs.",
    },
    {
      icon: Headphones,
      title: "Dedicated account management",
      body: "A named account manager for every client. Direct contact for orders, pricing queries and invoice questions.",
    },
    {
      icon: Package,
      title: "OEM-compatible range",
      body: "Pipes, valves and fittings compatible with leading OEM brands — catalogued and cross-referenced for your workflow.",
    },
  ];

  return (
    <section ref={ref} className="bg-royal py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase">
          06 / Why Jainam
        </span>
        <h2 className="font-display font-600 text-display-lg text-white mt-2 mb-14">
          What sets us apart
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {/* Large stat tile */}
          <div className="lg:row-span-2 bg-habanero p-8 sm:p-10 flex flex-col justify-between min-h-[220px]">
            <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase">Live catalogue</span>
            <div>
              <p className="font-display font-600 text-5xl sm:text-6xl text-white leading-none">
                {loading ? "—" : stats.productCount}
              </p>
              <p className="font-mono text-[11px] tracking-widest text-white/80 uppercase mt-3">
                Active products across {loading ? "—" : stats.categoryCount} categories
                {stats.brandCount ? ` · ${stats.brandCount} brands` : ""}
              </p>
            </div>
          </div>

          {pillars.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="bg-royal p-6 sm:p-8 flex flex-col gap-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(14px)",
                transition: `opacity 0.5s ${i * 80}ms, transform 0.5s ${i * 80}ms`,
              }}
            >
              <div className="w-9 h-9 border border-white/20 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-habanero" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-600 text-sm text-white">{title}</h3>
              <p className="font-sans text-sm text-white/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   07 FINAL CTA
───────────────────────────────────────────── */
function FinalCTA() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section ref={ref} className="bg-white py-24 sm:py-36 relative overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-display font-600 text-[20vw] leading-none text-tan whitespace-nowrap">
          JAINAM
        </span>
      </div>

      <div
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase">
          07 / Get Started
        </span>
        <h2 className="font-display font-600 text-display-xl bg-habanero mt-4 mb-6 leading-none">
          Have a requirement?<br />Let's find the right product.
        </h2>
        <p className="text-ink-soft text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Browse the catalogue by brand, category or specification — or send your requirement
          straight through to your account manager.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/store/contact"
            className="inline-flex items-center gap-2 bg-habanero text-white font-display font-medium text-sm px-8 py-4 hover:bg-royal transition-colors"
          >
            Send Enquiry
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/store/catalogue"
            className="inline-flex items-center gap-2 border border-tan bg-habanero font-display font-medium text-sm px-8 py-4 hover:border-navy transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
