import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Package, X, SlidersHorizontal, Check } from "lucide-react";
import { productAPI, brandAPI, categoryAPI } from "../services/api";
import { useCart } from "../services/cartContext";

export default function StoreCatalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeBrand    = searchParams.get("brand") || "";
  const activeCategory = searchParams.get("category") || "";

  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          brandAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts((productsRes.data || []).filter((p) => p.active !== false));
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const hasActiveFilter = activeBrand || activeCategory;

  const FilterChip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-xs font-display font-medium transition-colors min-h-[36px] ${
        active
          ? "bg-primary text-white border-primary"
          : "text-ink-muted border-hairline hover:border-ink-muted hover:text-ink bg-surface"
      }`}
    >
      {label}
    </button>
  );

  const SkeletonCard = () => (
    <div className="bg-surface border border-hairline rounded overflow-hidden">
      <div className="w-full aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-8 skeleton rounded mt-2" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* ── Page header ── */}
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-widest text-ink-muted uppercase mb-1">
          Products
        </p>
        <h1 className="font-display font-600 text-2xl sm:text-3xl text-ink">Catalogue</h1>
        <p className="text-ink-muted text-sm mt-1">
          Browse our full range and add items to your cart
        </p>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or description…"
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-hairline rounded text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink-muted focus:ring-1 focus:ring-ink-muted/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Filter row (desktop inline / mobile toggle) ── */}
      <div className="mb-6">
        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center gap-2 text-sm font-display font-medium text-ink mb-3 px-3 py-2 border border-hairline rounded bg-surface hover:bg-accent transition-colors min-h-[44px]"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilter && (
            <span className="ml-1 w-4 h-4 rounded-full bg-secondary text-white text-[9px] font-mono flex items-center justify-center">
              {[activeBrand, activeCategory].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Filters — always visible md+, toggle on mobile */}
        <div className={`${filterOpen ? "block" : "hidden"} md:block space-y-4`}>
          {brands.length > 0 && (
            <div>
              <p className="font-mono text-[10px] tracking-widest text-ink-muted uppercase mb-2">
                Brand
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!activeBrand}
                  onClick={() => setFilter("brand", "")}
                />
                {brands.map((b) => (
                  <FilterChip
                    key={b.id}
                    label={b.name}
                    active={activeBrand === b.name}
                    onClick={() => setFilter("brand", b.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div>
              <p className="font-mono text-[10px] tracking-widest text-ink-muted uppercase mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!activeCategory}
                  onClick={() => setFilter("category", "")}
                />
                {categories.map((c) => (
                  <FilterChip
                    key={c.id}
                    label={c.name}
                    active={activeCategory === c.name}
                    onClick={() => setFilter("category", c.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {hasActiveFilter && (
            <button
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1.5 text-xs text-secondary hover:text-orange-600 font-medium"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Results label ── */}
      {!loading && (
        <p className="font-mono text-[10px] tracking-widest text-ink-muted uppercase mb-4">
          {search.trim()
            ? `Results for "${search}" — ${filteredProducts.length} found`
            : hasActiveFilter
            ? `Filtered — ${filteredProducts.length} products`
            : `All products — ${filteredProducts.length}`}
        </p>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-ink-muted border border-hairline rounded bg-surface">
          <Package size={32} className="mx-auto mb-3 opacity-20" />
          <p className="font-display font-medium text-sm">No products found</p>
          <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <CatalogueCard
              key={product.id}
              product={product}
              addedId={addedId}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogueCard({ product, addedId, onAdd }) {
  const added      = addedId === product.id;
  const outOfStock = product.stock === 0;

  return (
    <div className="bg-surface border border-hairline rounded overflow-hidden hover-lift group flex flex-col">
      {/* Image */}
      <div className="w-full aspect-square bg-accent flex items-center justify-center overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Package size={26} className="text-ink-muted opacity-20" />
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="font-display font-medium text-sm text-ink truncate leading-tight">
          {product.name}
        </p>
        <p className="font-mono text-[10px] text-ink-muted mt-0.5">
          {product.brand || product.category || ""}
        </p>
        <p className="font-mono font-600 text-sm text-ink mt-auto pt-2">
          ₹{Number(product.price).toFixed(2)}
        </p>

        <button
          onClick={() => !outOfStock && onAdd(product)}
          disabled={outOfStock}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-display font-medium py-2 rounded transition-colors min-h-[36px] ${
            outOfStock
              ? "bg-accent text-ink-muted cursor-not-allowed"
              : added
              ? "bg-green-600 text-white"
              : "bg-secondary text-white hover:bg-orange-600"
          }`}
        >
          {outOfStock ? "Out of Stock" : added ? (
            <><Check size={13} /> Added</>
          ) : (
            <><ShoppingCart size={13} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
