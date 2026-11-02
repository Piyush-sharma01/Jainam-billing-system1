import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { productAPI } from "../services/api";
import { orderMessage, whatsappLink } from "../config";
import SafeImage from "../components/SafeImage";

const SHOW = 30;

// "New arrivals" = the most recently added products (highest id first).
export default function StoreNewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    productAPI.getAll()
      .then((response) => {
        if (!active) return;
        const list = (response.data || [])
          .filter((p) => p.active !== false)
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, SHOW);
        setProducts(list);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div className="page-enter bg-white">
      <section className="relative overflow-hidden bg-royal text-white">
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">Just added</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">New arrivals</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">The latest products added to the Jainam catalogue.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-paper" />)}</div>
        ) : error ? (
          <p className="py-16 text-center text-sm text-ink-soft">Could not load products right now. Please try again in a moment.</p>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-soft">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((product, index) => (
              <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-royal/10">
                <Link to={`/store/product/${product.id}`} className="relative block aspect-square bg-gradient-to-br from-paper to-white">
                  {index < 8 && <span className="absolute left-3 top-3 z-10 rounded-full bg-habanero px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">New</span>}
                  {product.imageUrl
                    ? <SafeImage sources={[product.imageUrl]} alt={product.name || "Product"} loading={index < 8 ? "eager" : "lazy"} className="h-full w-full object-contain p-5" />
                    : <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-royal/25"><Package size={40} strokeWidth={1} /><span className="font-mono text-[9px] uppercase tracking-[0.18em]">No image</span></div>}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  {product.category && <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-habanero">{product.category}</p>}
                  <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-royal">{product.name || "Unnamed product"}</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {[product.productCode && `Code ${product.productCode}`, product.size && `Size ${product.size}`].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <Link to={`/store/product/${product.id}`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-royal hover:bg-paper">View <ArrowRight size={13} /></Link>
                    <a href={whatsappLink(orderMessage(product, 1, "order"))} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-habanero px-3 py-2 text-xs font-semibold text-white hover:bg-royal"><ShoppingBag size={13} />Order now</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
