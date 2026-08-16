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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/store" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Jainam</span>
            <span className="hidden sm:inline text-blue-200 text-sm">
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
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-secondary text-white" : "text-blue-100 hover:bg-blue-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-700 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-700"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-primary border-t border-blue-700 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? "bg-secondary text-white" : "text-blue-100 hover:bg-blue-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-blue-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Jainam</h3>
            <p className="text-sm text-blue-200">
              Trusted supplier of quality pipes, valves and fittings — built on decades of
              relationships with our clients.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/store" className="hover:text-white">Home</Link></li>
              <li><Link to="/store/catalogue" className="hover:text-white">Catalogue</Link></li>
              <li><Link to="/store/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/store/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> +91 00000 00000</li>
              <li className="flex items-center gap-2"><Mail size={14} /> sales@jainam.example</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Mumbai, Maharashtra, India</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Your Account</h4>
            <p className="text-sm text-blue-200">
              Logged in as <span className="text-white">{user?.name}</span>
            </p>
          </div>
        </div>
        <div className="border-t border-blue-700 py-4 text-center text-xs text-blue-300">
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
