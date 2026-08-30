import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useCart } from "../services/cartContext";
import { orderAPI } from "../services/api";

export default function StorefrontLayout({ children, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  const { items, updateQuantity, removeItem, clearCart, totalItems, totalValue } = useCart();

  // Mobile nav drawer: close on Escape and lock body scroll while open —
  // same UX contract as a modal, no extra dependency needed.
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const navLinks = [
    { to: "/store", label: "Home", end: true },
    { to: "/store/catalogue", label: "Catalogue" },
    { to: "/store/about", label: "About" },
    { to: "/store/contact", label: "Contact Us" },
  ];

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
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/store" className="flex items-center gap-2 min-w-0">
            <span className="font-display text-xl font-semibold tracking-tight text-primary">
              Jainam
            </span>
            <span className="hidden sm:inline text-ink-muted text-sm truncate">
              {user?.company || "Storefront"}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "text-ink border-secondary"
                      : "text-ink-muted border-transparent hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-md hover:bg-accent transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="text-ink" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-white font-mono text-[11px] leading-none w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-md text-ink-muted hover:text-ink hover:bg-accent text-sm transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
            <button
              className="md:hidden p-2.5 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} className="text-ink" /> : <Menu size={22} className="text-ink" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[85%] max-w-xs bg-surface flex flex-col transform transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-hairline">
            <span className="font-display text-lg font-semibold text-primary">Jainam</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Close menu"
            >
              <X size={20} className="text-ink" />
            </button>
          </div>
          <nav className="flex-1 p-2 overflow-y-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-accent text-ink" : "text-ink-muted hover:bg-accent hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-2 border-t border-hairline">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-3.5 rounded-md text-ink-muted hover:bg-accent hover:text-ink text-sm font-medium transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-white/70 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-white font-semibold text-lg mb-3">Jainam</h3>
            <p className="text-sm">
              Trusted supplier of quality pipes, valves and fittings — built on decades of
              relationships with our clients.
            </p>
          </div>
          <div>
            <h4 className="font-display text-white font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/store" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/store/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/store/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/store/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-white font-medium mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> +91 00000 00000</li>
              <li className="flex items-center gap-2"><Mail size={14} /> sales@jainam.example</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Mumbai, Maharashtra, India</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-white font-medium mb-3">Your Account</h4>
            <p className="text-sm">
              Logged in as <span className="text-white">{user?.name}</span>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Jainam. All rights reserved.
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={22} />
              </button>
            </div>

            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Order placed!</h3>
                <p className="text-gray-500 mb-6">
                  Your order has been sent to your account manager. They'll follow up with an
                  invoice shortly.
                </p>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    setCartOpen(false);
                    navigate("/store/catalogue");
                  }}
                  className="btn-primary"
                >
                  Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                <ShoppingCart size={40} className="mb-3" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 border-b pb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">₹{Number(product.price).toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4 space-y-3">
                  {orderError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {orderError}
                    </p>
                  )}
                  <div className="flex items-center justify-between font-bold text-gray-800">
                    <span>Estimated Total</span>
                    <span>₹{totalValue.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {placing ? "Placing Order..." : "Place Order"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Your account manager will confirm pricing and generate the invoice.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
