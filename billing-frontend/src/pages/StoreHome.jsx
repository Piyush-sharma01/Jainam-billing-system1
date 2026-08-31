import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Check, ArrowRight, ChevronRight,
  Package, Truck, Headphones, ShieldCheck,
} from "lucide-react";
import { brandAPI, categoryAPI, productAPI } from "../services/api";
import { useCart } from "../services/cartContext";

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

  const featured   = products.slice(0, 5);
  const heroProduct = products[0] || null;

  return (
    <div className="bg-dark-bg text-dark-text">

      {/* ═══════════════════════════════════════
          01 — HERO
      ═══════════════════════════════════════ */}
      <HeroSection heroProduct={heroProduct} loading={loading} />

      {/* ═══════════════════════════════════════
          BRAND TICKER
      ═══════════════════════════════════════ */}
      {!loading && brands.length > 0 && <BrandTicker brands={brands} />}

      {/* ═══════════════════════════════════════
          02 — CATEGORIES
      ═══════════════════════════════════════ */}
      <CategorySection categories={categories} loading={loading} />

      {/* ═══════════════════════════════════════
          03 — FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      <ProductSection
        products={featured}
        loading={loading}
        addedId={addedId}
        onAdd={handleAdd}
      />

      {/* ═══════════════════════════════════════
          04 — BRAND / STORY
      ═══════════════════════════════════════ */}
      <BrandStorySection />

      {/* ═══════════════════════════════════════
          05 — WHY JAINAM
      ═══════════════════════════════════════ */}
      <WhySection />

      {/* ═══════════════════════════════════════
          06 — FINAL CTA
      ═══════════════════════════════════════ */}
      <FinalCTA />
    </div>
  );
}

