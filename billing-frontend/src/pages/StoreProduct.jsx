import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Package } from "lucide-react";
import { productAPI } from "../services/api";
import { useCart } from "../services/cartContext";

export default function StoreProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    productAPI
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-tan/40 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-tan/60 animate-pulse" />
            <div className="h-10 w-2/3 bg-tan/60 animate-pulse" />
            <div className="h-4 w-full bg-tan/40 animate-pulse" />
            <div className="h-4 w-1/3 bg-tan/40 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-24 text-center">
        <Package size={40} strokeWidth={1} className="mx-auto text-royal/20 mb-6" />
        <p className="font-display font-600 text-lg text-royal mb-2">Product not found</p>
        <p className="text-ink-soft text-sm mb-8">
          This product may no longer be available.
        </p>
        <Link
          to="/store/catalogue"
          className="inline-flex items-center gap-2 bg-royal text-white font-display font-medium text-sm px-6 py-3 hover:bg-habanero transition-colors"
        >
          <ArrowLeft size={15} /> Back to Catalogue
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-ink-soft hover:text-royal transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image */}
          <div className="relative aspect-square bg-tan/30 border border-line flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-10"
              />
            ) : (
              <Package size={64} strokeWidth={1} className="text-royal/20" />
            )}
            {outOfStock && (
              <div className="absolute inset-0 bg-royal/70 flex items-center justify-center">
                <span className="font-mono text-xs tracking-[0.2em] text-white uppercase">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {(product.brand || product.category) && (
              <p className="font-mono text-[11px] tracking-[0.2em] text-habanero uppercase mb-3">
                {product.brand || product.category}
              </p>
            )}
            <h1 className="font-display font-600 text-display-md text-royal leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-mono font-600 text-2xl text-habanero mb-6">
              ₹{Number(product.price).toFixed(2)}
            </p>

            {product.description && (
              <p className="text-ink-soft text-base leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Spec lines */}
            <div className="border-t border-line divide-y divide-line mb-8">
              {product.brand && (
                <div className="flex items-center justify-between py-3">
                  <span className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Brand</span>
                  <span className="text-sm text-royal">{product.brand}</span>
                </div>
              )}
              {product.category && (
                <div className="flex items-center justify-between py-3">
                  <span className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Category</span>
                  <span className="text-sm text-royal">{product.category}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-3">
                <span className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">Availability</span>
                <span className={`text-sm ${outOfStock ? "text-red-600" : "text-royal"}`}>
                  {outOfStock ? "Out of stock" : "In stock"}
                </span>
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-line">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-royal hover:bg-tan/40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono text-sm text-royal">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-11 flex items-center justify-center text-royal hover:bg-tan/40 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 font-display font-medium text-sm py-3.5 transition-colors min-h-[44px] ${
                  outOfStock
                    ? "bg-tan text-ink-soft cursor-not-allowed"
                    : added
                    ? "bg-green-700 text-white"
                    : "bg-royal text-white hover:bg-habanero"
                }`}
              > 
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
