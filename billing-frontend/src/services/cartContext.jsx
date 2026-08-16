import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

// Lightweight in-memory cart for the client storefront. Not persisted to
// localStorage (matches the rest of the app's "no persisted session" model)
// — resets on page reload, same as login.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, quantity }]

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const totalValue = useMemo(
    () =>
      items.reduce((sum, i) => {
        const price = Number(i.product.price) || 0;
        const gst = Number(i.product.gst) || 0;
        const lineSubtotal = price * i.quantity;
        return sum + lineSubtotal + (lineSubtotal * gst) / 100;
      }, 0),
    [items],
  );

  const value = { items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalValue };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
