import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Package, X, SlidersHorizontal, Check, ChevronDown, ArrowRight } from "lucide-react";
import { productAPI, brandAPI, categoryAPI } from "../services/api";

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function StoreCatalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef(null);

  const activeBrand    = searchParams.get("brand")    || "";
  const activeCategory = searchParams.get("category") || "";


  /* ── Data fetch — unchanged from original ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [pRes, bRes, cRes] = await Promise.all([
          productAPI.getAll(),
          brandAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts((pRes.data || []).filter((p) => p.active !== false));
        setBrands(bRes.data   || []);
        setCategories(cRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Filter logic — unchanged ── */
  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesBrand    = !activeBrand    || p.brand    === activeBrand;
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSearch   =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [products, activeBrand, activeCategory, search]);

  const hasActiveFilter  = activeBrand || activeCategory;
  const activeFilterCount = [activeBrand, activeCategory].filter(Boolean).length;

  /* ── Close drawer on Escape ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="bg-white min-h-screen text-royal">

      {/* ══════════════════════════════════════
          CATALOGUE HEADER
      ══════════════════════════════════════ */}
      <header className="relative isolate overflow-hidden bg-[#07142f] text-white">
        <div className="absolute inset-0 jainam-hero-atmosphere opacity-80" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_0.82fr] lg:gap-12 lg:px-10 lg:py-16">
          <div>
            <p className="mb-6 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.19em] text-white/55"><span>Jainam Auto Industries</span><span className="text-habanero">/</span><span className="text-white/80">Catalogue</span></p>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-white/75"><span className="h-1.5 w-1.5 rounded-full bg-habanero" /> Automotive fluid systems</p>
            <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">The Jainam<br /><span className="text-habanero">product range.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Explore automotive pipes, hoses and fluid-transmission components by product name, category or vehicle application.</p>
            {!loading && <div className="mt-7 inline-flex items-baseline gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3"><span className="font-display text-3xl font-semibold text-white">{filteredProducts.length}</span><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">{hasActiveFilter ? "matching products" : "catalogue products"}</span></div>}
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full border border-habanero/40 sm:-right-5 sm:-top-5 sm:h-32 sm:w-32" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/5 shadow-2xl sm:rounded-[2rem]">
              <img src="/jainam-slider-formed-pipes.jpg" alt="Illustrative formed automotive pipe assemblies" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07142f]/75 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#07142f]/55 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/80 backdrop-blur sm:bottom-5 sm:left-5">Illustrative product-family image</p>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          FILTER + SEARCH BAR
      ══════════════════════════════════════ */}
      <div className="sticky top-[76px] lg:top-[90px] z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">

          {/* Desktop filter row */}
          <div className="hidden md:flex items-stretch gap-0 divide-x divide-gray-200">

            {/* Search */}
            <div className="relative flex-1 flex items-center">
              <Search size={14} className="absolute left-4 text-gray-500 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent pl-10 pr-4 py-4 text-sm text-royal placeholder:text-gray-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="absolute right-3 text-gray-500 hover:text-royal transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Brand filter */}
            {brands.length > 0 && (
              <FilterDropdown
                label="Brand"
                value={activeBrand}
                options={brands.map((b) => b.name)}
                onChange={(v) => setFilter("brand", v)}
              />
            )}

            {/* Category filter */}
            {categories.length > 0 && (
              <FilterDropdown
                label="Category"
                value={activeCategory}
                options={categories.map((c) => c.name)}
                onChange={(v) => setFilter("category", v)}
              />
            )}

            {/* Clear */}
            {hasActiveFilter && (
              <button
                onClick={() => setSearchParams({})}
                className="px-5 text-xs font-mono tracking-widest text-gray-500 hover:text-habanero transition-colors uppercase flex items-center gap-2 shrink-0"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Mobile filter row */}
          <div className="md:hidden flex items-stretch gap-0 divide-x divide-gray-200">
            {/* Search */}
            <div className="relative flex-1 flex items-center">
              <Search size={14} className="absolute left-3.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent pl-9 pr-3 py-3.5 text-sm text-royal placeholder:text-gray-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 text-gray-500"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter drawer trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="px-4 flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500 uppercase shrink-0 min-h-[44px]"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-habanero text-white text-[9px] font-mono flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RESULTS META
      ══════════════════════════════════════ */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2">
          <p className="font-mono text-[10px] tracking-[0.15em] text-gray-500 uppercase">
            {search.trim()
              ? `Results for "${search}" — ${filteredProducts.length} products`
              : hasActiveFilter
              ? `${activeBrand || activeCategory} — ${filteredProducts.length} products`
              : `All products — ${filteredProducts.length}`}
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════
          PRODUCT GRID
      ══════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-20">

        {loading ? (
          <SkeletonGrid />
        ) : filteredProducts.length === 0 ? (
          <EmptyState search={search} hasFilter={hasActiveFilter} onClear={() => { setSearch(""); setSearchParams({}); }} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product, idx) => (
              <CatalogueCard
                key={product.id}
                product={product}
                idx={idx}
              />
            ))}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          BOTTOM CTA BAND — poster-style order bar
      ══════════════════════════════════════ */}
      <div className="bg-royal relative overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 w-1/3 bg-habanero/90"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/store/contact"
            className="bg-white text-royal font-display font-600 text-sm uppercase tracking-wide px-6 py-3 hover:bg-habanero hover:text-white transition-colors shrink-0"
          >
            Contact Us
          </Link>
          <p className="text-white/70 text-xs sm:text-sm text-center sm:text-right">
            Can't find what you need? Send your requirement directly — our team will help you source it.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE FILTER DRAWER
      ══════════════════════════════════════ */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-50 border-t border-gray-200 rounded-t-lg max-h-[80vh] flex flex-col nav-drawer-enter">
            {/* Handle */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
              <span className="font-mono text-[11px] tracking-widest text-royal uppercase">
                Filters
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-500 hover:text-royal transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-6 space-y-8">
              {/* Brand */}
              {brands.length > 0 && (
                <FilterGroup
                  label="Brand"
                  options={brands.map((b) => b.name)}
                  active={activeBrand}
                  onSelect={(v) => { setFilter("brand", v); }}
                />
              )}

              {/* Category */}
              {categories.length > 0 && (
                <FilterGroup
                  label="Category"
                  options={categories.map((c) => c.name)}
                  active={activeCategory}
                  onSelect={(v) => { setFilter("category", v); }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 flex gap-3 shrink-0">
              <button
                onClick={() => { setSearchParams({}); setDrawerOpen(false); }}
                className="flex-1 py-3 border border-gray-200 text-gray-500 text-sm font-display font-medium hover:text-royal transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-3 bg-habanero text-white text-sm font-display font-medium hover:opacity-90 transition-colors"
              >
                Show {filteredProducts.length} results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER DROPDOWN (desktop)
───────────────────────────────────────────── */
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-5 py-4 text-xs font-mono tracking-widest uppercase transition-colors h-full ${
          value ? "text-habanero" : "text-gray-500 hover:text-royal"
        }`}
      >
        {value || label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-0 min-w-[180px] bg-gray-50 border border-gray-200 shadow-xl z-50">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors ${
              !value ? "text-habanero" : "text-gray-500 hover:text-royal"
            }`}
          >
            All {label}s
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors border-t border-gray-200 ${
                value === opt ? "text-habanero bg-white" : "text-gray-500 hover:text-royal"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER GROUP (mobile drawer)
───────────────────────────────────────────── */
function FilterGroup({ label, options, active, onSelect }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-4">
        {label}
      </p>
      <div className="space-y-px">
        <button
          onClick={() => onSelect("")}
          className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm font-display font-medium transition-colors min-h-[44px] ${
            !active
              ? "bg-white text-royal border border-habanero"
              : "border border-gray-200 text-gray-500 hover:text-royal"
          }`}
        >
          All {label}s
          {!active && <Check size={13} className="text-habanero" />}
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(active === opt ? "" : opt)}
            className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm font-display font-medium transition-colors min-h-[44px] ${
              active === opt
                ? "bg-white text-royal border border-habanero"
                : "border border-gray-200 text-gray-500 hover:text-royal"
            }`}
          >
            {opt}
            {active === opt && <Check size={13} className="text-habanero" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function CatalogueCard({ product, idx }) {
  const outOfStock = product.stock === 0;
  const hasPrice = product.price !== null && product.price !== undefined && String(product.price).trim() !== "";

  return (
    <article className="group h-full overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white shadow-[0_10px_35px_-28px_rgba(8,24,59,.5)] transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_24px_50px_-28px_rgba(8,24,59,.38)]">
      <Link to={`/store/product/${product.id}`} className="flex h-full flex-col" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#f5f7fb] via-white to-[#e8edf7]">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.06] sm:p-7" loading={idx < 8 ? "eager" : "lazy"} /> : <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_70%_30%,rgba(249,133,19,.12),transparent_38%),linear-gradient(135deg,#f5f7fb,#e8edf8)] text-royal/30"><Package size={42} strokeWidth={1.1} /><span className="mt-3 font-mono text-[8px] uppercase tracking-[0.17em]">Image unavailable</span></div>}
          <span className="absolute left-4 top-4 max-w-[72%] truncate rounded-full border border-white/70 bg-white/90 px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-royal shadow-sm">{product.category || product.brand || "Jainam Auto"}</span>
          {outOfStock && <span className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-white">Out of stock</span>}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-soft/70">{product.brand || "Jainam Auto Industries"}</p>
          <h2 className="mt-1.5 line-clamp-2 min-h-[2.8rem] font-display text-sm font-semibold leading-snug text-royal transition-colors group-hover:text-habanero sm:text-base">{product.name}</h2>
          {(product.productCode || product.size) && <div className="mt-2 flex flex-wrap gap-2">{product.productCode && <span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[9px] text-ink-soft">{product.productCode}</span>}{product.size && <span className="rounded-md bg-slate-50 px-2 py-1 text-[9px] text-ink-soft">Size: {product.size}</span>}</div>}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <span className={`text-sm font-bold ${hasPrice ? "text-royal" : "text-habanero"}`}>{hasPrice ? `₹${Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : "Request a quote"}</span>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-habanero">Details <ArrowRight size={12} /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─────────────────────────────────────────────
   SKELETON GRID
───────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-white border border-tan/60 flex flex-col">
          <div className="h-8 bg-tan/30 animate-pulse" />
          <div className="aspect-square bg-tan/20 animate-pulse" />
          <div className="border-t border-tan/60 px-4 py-4 space-y-2">
            <div className="h-3.5 bg-tan/30 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-tan/30 rounded animate-pulse w-1/2 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ search, hasFilter, onClear }) {
  return (
    <div className="border border-gray-200 bg-gray-50 py-24 flex flex-col items-center gap-5 text-center px-6">
      <div className="w-14 h-14 border border-gray-200 flex items-center justify-center">
        <Package size={24} className="text-gray-500" strokeWidth={1} />
      </div>
      <div>
        <p className="font-display font-600 text-base text-royal mb-1">
          {search ? `No results for "${search}"` : "No products found"}
        </p>
        <p className="font-mono text-[11px] tracking-widest text-gray-500 uppercase">
          {hasFilter ? "Try adjusting your filters" : "Check back soon"}
        </p>
      </div>
      {(search || hasFilter) && (
        <button
          onClick={onClear}
          className="px-5 py-2.5 border border-gray-200 text-gray-500 text-xs font-mono tracking-widest uppercase hover:text-royal hover:border-royal transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
