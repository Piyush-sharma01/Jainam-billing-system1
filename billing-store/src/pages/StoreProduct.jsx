import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronRight, MessageCircle, Package, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { productAPI } from "../services/api";
import { useCart } from "../services/cartContext";

const WHATSAPP = "919422308740";

export default function StoreProduct() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setProduct(null);
    productAPI.getById(id)
      .then((response) => {
        if (active && response.data && response.data.active !== false) setProduct(response.data);
        else if (active) setError(true);
      })
      .catch(async () => {
        try {
          const response = await productAPI.getAll();
          const match = (response.data || []).find((item) => String(item.id) === String(id) && item.active !== false);
          if (active && match) setProduct(match);
          else if (active) setError(true);
        } catch {
          if (active) setError(true);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const whatsappHref = useMemo(() => {
    if (!product) return `https://wa.me/${WHATSAPP}`;
    const lines = [
      "Hello Jainam Auto Industries, I would like a quote for:",
      `Product: ${product.name}`,
      product.productCode ? `Code: ${product.productCode}` : "",
      product.size ? `Size: ${product.size}` : "",
      `Quantity: ${quantity}`,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [product, quantity]);

  const handleAddToEnquiry = () => {
    addItem(product, Math.max(1, quantity));
    setAdded(true);
  };

  if (loading) return <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="grid animate-pulse gap-8 lg:grid-cols-2"><div className="aspect-square rounded-3xl bg-paper" /><div className="space-y-5 py-8"><div className="h-4 w-28 rounded bg-paper" /><div className="h-12 w-3/4 rounded bg-paper" /><div className="h-5 w-full rounded bg-paper" /><div className="h-12 w-40 rounded bg-paper" /></div></div></div>;

  if (error || !product) return <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-paper text-royal"><Package size={28} /></div><h1 className="mt-6 font-display text-3xl font-semibold text-royal">Product not found</h1><p className="mt-3 text-sm text-ink-soft">This item may no longer be available in the catalogue.</p><Link to="/store/catalogue" className="mt-7 inline-flex items-center gap-2 rounded-full bg-habanero px-6 py-3 text-sm font-semibold text-white">Back to catalogue <ArrowRight size={15} /></Link></section>;

  const hasPrice = product.price !== null && product.price !== undefined && String(product.price).trim() !== "";
  const inStock = product.stock !== null && product.stock !== undefined && Number(product.stock) > 0;

  return (
    <div className="page-enter bg-white">
      <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <Link to="/store" className="hover:text-habanero">Home</Link><ChevronRight size={13} />
          <Link to="/store/catalogue" className="hover:text-habanero">Catalogue</Link><ChevronRight size={13} />
          <span className="max-w-[220px] truncate text-royal">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-9 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-paper via-white to-[#e9ecf6]">
          <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-royal shadow-sm"><BadgeCheck size={13} className="text-habanero" /> Catalogue item</div>
          <div className="flex aspect-square items-center justify-center p-8 sm:p-12">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(34,51,130,0.16)]" /> : <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-royal/20 bg-white/50 text-royal/30"><Package size={64} strokeWidth={1} /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">Image not available</span></div>}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-royal/5 to-transparent" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">{product.brand || "Jainam Auto Industries"}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-royal sm:text-4xl lg:text-5xl">{product.name}</h1>
          {product.description && <p className="mt-5 text-sm leading-7 text-ink-soft sm:text-base">{product.description}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            {product.category && <span className="rounded-full bg-paper px-3.5 py-2 text-xs font-medium text-royal">{product.category}</span>}
            {product.size && <span className="rounded-full bg-paper px-3.5 py-2 text-xs font-medium text-royal">Size: {product.size}</span>}
            {product.productCode && <span className="rounded-full bg-paper px-3.5 py-2 font-mono text-xs text-royal">Code: {product.productCode}</span>}
          </div>

          <div className="mt-8 border-y border-line py-5">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-soft/60">Price</p>
            <p className="mt-1 font-display text-2xl font-semibold text-royal">{hasPrice ? `₹${Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Request a quote"}</p>
            {!hasPrice && <p className="mt-1 text-xs text-ink-soft">Ask our team for current pricing and availability.</p>}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {product.stock !== null && product.stock !== undefined && <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-amber-500"}`} />{inStock ? `${product.stock} available` : "Check availability"}</span>}
            {product.gst !== null && product.gst !== undefined && <span className="text-xs text-ink-soft">GST {product.gst}%</span>}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <label htmlFor="quantity" className="sr-only">Quantity</label>
            <input id="quantity" type="number" min="1" max="999" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(999, Number(event.target.value) || 1)))} className="h-12 w-20 rounded-xl border border-line px-3 text-center text-sm font-semibold text-royal outline-none focus:border-royal" />
            <button onClick={handleAddToEnquiry} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-royal px-4 text-sm font-semibold text-royal transition-colors hover:bg-paper sm:flex-none sm:px-6"><ShoppingBag size={16} />Add to enquiry</button>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-habanero px-4 text-sm font-semibold text-white transition-colors hover:bg-royal sm:flex-none sm:px-6"><MessageCircle size={16} />Request quote</a>
          </div>

          {added && <div role="status" className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span className="inline-flex items-center gap-2"><Check size={15} />Added to your enquiry list.</span><a href={whatsappHref} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Send on WhatsApp</a></div>}

          <div className="mt-9 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3"><ShieldCheck size={17} className="mt-0.5 text-habanero" /><span><strong className="block text-xs text-royal">Quality-led range</strong><small className="mt-1 block text-[11px] leading-5 text-ink-soft">ISO 9001:2015 quality management system.</small></span></div>
            <div className="flex items-start gap-3"><Truck size={17} className="mt-0.5 text-habanero" /><span><strong className="block text-xs text-royal">Pan-India network</strong><small className="mt-1 block text-[11px] leading-5 text-ink-soft">Contact Jainam for dealer and delivery information.</small></span></div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link to="/store/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:text-habanero"><ArrowLeft size={15} /> Back to all products</Link>
          <span className="text-xs text-ink-soft">Need help matching a vehicle specification? Contact the Jainam team.</span>
        </div>
      </section>
    </div>
  );
}
