import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Menu, X, LogOut,
  Plus, Minus, Trash2, Phone, Mail, MapPin,
  CheckCircle, Package, ArrowRight,
} from "lucide-react";
import { useCart } from "../services/cartContext";
import { orderAPI } from "../services/api";

export default function StorefrontLayout({ children, user, onLogout }) {
  /* ── All state & logic — UNCHANGED ── */
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [placing,     setPlacing]     = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError,  setOrderError]  = useState("");
  const [scrolled,    setScrolled]    = useState(false);
  const navigate = useNavigate();

  const { items, updateQuantity, removeItem, clearCart, totalItems, totalValue } = useCart();

  const navLinks = [
    { to: "/store",           label: "Home",       end: true },
    { to: "/store/catalogue", label: "Catalogue" },
    { to: "/store/about",     label: "About" },
    { to: "/store/contact",   label: "Contact Us" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setMenuOpen(false); setCartOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, cartOpen]);

  /* handlePlaceOrder — UNCHANGED */
  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    setOrderError("");
    try {
      await orderAPI.create({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        notes: "",
      });
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setOrderError(err?.response?.data || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 bg-royal transition-all duration-200 ${
          scrolled ? "shadow-lg shadow-navy/20" : ""
        }`}
      >
        {/* Coral rule along the top edge — small structural accent */}
        <div className="h-[3px] bg-habanero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link
            to="/store"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="font-display font-600 text-lg sm:text-xl text-white tracking-tight">
              Jainam
            </span>
            {user?.company && (
              <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-white/50 uppercase border-l border-white/20 pl-3">
                {user.company}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors border-b-2 ${
                    isActive
                      ? "text-habanero border-habanero"
                      : "text-white/60 hover:text-white border-transparent"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Cart trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] text-white/70 hover:text-white transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 ? (
                <span className="font-mono text-[11px] tracking-widest text-habanero">
                  {totalItems}
                </span>
              ) : (
                <span className="hidden sm:inline font-mono text-[11px] tracking-widest uppercase">
                  Cart
                </span>
              )}
            </button>

            {/* Logout (desktop) */}
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 min-h-[44px] font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden flex items-center justify-center p-2.5 min-w-[44px] min-h-[44px] text-white/70 hover:text-white transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          MOBILE NAV DRAWER
      ══════════════════════════════════════ */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 left-0 z-50 h-full w-[85vw] max-w-xs bg-gray-50 border-r border-gray-200 flex flex-col nav-drawer-enter md:hidden">
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-200 shrink-0">
              <span className="font-display font-600 text-royal text-base">Jainam</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-royal transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-0 py-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-6 py-4 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors min-h-[52px] border-b border-gray-200 ${
                      isActive
                        ? "text-habanero"
                        : "text-gray-500 hover:text-royal"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-habanero" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="px-5 py-5 border-t border-gray-200 shrink-0 space-y-3">
              {user?.name && (
                <p className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">
                  {user.name}
                </p>
              )}
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2.5 font-mono text-[11px] tracking-widest uppercase text-gray-500 hover:text-royal transition-colors py-2 min-h-[44px]"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════════ */}
      <main className="flex-1">{children}</main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-royal text-white">
        <div className="h-[3px] bg-habanero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display font-600 text-base text-white mb-3">Jainam</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Trusted supplier of quality pipes, valves and fittings — built on decades of
              relationships with our clients.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-mono text-[11px] tracking-widest uppercase text-white/60 hover:text-habanero transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-center gap-2.5">
                <Phone size={12} className="shrink-0 text-habanero" />
                <a href="tel:+910000000000" className="font-mono text-[11px] tracking-wide hover:text-habanero transition-colors">
                  +91 00000 00000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={12} className="shrink-0 text-habanero" />
                <a href="mailto:sales@jainam.example" className="font-mono text-[11px] tracking-wide hover:text-habanero transition-colors">
                  sales@jainam.example
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={12} className="shrink-0 text-habanero mt-0.5" />
                <span className="font-mono text-[11px] tracking-wide">
                  Mumbai, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-5">
              Account
            </h4>
            {user?.name && (
              <p className="font-mono text-[11px] tracking-wide text-white/60">
                Signed in as{" "}
                <span className="text-white">{user.name}</span>
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-white/15 py-4 text-center">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
            © {new Date().getFullYear()} Jainam · All rights reserved
          </span>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          CART DRAWER
      ══════════════════════════════════════ */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 modal-backdrop"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-gray-50 w-full sm:w-[440px] h-full flex flex-col border-l border-gray-200 cart-drawer-enter">

            {/* ── Cart header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display font-600 text-royal text-base tracking-tight">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-500 hover:text-royal hover:border-navy transition-colors"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── ORDER PLACED STATE ── */}
            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mb-6">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <h3 className="font-display font-600 text-xl text-royal mb-3">
                  Order placed.
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs">
                  Your order has been sent to your account manager. They'll follow up with an
                  invoice shortly.
                </p>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    setCartOpen(false);
                    navigate("/store/catalogue");
                  }}
                  className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-gray-500 hover:text-royal border border-gray-200 px-5 py-3 hover:border-navy transition-colors"
                >
                  Continue Browsing <ArrowRight size={12} />
                </button>
              </div>

            ) : items.length === 0 ? (
              /* ── EMPTY STATE ── */
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mb-6">
                  <ShoppingCart size={20} className="text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="font-display font-600 text-base text-royal mb-2">
                  Your cart is empty.
                </p>
                <p className="font-mono text-[11px] tracking-widest uppercase text-gray-500 mb-10">
                  Explore the catalogue and find what you need.
                </p>
                <Link
                  to="/store/catalogue"
                  onClick={() => setCartOpen(false)}
                  className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-gray-500 hover:text-royal border border-gray-200 px-5 py-3 hover:border-navy transition-colors"
                >
                  Explore Catalogue <ArrowRight size={12} />
                </Link>
              </div>

            ) : (
              <>
                {/* ── LINE ITEMS ── */}
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {items.map(({ product, quantity }) => {
                      const linePrice = Number(product.price) * quantity;
                      return (
                        <div key={product.id} className="flex gap-4 px-6 py-5">

                          {/* Thumbnail */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <Package size={18} className="text-gray-500" strokeWidth={1} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            {/* Name + remove */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-display font-medium text-sm text-royal leading-snug line-clamp-2 flex-1">
                                {product.name}
                              </p> 
                              <button
                                onClick={() => removeItem(product.id)}
                                className="shrink-0 flex items-center justify-center w-7 h-7 text-gray-500 hover:text-red-400 transition-colors mt-0.5"
                                aria-label={`Remove ${product.name}`}
                              >
                                <X size={13} />
                              </button>
                            </div>

                            {/* Unit price */}
                            <p className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">
                              ₹{Number(product.price).toFixed(2)} / unit
                            </p>

                            {/* Qty + line total */}
                            <div className="flex items-center justify-between mt-1">
                              {/* Quantity stepper */}
                              <div className="flex items-center border border-gray-200">
                                <button
                                  onClick={() => updateQuantity(product.id, quantity - 1)}
                                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-royal hover:bg-white transition-colors"
                                  aria-label={`Decrease ${product.name} quantity`}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-9 h-9 flex items-center justify-center font-mono text-xs text-royal border-x border-gray-200 select-none">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(product.id, quantity + 1)}
                                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-royal hover:bg-white transition-colors"
                                  aria-label={`Increase ${product.name} quantity`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Line price */}
                              <p className="font-mono font-600 text-sm text-royal">
                                ₹{linePrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── CART FOOTER ── */}
                <div className="border-t border-white/15 bg-royal shrink-0">
                  {/* Error */}
                  {orderError && (
                    <div className="px-6 pt-4">
                      <p className="text-xs font-mono text-red-300 bg-red-950/40 border border-red-900/60 px-3 py-2.5">
                        {orderError}
                      </p>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="px-6 py-5 flex items-baseline justify-between border-b border-white/15">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                      Subtotal
                    </span>
                    <span className="font-mono font-600 text-xl text-white">
                      ₹{totalValue.toFixed(2)}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="px-6 py-5 space-y-3">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="w-full flex items-center justify-center gap-2.5 bg-habanero text-white font-display font-600 text-sm py-4 hover:bg-white hover:text-royal transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
                    >
                      {placing ? (
                        <span className="font-mono text-xs tracking-widest uppercase">
                          Placing Order…
                        </span>
                      ) : (
                        <>
                          Place Order
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <p className="font-mono text-[10px] tracking-widest text-white/50 text-center uppercase leading-relaxed">
                      Your account manager confirms pricing and generates the invoice.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