/* ─────────────────────────────────────────────
   01 HERO
───────────────────────────────────────────── */
function HeroSection({ heroProduct, loading }) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-dark-deep">
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#8B949E 1px,transparent 1px),linear-gradient(90deg,#8B949E 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top rule */}
      <div className="border-b border-dark-border px-6 sm:px-10 py-4 flex items-center justify-between relative z-10">
        <span className="font-mono text-[10px] tracking-[0.2em] text-dark-muted uppercase">
          Industrial Supply Co.
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-dark-muted uppercase">
          Est. Mumbai, India
        </span>
      </div>

      {/* Hero body — asymmetric split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative z-10">

        {/* LEFT: editorial text column */}
        <div className="flex flex-col justify-between px-6 sm:px-10 pt-12 pb-10 lg:border-r border-dark-border">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-dark-copper" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
                Pipes · Valves · Fittings
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-600 text-display-xl text-dark-text leading-none mb-6 animate-fade-up">
              Built for<br />
              <span className="text-dark-copper">industry.</span><br />
              Sourced for<br />
              reliability.
            </h1>

            <p className="text-dark-muted text-base sm:text-lg leading-relaxed max-w-md mb-10 animate-fade-up-d">
              Jainam supplies pipes, valves, fittings and hardware to businesses
              across India — backed by dedicated account management and consistent
              stock availability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/store/catalogue"
                className="inline-flex items-center gap-2 bg-dark-copper text-white font-display font-medium text-sm px-6 py-3.5 hover:bg-orange-600 transition-colors"
              >
                Explore Catalogue
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/store/contact"
                className="inline-flex items-center gap-2 border border-dark-border text-dark-muted font-display font-medium text-sm px-6 py-3.5 hover:border-dark-text hover:text-dark-text transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Bottom stat row */}
          <div className="mt-12 pt-8 border-t border-dark-border grid grid-cols-3 gap-4">
            {[
              { val: "500+", label: "SKUs" },
              { val: "OEM",  label: "Compatible" },
              { val: "B2B",  label: "Direct Supply" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-mono font-600 text-xl text-dark-text">{val}</p>
                <p className="font-mono text-[10px] tracking-widest text-dark-muted uppercase mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: product imagery panel */}
        <div className="hidden lg:flex flex-col">
          {/* Large image area */}
          <div className="flex-1 relative overflow-hidden bg-dark-surface flex items-center justify-center">
            {/* Corner annotations */}
            <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-dark-muted uppercase opacity-50">
              Featured Product
            </span>
            <span className="absolute top-4 right-4 font-mono text-[9px] tracking-widest text-dark-muted uppercase opacity-50">
              ↗ View Catalogue
            </span>

            {!loading && heroProduct?.imageUrl ? (
              <img
                src={heroProduct.imageUrl}
                alt={heroProduct.name}
                className="w-full h-full object-contain p-12 animate-fade-in"
                style={{ maxHeight: "70vh" }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-dark-muted opacity-20">
                <Package size={64} strokeWidth={1} />
                <span className="font-mono text-xs tracking-widest uppercase">Your Products Here</span>
              </div>
            )}

            {/* Product label strip */}
            {!loading && heroProduct && (
              <div className="absolute bottom-0 inset-x-0 border-t border-dark-border px-6 py-4 flex items-center justify-between bg-dark-deep/80 backdrop-blur-sm">
                <div>
                  <p className="font-display font-medium text-sm text-dark-text truncate max-w-xs">
                    {heroProduct.name}
                  </p>
                  <p className="font-mono text-xs text-dark-muted mt-0.5">
                    {heroProduct.brand || heroProduct.category || ""}
                  </p>
                </div>
                <p className="font-mono font-600 text-dark-copper text-base shrink-0 ml-4">
                  ₹{Number(heroProduct.price).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Two thumbnail slots */}
          <div className="grid grid-cols-2 border-t border-dark-border h-32">
            {[1, 2].map((idx) => {
              const p = !loading ? (idx === 1 ? /* products[1] */ null : null) : null;
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden bg-dark-surface flex items-center justify-center ${
                    idx === 1 ? "border-r border-dark-border" : ""
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-widest text-dark-muted uppercase opacity-30">
                    {idx === 1 ? "Pipes & Valves" : "Fittings & Hardware"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile product preview */}
      {!loading && heroProduct?.imageUrl && (
        <div className="lg:hidden border-t border-dark-border bg-dark-surface flex items-center gap-4 px-6 py-4">
          <img
            src={heroProduct.imageUrl}
            alt={heroProduct.name}
            className="w-16 h-16 object-contain shrink-0"
          />
          <div className="min-w-0">
            <p className="font-display font-medium text-sm text-dark-text truncate">
              {heroProduct.name}
            </p>
            <p className="font-mono text-xs text-dark-copper mt-0.5">
              ₹{Number(heroProduct.price).toFixed(2)}
            </p>
          </div>
          <Link to="/store/catalogue" className="ml-auto shrink-0">
            <ChevronRight size={18} className="text-dark-muted" />
          </Link>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   BRAND TICKER
───────────────────────────────────────────── */
function BrandTicker({ brands }) {
  const items = [...brands, ...brands]; // doubled for seamless loop
  return (
    <div className="border-y border-dark-border bg-dark-surface overflow-hidden py-4">
      <div className="flex w-max animate-ticker gap-0">
        {items.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            className="flex items-center gap-6 px-8 shrink-0"
          >
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-6 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity grayscale"
              />
            ) : (
              <span className="font-mono text-[11px] tracking-[0.15em] text-dark-muted uppercase whitespace-nowrap">
                {brand.name}
              </span>
            )}
            <span className="w-px h-4 bg-dark-border shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   02 CATEGORIES
───────────────────────────────────────────── */
function CategorySection({ categories, loading }) {
  const [ref, visible] = useReveal();

  const display = loading
    ? Array.from({ length: 4 }, (_, i) => ({ id: i, name: "", _skeleton: true }))
    : categories;

  return (
    <section ref={ref} className="bg-dark-bg py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
              02 / Product Range
            </span>
            <h2 className="font-display font-600 text-display-lg text-dark-text mt-2">
              Browse by<br />category
            </h2>
          </div>
          <Link
            to="/store/catalogue"
            className="inline-flex items-center gap-2 text-sm font-display font-medium text-dark-muted hover:text-dark-text transition-colors group"
          >
            View full catalogue
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category list — editorial numbered style */}
        <div className="divide-y divide-dark-border border-t border-dark-border">
          {display.map((cat, idx) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              idx={idx}
              visible={visible}
              skeleton={cat._skeleton}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryRow({ cat, idx, visible, skeleton }) {
  const delay = `${idx * 80}ms`;

  if (skeleton) {
    return (
      <div className="py-6 flex items-center gap-6">
        <div className="w-10 h-4 rounded bg-dark-surface" />
        <div className="flex-1 h-6 rounded bg-dark-surface" />
      </div>
    );
  }

  return (
    <Link
      to={`/store/catalogue?category=${encodeURIComponent(cat.name)}`}
      className="group flex items-center gap-6 sm:gap-10 py-5 sm:py-6 hover:pl-2 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(12px)",
        transition: `opacity 0.5s ${delay}, transform 0.5s ${delay}`,
      }}
    >
      {/* Number */}
      <span className="font-mono text-[11px] tracking-widest text-dark-muted shrink-0 w-8">
        {String(idx + 1).padStart(2, "0")}
      </span>

      {/* Divider line that grows on hover */}
      <span className="h-px w-8 sm:w-12 bg-dark-border group-hover:w-16 group-hover:bg-dark-copper transition-all duration-300 shrink-0" />

      {/* Name */}
      <span className="font-display font-600 text-display-md text-dark-text group-hover:text-dark-copper transition-colors flex-1 truncate">
        {cat.name}
      </span>

      {/* Arrow */}
      <ChevronRight
        size={20}
        className="text-dark-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0"
      />
    </Link>
  );
}

/* ─────────────────────────────────────────────
   03 FEATURED PRODUCTS
───────────────────────────────────────────── */
function ProductSection({ products, loading, addedId, onAdd }) {
  const [ref, visible] = useReveal(0.1);

  const [featured, ...rest] = products;
  const supporting = rest.slice(0, 4);

  if (loading) {
    return (
      <section className="bg-dark-surface border-t border-dark-border py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SkeletonProducts />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="bg-dark-surface border-t border-dark-border py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
              03 / Products
            </span>
            <h2 className="font-display font-600 text-display-lg text-dark-text mt-2">
              Selected<br />products
            </h2>
          </div>
          <Link
            to="/store/catalogue"
            className="inline-flex items-center gap-2 text-sm font-display font-medium text-dark-muted hover:text-dark-text transition-colors group"
          >
            Full catalogue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Editorial layout: large + grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-dark-border"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          {/* Large featured */}
          {featured && (
            <div className="bg-dark-bg lg:row-span-2 flex flex-col">
              {/* Image */}
              <div className="flex-1 bg-dark-surface relative overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] group">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Package size={48} className="text-dark-border" strokeWidth={1} />
                )}
                {/* Overlay label */}
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-[9px] tracking-widest text-dark-copper uppercase bg-dark-bg/80 px-2 py-1">
                    Featured
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="border-t border-dark-border p-5 sm:p-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-widest text-dark-muted uppercase mb-1">
                    {featured.brand || featured.category || ""}
                  </p>
                  <p className="font-display font-600 text-lg text-dark-text leading-snug">
                    {featured.name}
                  </p>
                  <p className="font-mono font-600 text-dark-copper text-base mt-2">
                    ₹{Number(featured.price).toFixed(2)}
                  </p>
                </div>
                <AddButton
                  product={featured}
                  addedId={addedId}
                  onAdd={onAdd}
                  size="lg"
                />
              </div>
            </div>
          )}

          {/* Supporting grid */}
          {supporting.map((product) => (
            <SmallProductCard
              key={product.id}
              product={product}
              addedId={addedId}
              onAdd={onAdd}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SmallProductCard({ product, addedId, onAdd }) {
  const outOfStock = product.stock === 0;

  return (
    <div className="bg-dark-bg flex flex-row sm:flex-col">
      {/* Image */}
      <div className="w-24 sm:w-full sm:aspect-square bg-dark-surface flex items-center justify-center overflow-hidden shrink-0 group relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package size={24} className="text-dark-border" strokeWidth={1} />
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-dark-bg/70 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-widest text-dark-muted uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="border-t border-dark-border flex items-center justify-between gap-3 px-4 py-3 flex-1 min-w-0">
        <div className="min-w-0">
          <p className="font-display font-medium text-xs text-dark-text truncate">{product.name}</p>
          <p className="font-mono text-[10px] text-dark-copper mt-0.5">
            ₹{Number(product.price).toFixed(2)}
          </p>
        </div>
        <AddButton product={product} addedId={addedId} onAdd={onAdd} size="sm" />
      </div>
    </div>
  );
}

function AddButton({ product, addedId, onAdd, size = "sm" }) {
  const added      = addedId === product.id;
  const outOfStock = product.stock === 0;

  if (size === "lg") {
    return (
      <button
        onClick={() => !outOfStock && onAdd(product)}
        disabled={outOfStock}
        className={`shrink-0 flex items-center gap-2 px-4 py-2.5 font-display font-medium text-xs transition-colors ${
          outOfStock
            ? "border border-dark-border text-dark-muted cursor-not-allowed"
            : added
            ? "bg-green-700 text-white"
            : "bg-dark-copper text-white hover:bg-orange-600"
        }`}
      >
        {outOfStock ? "Out of Stock" : added ? <><Check size={13} /> Added</> : <><ShoppingCart size={13} /> Add to Cart</>}
      </button>
    );
  }

  return (
    <button
      onClick={() => !outOfStock && onAdd(product)}
      disabled={outOfStock}
      aria-label={`Add ${product.name} to cart`}
      className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-colors ${
        outOfStock
          ? "border-dark-border text-dark-muted cursor-not-allowed"
          : added
          ? "bg-green-700 border-green-700 text-white"
          : "border-dark-border text-dark-muted hover:border-dark-copper hover:text-dark-copper"
      }`}
    >
      {added ? <Check size={12} /> : <ShoppingCart size={12} />}
    </button>
  );
}

function SkeletonProducts() {
  return (
    <div>
      <div className="h-8 w-48 bg-dark-surface rounded mb-14" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-dark-border">
        <div className="bg-dark-bg min-h-[360px] animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-dark-bg h-20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   04 BRAND / STORY
───────────────────────────────────────────── */
function BrandStorySection() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section
      ref={ref}
      className="bg-dark-bg border-t border-dark-border py-20 sm:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: oversized type */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
              04 / About Jainam
            </span>
            <h2 className="font-display font-600 text-display-xl text-dark-text mt-4 leading-none">
              Industry<br />
              grade.<br />
              <span className="text-dark-copper">Every</span><br />
              time.
            </h2>
          </div>

          {/* Right: copy + specs */}
          <div
            className="space-y-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(24px)",
              transition: "opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease",
            }}
          >
            <p className="text-dark-muted text-base leading-relaxed">
              Jainam is a B2B supplier of pipes, valves, fittings and industrial hardware —
              working directly with OEM-compatible brands to maintain a current, competitively
              priced catalogue that's consistently in stock.
            </p>
            <p className="text-dark-muted text-base leading-relaxed">
              Every client is paired with a dedicated account manager who handles orders,
              pricing and invoicing — so you always have a direct line, not a ticket queue.
            </p>

            {/* Spec lines */}
            <div className="border-t border-dark-border pt-8 space-y-4">
              {[
                { label: "Supply model",   value: "Direct B2B" },
                { label: "Catalogue",      value: "500+ active SKUs" },
                { label: "Sourcing",       value: "OEM-compatible brands" },
                { label: "Account model",  value: "Dedicated manager per client" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-widest text-dark-muted uppercase">
                    {label}
                  </span>
                  <span className="h-px flex-1 bg-dark-border" />
                  <span className="font-mono text-xs text-dark-text shrink-0">{value}</span>
                </div>
              ))}
            </div>

            <Link
              to="/store/about"
              className="inline-flex items-center gap-2 text-sm font-display font-medium text-dark-muted hover:text-dark-text transition-colors group"
            >
              More about us
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   05 WHY JAINAM
───────────────────────────────────────────── */
function WhySection() {
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
      body: "Maintained inventory levels so your procurement doesn't stall. Regular restocking across all major SKUs.",
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
    <section ref={ref} className="bg-dark-surface border-t border-dark-border py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
            05 / Why Jainam
          </span>
          <h2 className="font-display font-600 text-display-lg text-dark-text mt-2">
            What sets us apart
          </h2>
        </div>

        {/* 4-column grid with border separators */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-dark-border border border-dark-border"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="p-6 sm:p-8 flex flex-col gap-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: `opacity 0.5s ${i * 80}ms ease, transform 0.5s ${i * 80}ms ease`,
              }}
            >
              <div className="w-8 h-8 border border-dark-border flex items-center justify-center shrink-0">
                <Icon size={15} className="text-dark-copper" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-600 text-sm text-dark-text">{title}</h3>
              <p className="font-sans text-sm text-dark-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   06 FINAL CTA
───────────────────────────────────────────── */
function FinalCTA() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section
      ref={ref}
      className="bg-dark-bg border-t border-dark-border py-24 sm:py-36 relative overflow-hidden"
    >
      {/* Background type watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-600 text-[20vw] leading-none text-dark-surface whitespace-nowrap"
          style={{ userSelect: "none" }}
        >
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
        <span className="font-mono text-[11px] tracking-[0.2em] text-dark-copper uppercase">
          06 / Get Started
        </span>
        <h2 className="font-display font-600 text-display-xl text-dark-text mt-4 mb-6 leading-none">
          Find the right<br />component.
        </h2>
        <p className="text-dark-muted text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Browse 500+ SKUs across pipes, valves, fittings and hardware — filtered by brand,
          category, or specification.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/store/catalogue"
            className="inline-flex items-center gap-2 bg-dark-copper text-white font-display font-medium text-sm px-8 py-4 hover:bg-orange-600 transition-colors"
          >
            Explore Catalogue
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/store/contact"
            className="inline-flex items-center gap-2 border border-dark-border text-dark-muted font-display font-medium text-sm px-8 py-4 hover:border-dark-text hover:text-dark-text transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
