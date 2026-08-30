import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag, Layers, ShieldCheck, Truck, Headphones, Award,
  Package, ShoppingCart, ArrowRight, Check,
} from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import { brandAPI, categoryAPI, productAPI } from "../services/api";
import { useCart } from "../services/cartContext";

export default function StoreHome() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const [brandsRes, categoriesRes, productsRes] = await Promise.all([
          brandAPI.getAll(),
          categoryAPI.getAll(),
          productAPI.getAll(),
        ]);
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
        setProducts((productsRes.data || []).filter((p) => p.active !== false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const featuredProducts = products.slice(0, 8);

  const SectionLabel = ({ children }) => (
    <p className="font-mono text-[11px] tracking-widest text-ink-muted uppercase mb-3">
      {children}
    </p>
  );

  const SectionHeading = ({ children }) => (
    <h2 className="font-display font-600 text-2xl sm:text-3xl text-ink leading-tight">
      {children}
    </h2>
  );

  const ProductSkeleton = () => (
    <div className="bg-surface border border-hairline rounded overflow-hidden">
      <div className="w-full aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-8 skeleton rounded mt-3" />
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <HeroSlider />

      {/* ── Brand marquee ── */}
      {!loading && brands.length > 0 && (
        <section className="bg-surface py-8 border-b border-hairline">
          <p className="text-center font-mono text-[10px] tracking-widest text-ink-muted uppercase mb-6">
            Compatible OEM Vehicle Brands
          </p>
          <div className="brand-marquee">
            <div className="brand-marquee-track">
              {[...brands, ...brands].map((brand, i) => (
                <div
                  key={`${brand.id}-${i}`}
                  className="flex items-center justify-center shrink-0 w-40 sm:w-48 px-6"
                >
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-h-10 sm:max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <span className="font-mono text-xs text-ink-muted">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Brand ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionLabel>Browse</SectionLabel>
        <div className="flex items-end justify-between mb-8">
          <SectionHeading>Shop by Brand</SectionHeading>
          <Link
            to="/store/catalogue"
            className="hidden sm:flex items-center gap-1 text-sm font-display font-medium text-secondary hover:text-orange-600 transition-colors"
          >
            All products <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <p className="text-ink-muted text-sm">No brands available yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/store/catalogue?brand=${encodeURIComponent(brand.name)}`}
                className="bg-surface border border-hairline rounded overflow-hidden flex flex-col items-center hover-lift group"
              >
                <div className="w-full aspect-square bg-accent flex items-center justify-center overflow-hidden p-3">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Tag size={22} className="text-ink-muted" />
                  )}
                </div>
                <span className="text-xs font-display font-medium text-ink text-center py-2.5 px-2 leading-tight group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Shop by Category ── */}
      <section className="bg-accent/50 border-y border-hairline py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionLabel>Categories</SectionLabel>
          <div className="flex items-end justify-between mb-8">
            <SectionHeading>Shop by Category</SectionHeading>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 skeleton rounded" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-ink-muted text-sm">No categories available yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/store/catalogue?category=${encodeURIComponent(cat.name)}`}
                  className="bg-surface border border-hairline rounded px-4 py-5 flex items-center gap-3 hover-lift group"
                >
                  <div className="w-8 h-8 rounded bg-accent flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-primary" />
                  </div>
                  <span className="font-display font-medium text-sm text-ink group-hover:text-primary transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionLabel>In Stock Now</SectionLabel>
        <div className="flex items-end justify-between mb-8">
          <SectionHeading>Our Products</SectionHeading>
          <Link
            to="/store/catalogue"
            className="hidden sm:flex items-center gap-1 text-sm font-display font-medium text-secondary hover:text-orange-600 transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-ink-muted text-sm py-8">No products available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addedId={addedId}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/store/catalogue"
                className="inline-flex items-center gap-1.5 text-sm font-display font-medium text-secondary"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Trust strip ── */}
      <section className="border-t border-hairline bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: "Trusted Quality" },
            { icon: Truck,       label: "Reliable Supply" },
            { icon: Headphones,  label: "Dedicated Support" },
            { icon: Award,       label: "Trusted Brands" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded bg-accent flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="font-display font-medium text-sm text-ink">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About blurb ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SectionLabel>About Jainam</SectionLabel>
        <h2 className="font-display font-600 text-2xl sm:text-3xl text-ink mb-4">
          A supplier you can rely on
        </h2>
        <p className="text-ink-muted leading-relaxed mb-6">
          Jainam has been a dependable supplier of pipes, valves, fittings and related hardware for
          businesses across the region. Every client is paired with a dedicated account manager who
          handles orders, pricing, and invoicing personally.
        </p>
        <Link
          to="/store/about"
          className="inline-flex items-center gap-1.5 text-sm font-display font-medium text-secondary hover:text-orange-600 transition-colors"
        >
          Learn more <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}

function ProductCard({ product, addedId, onAdd }) {
  const added = addedId === product.id;
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
          <div className="flex flex-col items-center text-ink-muted opacity-30">
            <Package size={26} />
          </div>
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
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="font-display font-medium text-sm text-ink truncate leading-tight">
          {product.name}
        </p>
        <p className="font-mono text-[10px] text-ink-muted">{product.brand || product.category}</p>
        <p className="font-mono font-600 text-sm text-ink mt-auto pt-1">
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
