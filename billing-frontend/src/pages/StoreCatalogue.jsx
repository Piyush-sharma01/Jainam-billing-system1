import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Package, X, SlidersHorizontal, Check, ChevronDown } from "lucide-react";
import { productAPI, brandAPI, categoryAPI } from "../services/api";
import { useCart } from "../services/cartContext";

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
  const [addedId,    setAddedId]    = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef(null);

  const activeBrand    = searchParams.get("brand")    || "";
  const activeCategory = searchParams.get("category") || "";

  const { addItem } = useCart();

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

  /* ── Cart — unchanged ── */
  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

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
    <div className="bg-white min-h-screen text-navy">

      {/* ══════════════════════════════════════
          CATALOGUE HEADER
      ══════════════════════════════════════ */}
      <header className="bg-navy relative overflow-hidden">
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Coral structural block, bottom-right — asymmetric accent */}
        <div className="hidden sm:block absolute -right-10 -bottom-16 w-64 h-64 bg-coral/90 rotate-12" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-10 sm:pt-16 sm:pb-14">
          {/* Breadcrumb */}
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-6 flex items-center gap-2">
            <span>Jainam</span>
            <span className="opacity-30">/</span>
            <span className="text-coral">Products</span>
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-px bg-coral" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-coral uppercase">
                  Full Range
                </span>
              </div>
              <h1 className="font-display font-600 text-display-lg text-white leading-none">
                Catalogue
              </h1>
              <p className="text-white/60 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
                Pipes, valves, fittings and industrial hardware — sourced from trusted brands,
                stocked for consistent availability.
              </p>
            </div>

            {/* Live count */}
            {!loading && (
              <div className="relative shrink-0 border border-white/20 bg-navy px-5 py-3 text-right">
                <p className="font-mono font-600 text-2xl text-white">
                  {filteredProducts.length}
                </p>
                <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
                  {hasActiveFilter ? "Filtered" : "Products"}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          FILTER + SEARCH BAR
      ══════════════════════════════════════ */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white border-b border-gray-200">
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
                className="w-full bg-transparent pl-10 pr-4 py-4 text-sm text-navy placeholder:text-gray-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="absolute right-3 text-gray-500 hover:text-navy transition-colors"
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
                className="px-5 text-xs font-mono tracking-widest text-gray-500 hover:text-coral transition-colors uppercase flex items-center gap-2 shrink-0"
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
                className="w-full bg-transparent pl-9 pr-3 py-3.5 text-sm text-navy placeholder:text-gray-500 focus:outline-none"
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
                <span className="w-4 h-4 rounded-full bg-coral text-white text-[9px] font-mono flex items-center justify-center leading-none">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
            {filteredProducts.map((product, idx) => (
              <CatalogueCard
                key={product.id}
                product={product}
                addedId={addedId}
                onAdd={handleAddToCart}
                idx={idx}
              />
            ))}
          </div>
        )}
      </main>

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
              <span className="font-mono text-[11px] tracking-widest text-navy uppercase">
                Filters
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-500 hover:text-navy transition-colors"
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
                className="flex-1 py-3 border border-gray-200 text-gray-500 text-sm font-display font-medium hover:text-navy transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-3 bg-coral text-white text-sm font-display font-medium hover:opacity-90 transition-colors"
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
          value ? "text-coral" : "text-gray-500 hover:text-navy"
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
              !value ? "text-coral" : "text-gray-500 hover:text-navy"
            }`}
          >
            All {label}s
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors border-t border-gray-200 ${
                value === opt ? "text-coral bg-white" : "text-gray-500 hover:text-navy"
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
              ? "bg-white text-navy border border-coral"
              : "border border-gray-200 text-gray-500 hover:text-navy"
          }`}
        >
          All {label}s
          {!active && <Check size={13} className="text-coral" />}
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(active === opt ? "" : opt)}
            className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm font-display font-medium transition-colors min-h-[44px] ${
              active === opt
                ? "bg-white text-navy border border-coral"
                : "border border-gray-200 text-gray-500 hover:text-navy"
            }`}
          >
            {opt}
            {active === opt && <Check size={13} className="text-coral" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function CatalogueCard({ product, addedId, onAdd, idx }) {
  const added      = addedId === product.id;
  const outOfStock = product.stock === 0;

  return (
    <div className="bg-white group flex flex-col">
      {/* Image area — links to product detail */}
      <Link
        to={`/store/product/${product.id}`}
        className="relative overflow-hidden aspect-square bg-gray-50 flex items-center justify-center block"
        tabIndex={-1}
        aria-label={`View ${product.name}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-[1.04]"
            loading={idx < 8 ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-200">
            <Package size={32} strokeWidth={1} />
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-navy/70 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-white uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick-add: icon button pinned to bottom-right, appears on hover */}
        <button
          onClick={(e) => { e.preventDefault(); if (!outOfStock) onAdd(product); }}
          disabled={outOfStock}
          aria-label={`Add ${product.name} to cart`}
          className={`absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center border transition-all duration-200 ${
            outOfStock
              ? "opacity-0 cursor-not-allowed"
              : added
              ? "bg-green-700 border-green-700 text-white opacity-100"
              : "bg-white border-gray-200 text-gray-500 hover:border-coral hover:text-coral opacity-0 group-hover:opacity-100"
          }`}
        >
          {added ? <Check size={12} /> : <ShoppingCart size={12} />}
        </button>
      </Link>

      {/* Info strip */}
      <div className="border-t border-gray-200 flex items-end justify-between gap-3 px-3 sm:px-4 py-3 sm:py-4">
        <div className="min-w-0 flex-1">
          {/* Brand / category metadata */}
          {(product.brand || product.category) && (
            <p className="font-mono text-[9px] sm:text-[10px] tracking-widest text-gray-500 uppercase mb-1 truncate">
              {product.brand || product.category}
            </p>
          )}
          <Link
            to={`/store/product/${product.id}`}
            className="font-display font-medium text-xs sm:text-sm text-navy leading-snug line-clamp-2 hover:text-coral transition-colors"
          >
            {product.name}
          </Link>
          <p className="font-mono font-600 text-sm sm:text-base text-coral mt-1.5">
            ₹{Number(product.price).toFixed(2)}
          </p>
        </div>

        {/* Add to cart — full button on mobile (hover-reveal too small for touch) */}
        <button
          onClick={() => !outOfStock && onAdd(product)}
          disabled={outOfStock}
          aria-label={`Add ${product.name} to cart`}
          className={`sm:hidden shrink-0 w-9 h-9 flex items-center justify-center border transition-colors ${
            outOfStock
              ? "border-gray-200 text-gray-500 cursor-not-allowed opacity-40"
              : added
              ? "bg-green-700 border-green-700 text-white"
              : "border-gray-200 text-gray-500 hover:border-coral hover:text-coral"
          }`}
        >
          {added ? <Check size={13} /> : <ShoppingCart size={13} />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON GRID
───────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-white flex flex-col">
          <div className="aspect-square bg-gray-50 animate-pulse" />
          <div className="border-t border-gray-200 px-4 py-4 space-y-2">
            <div className="h-2.5 bg-gray-50 rounded animate-pulse w-1/3" />
            <div className="h-3.5 bg-gray-50 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-50 rounded animate-pulse w-1/2 mt-1" />
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
        <p className="font-display font-600 text-base text-navy mb-1">
          {search ? `No results for "${search}"` : "No products found"}
        </p>
        <p className="font-mono text-[11px] tracking-widest text-gray-500 uppercase">
          {hasFilter ? "Try adjusting your filters" : "Check back soon"}
        </p>
      </div>
      {(search || hasFilter) && (
        <button
          onClick={onClear}
          className="px-5 py-2.5 border border-gray-200 text-gray-500 text-xs font-mono tracking-widest uppercase hover:text-navy hover:border-navy transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
