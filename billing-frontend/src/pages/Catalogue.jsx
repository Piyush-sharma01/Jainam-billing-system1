import React, { useState, useEffect, useRef } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { productAPI, clientAPI, brandAPI, invoiceAPI } from "../services/api";
import { downloadAndShareInvoice } from "../services/invoiceDocument";
import { getCurrentUser } from "../services/currentUser";
import {
  Package,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function Catalogue() {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandName } = useParams();
  const [searchParams] = useSearchParams();

  const activeBrand = brandName
    ? decodeURIComponent(brandName)
    : null;

  // Product ID from URL:
  // /catalogue/Nike?product=123
  const productIdFromUrl = searchParams.get("product");

  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);

  const [cart, setCart] = useState([]);

  // Product currently opened in quantity picker
  const [qtyPicker, setQtyPicker] = useState(null);
  const [qtyValue, setQtyValue] = useState(1);

  const [showClientModal, setShowClientModal] = useState(false);
  const [modalClientId, setModalClientId] = useState("");

  // Full invoice review section — opens after a client is chosen,
  // right here in Catalogue instead of navigating to /billing.
  const [showInvoiceReview, setShowInvoiceReview] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState(null);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");

  const searchBoxRef = useRef(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const startTime = Date.now();

    try {
      setLoading(true);

      const [productsRes, clientsRes, brandsRes] =
        await Promise.all([
          productAPI.getAll(),
          clientAPI.getAll(),
          brandAPI.getAll(),
        ]);

      setProducts(productsRes.data || []);
      setClients(clientsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (err) {
      console.error("Catalogue load error:", err);
    } finally {
      // Keep skeleton visible for at least 500ms
      // so it doesn't flash too quickly.
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remaining);
    }
  };

  // --------------------------------------------------
  // RESTORE PRODUCT FROM URL
  // --------------------------------------------------

  useEffect(() => {
    if (!productIdFromUrl || products.length === 0) {
      setQtyPicker(null);
      return;
    }

    const product = products.find(
      (p) => String(p.id) === String(productIdFromUrl)
    );

    if (product) {
      setQtyPicker(product);
      setQtyValue(1);
    } else {
      setQtyPicker(null);
    }
  }, [productIdFromUrl, products]);

  // --------------------------------------------------
  // PREFILL FROM AN INCOMING CLIENT ORDER
  // (navigated here from Orders.jsx with a "Create Invoice" click)
  // --------------------------------------------------

  useEffect(() => {
    const prefill = location.state?.fromOrder;
    if (!prefill || clients.length === 0 || products.length === 0) return;

    const client = clients.find((c) => c.id === prefill.clientId);
    if (client) {
      setInvoiceClient(client);
      setInvoiceNotes(prefill.notes || "");
      setInvoiceError("");
      setShowInvoiceReview(true);
    }

    const prefilledCart = (prefill.items || [])
      .map((orderItem) => {
        const product = products.find((p) => p.id === orderItem.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          gst: product.gst,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: orderItem.quantity,
          discountPercent: 0,
        };
      })
      .filter(Boolean);

    if (prefilledCart.length > 0) {
      setCart(prefilledCart);
    }

    // Clear the navigation state so a refresh/back doesn't re-prefill.
    window.history.replaceState({}, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, products]);

  // --------------------------------------------------
  // SKELETON
  // --------------------------------------------------

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-100" />

      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );

  // --------------------------------------------------
  // BRANDS
  // --------------------------------------------------

  const brandNames = Array.from(
    new Set(
      products
        .map((p) => p.brand)
        .filter(Boolean)
    )
  ).sort();

  const brandLogo = (name) =>
    brands.find((b) => b.name === name)?.logoUrl;

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchResults = (() => {
    const term = search.trim().toLowerCase();

    if (!term) return [];

    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
      .slice(0, 20);
  })();

  // --------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------

  const brandProducts = activeBrand
    ? products.filter(
        (p) => p.brand === activeBrand
      )
    : [];

  const visibleProducts = search.trim()
    ? searchResults
    : brandProducts;

  // --------------------------------------------------
  // OPEN PRODUCT
  // --------------------------------------------------

  const openQtyPicker = (product) => {
    // IMPORTANT:
    // Product is now part of browser history.
    //
    // Example:
    // /catalogue/Nike
    //      ↓
    // /catalogue/Nike?product=123

    navigate(
      `/catalogue/${encodeURIComponent(
        product.brand
      )}?product=${product.id}`
    );

    setQtyPicker(product);
    setQtyValue(1);
  };

  // --------------------------------------------------
  // CLOSE PRODUCT
  // --------------------------------------------------

  const closeQtyPicker = () => {
    // Going back removes ?product=123
    // and returns to the brand product grid.
    navigate(-1);
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const confirmAddToCart = () => {
    const product = qtyPicker;

    if (!product || qtyValue < 1) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + qtyValue,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          gst: product.gst,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: qtyValue,
          discountPercent: 0,
        },
      ];
    });

    // Return to brand page.
    navigate(-1);
  };

  // --------------------------------------------------
  // CART QUANTITY
  // --------------------------------------------------

  const updateCartQuantity = (
    productId,
    quantity
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                quantity
              ),
            }
          : item
      )
    );
  };

  // --------------------------------------------------
  // REMOVE FROM CART
  // --------------------------------------------------

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  const updateCartDiscount = (productId, discountPercent) => {
    const clamped = Math.max(
      0,
      Math.min(100, isNaN(discountPercent) ? 0 : discountPercent)
    );
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, discountPercent: clamped }
          : item
      )
    );
  };

  // --------------------------------------------------
  // CART TOTALS
  // --------------------------------------------------

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );

  // Discount is applied before tax, matching the backend calculation
  // (see Billing.jsx / InvoiceService) so the preview total here always
  // matches what gets created on the server.
  const calculateLineTotals = (item) => {
    const lineBase = Number(item.price) * item.quantity;
    const discountAmount = lineBase * ((item.discountPercent || 0) / 100);
    const taxable = lineBase - discountAmount;
    const tax = taxable * (Number(item.gst || 0) / 100);
    const total = taxable + tax;
    return { lineBase, discountAmount, taxable, tax, total };
  };

  const calculateCartTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let tax = 0;
    cart.forEach((item) => {
      const { taxable, discountAmount, tax: itemTax } = calculateLineTotals(item);
      subtotal += taxable;
      discount += discountAmount;
      tax += itemTax;
    });
    return { subtotal, discount, tax, total: subtotal + tax };
  };

  // --------------------------------------------------
  // PROCEED TO BILL
  // --------------------------------------------------

  const handleProceedClick = () => {
    if (cart.length === 0) return;

    setModalClientId("");
    setShowClientModal(true);
  };

  // --------------------------------------------------
  // BILLING
  // --------------------------------------------------

  const confirmClientAndBill = () => {
    const client = clients.find(
      (c) =>
        c.id ===
        parseInt(modalClientId)
    );

    if (!client) return;

    setInvoiceClient(client);
    setInvoiceNotes("");
    setInvoiceError("");
    setShowClientModal(false);
    setShowInvoiceReview(true);
  };

  const closeInvoiceReview = () => {
    if (creatingInvoice) return;
    setShowInvoiceReview(false);
    setInvoiceClient(null);
    setInvoiceError("");
  };

  // --------------------------------------------------
  // CREATE INVOICE — then auto-download PDF + share on WhatsApp
  // --------------------------------------------------

  const handleCreateInvoice = async () => {
    if (!invoiceClient || cart.length === 0) return;

    setCreatingInvoice(true);
    setInvoiceError("");

    try {
      const invoiceData = {
        client: invoiceClient,
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        lineItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discountPercentage: item.discountPercent,
        })),
        notes: invoiceNotes,
      };

      const res = await invoiceAPI.create(invoiceData);
      const createdInvoice = res.data;

      // Auto-downloads the PDF, then hands it to WhatsApp — the phone
      // used is the logged-in marketer's own number (native share sheet
      // on mobile shares from their own device/account regardless).
      const marketerPhone = getCurrentUser()?.phone;
      await downloadAndShareInvoice(createdInvoice, marketerPhone);

      // Reset everything and close the review section.
      setCart([]);
      setInvoiceClient(null);
      setInvoiceNotes("");
      setModalClientId("");
      setShowInvoiceReview(false);
    } catch (err) {
      setInvoiceError(
        "Failed to create invoice: " +
          (err.response?.data?.message || err.response?.data || err.message)
      );
    } finally {
      setCreatingInvoice(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Catalogue
        </h1>

        <p className="text-gray-500 text-sm sm:text-base">
          Browse by brand, build an order, and bill it
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ==========================================
            BROWSE COLUMN
        ========================================== */}

        <div className="lg:col-span-2 space-y-6">

          {/* SEARCH */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            ref={searchBoxRef}
          >
            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search all products by name, brand, or category..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />

            </div>
          </div>

          {/* ==========================================
              BRANDS
          ========================================== */}

          {!search.trim() &&
            !activeBrand && (
              <div>

                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Brands
                </h2>

                {loading ? (

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                    {Array.from({
                      length: 6,
                    }).map((_, i) => (
                      <SkeletonCard
                        key={i}
                      />
                    ))}

                  </div>

                ) : brandNames.length === 0 ? (

                  <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                    No brands found — add a brand to your products first
                  </div>

                ) : (

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                    {brandNames.map(
                      (brand) => {
                        const logoUrl =
                          brandLogo(
                            brand
                          );

                        const count =
                          products.filter(
                            (p) =>
                              p.brand ===
                              brand
                          ).length;

                        return (
                          <button
                            key={brand}
                            onClick={() =>
                              navigate(
                                `/catalogue/${encodeURIComponent(
                                  brand
                                )}`
                              )
                            }
                            className="text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-secondary/40 transition-all"
                          >

                            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">

                              {logoUrl ? (

                                <img
                                  src={logoUrl}
                                  alt={brand}
                                  className="w-full h-full object-contain p-3"
                                />

                              ) : (

                                <Package
                                  size={32}
                                  className="text-gray-300"
                                />

                              )}

                            </div>

                            <div className="p-3">

                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {brand}
                              </p>

                              <p className="text-xs text-gray-400">
                                {count}{" "}
                                product
                                {count !== 1
                                  ? "s"
                                  : ""}
                              </p>

                            </div>

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            )}

          {/* ==========================================
              PRODUCTS
          ========================================== */}

          {(activeBrand ||
            search.trim()) && (
            <div>

              {/* PRODUCT HEADER */}

              <div className="flex items-center gap-2 mb-3">

                {activeBrand &&
                  !search.trim() && (
                    <button
                      onClick={() =>
                        navigate(
                          "/catalogue"
                        )
                      }
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
                    >
                      <ArrowLeft
                        size={16}
                      />
                      All Brands
                    </button>
                  )}

                {activeBrand &&
                  !search.trim() &&
                  brandLogo(
                    activeBrand
                  ) && (
                    <img
                      src={brandLogo(
                        activeBrand
                      )}
                      alt={activeBrand}
                      className="w-6 h-6 object-contain rounded"
                    />
                  )}

                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {search.trim()
                    ? `Search results for "${search}"`
                    : activeBrand}
                </h2>

              </div>

              {/* LOADING */}

              {loading ? (

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                  {Array.from({
                    length: 6,
                  }).map((_, i) => (
                    <SkeletonCard
                      key={i}
                    />
                  ))}

                </div>

              ) : visibleProducts.length === 0 ? (

                <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                  No products found
                </div>

              ) : (

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                  {visibleProducts.map(
                    (product) => {

                      const inCart =
                        cart.find(
                          (item) =>
                            item.productId ===
                            product.id
                        );

                      return (

                        <button
                          key={product.id}
                          onClick={() =>
                            openQtyPicker(
                              product
                            )
                          }
                          className="text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-secondary/40 transition-all relative"
                        >

                          {/* CART COUNT */}

                          {inCart && (
                            <span className="absolute top-2 right-2 z-10 bg-secondary text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow">
                              {
                                inCart.quantity
                              }
                            </span>
                          )}

                          {/* IMAGE */}

                          <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">

                            {product.imageUrl ? (

                              <img
                                src={
                                  product.imageUrl
                                }
                                alt={
                                  product.name
                                }
                                className="w-full h-full object-contain p-2"
                              />

                            ) : (

                              <div className="flex flex-col items-center text-gray-300">

                                <Package
                                  size={28}
                                />

                                <span className="text-xs mt-1">
                                  No image
                                </span>

                              </div>

                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="p-3">

                            <p className="text-sm font-medium text-gray-800 truncate">
                              {
                                product.name
                              }
                            </p>

                            <div className="flex items-center justify-between mt-0.5">

                              <p className="text-xs text-gray-400">
                                {
                                  product.brand
                                }
                              </p>

                              <p className="text-xs font-semibold text-gray-700">
                                ₹
                                {Number(
                                  product.price
                                ).toFixed(
                                  2
                                )}
                              </p>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          )}

        </div>

        {/* ==========================================
            CART
        ========================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-fit lg:sticky lg:top-6">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">

              <ShoppingCart
                size={18}
                className="text-gray-500"
              />

              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Cart
              </h2>

            </div>

            {itemCount > 0 && (
              <span className="text-xs font-medium bg-primary text-white px-2.5 py-1 rounded-full">
                {itemCount}{" "}
                {itemCount === 1
                  ? "item"
                  : "items"}
              </span>
            )}

          </div>

          {/* EMPTY CART */}

          {cart.length === 0 ? (

            <div className="py-10 text-center text-gray-400">

              <ShoppingCart
                size={28}
                className="mx-auto mb-2 opacity-40"
              />

              <p className="text-sm">
                Click a product to add it here
              </p>

            </div>

          ) : (

            <div className="divide-y divide-gray-100 -mx-2">

              {cart.map((item) => (

                <div
                  key={item.productId}
                  className="flex items-center gap-2 py-3 px-2"
                >

                  {/* IMAGE */}

                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">

                    {item.imageUrl ? (

                      <img
                        src={
                          item.imageUrl
                        }
                        alt=""
                        className="w-full h-full object-contain"
                      />

                    ) : (

                      <Package
                        size={14}
                        className="text-primary"
                      />

                    )}

                  </div>

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      ₹
                      {Number(
                        item.price
                      ).toFixed(2)}{" "}
                      ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  {/* QUANTITY */}

                  <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg shrink-0">

                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.quantity -
                            1
                        )
                      }
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Minus
                        size={12}
                      />
                    </button>

                    <span className="w-6 text-center text-xs">
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.quantity +
                            1
                        )
                      }
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Plus
                        size={12}
                      />
                    </button>

                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.productId
                      )
                    }
                    className="text-gray-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2
                      size={15}
                    />
                  </button>

                </div>

              ))}

            </div>
          )}

          {/* TOTAL */}

          <div className="border-t border-gray-100 mt-4 pt-4">

            <div className="flex justify-between text-sm text-gray-600 mb-3">

              <span>
                Subtotal (excl. tax)
              </span>

              <span className="font-semibold text-gray-800">
                ₹
                {cartSubtotal.toFixed(
                  2
                )}
              </span>

            </div>

            <button
              onClick={
                handleProceedClick
              }
              disabled={
                cart.length === 0
              }
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Invoice
            </button>

          </div>

        </div>

      </div>

      {/* ==========================================
          PRODUCT QUANTITY MODAL
      ========================================== */}

      {qtyPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold text-gray-800 truncate pr-4">
                {qtyPicker.name}
              </h3>

              <button
                onClick={
                  closeQtyPicker
                }
                className="text-gray-500 hover:text-gray-700 shrink-0"
              >
                <X size={20} />
              </button>

            </div>

            {/* IMAGE */}

            <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4">

              {qtyPicker.imageUrl ? (

                <img
                  src={
                    qtyPicker.imageUrl
                  }
                  alt=""
                  className="w-full h-full object-contain p-2"
                />

              ) : (

                <Package
                  size={28}
                  className="text-gray-300"
                />

              )}

            </div>

            {/* PRICE / STOCK */}

            <p className="text-sm text-gray-500 mb-4">
              ₹
              {Number(
                qtyPicker.price
              ).toFixed(2)}{" "}
              ·{" "}
              {qtyPicker.stock} in stock
            </p>

            {/* QUANTITY */}

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity
            </label>

            <div className="flex items-center gap-2 mb-6">

              <button
                onClick={() =>
                  setQtyValue(
                    (v) =>
                      Math.max(
                        1,
                        v - 1
                      )
                  )
                }
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                min="1"
                value={qtyValue}
                onChange={(e) => {
                  const val =
                    parseInt(
                      e.target.value
                    );

                  setQtyValue(
                    isNaN(val)
                      ? 1
                      : Math.max(
                          1,
                          val
                        )
                  );
                }}
                className="w-20 text-center border border-gray-200 rounded-lg py-2"
              />

              <button
                onClick={() =>
                  setQtyValue(
                    (v) => v + 1
                  )
                }
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>

            </div>

            {/* ADD */}

            <button
              onClick={
                confirmAddToCart
              }
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Add to Cart
            </button>

          </div>

        </div>
      )}

      {/* ==========================================
          CLIENT MODAL
      ========================================== */}

      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold text-gray-800">
                Select Client
              </h3>

              <button
                onClick={() =>
                  setShowClientModal(
                    false
                  )
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* CLIENT */}

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client
            </label>

            <select
              value={modalClientId}
              onChange={(e) =>
                setModalClientId(
                  e.target.value
                )
              }
              className="input-field mb-6"
            >

              <option value="">
                Choose a client...
              </option>

              {clients.map(
                (client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.company}
                  </option>
                )
              )}

            </select>

            {/* CONTINUE */}

            <button
              onClick={
                confirmClientAndBill
              }
              disabled={
                !modalClientId
              }
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Invoice
            </button>

          </div>

        </div>
      )}

      {/* ==========================================
          INVOICE REVIEW SECTION
          Full invoice details, right here in Catalogue.
          Creating it auto-downloads the PDF and hands it to WhatsApp.
      ========================================== */}

      {showInvoiceReview && invoiceClient && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">

          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-4 sm:my-0">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">

              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-500" />
                <h3 className="font-bold text-gray-800">
                  Review Invoice
                </h3>
              </div>

              <button
                onClick={closeInvoiceReview}
                disabled={creatingInvoice}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-40"
              >
                <X size={20} />
              </button>

            </div>

            <div className="px-5 sm:px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* CLIENT */}

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Bill To
                </h4>
                <p className="text-sm font-medium text-gray-800">
                  {invoiceClient.company}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                  <span>{invoiceClient.contactPerson}</span>
                  <span>{invoiceClient.phone}</span>
                  <span>GSTIN: {invoiceClient.gstNumber || "N/A"}</span>
                </div>
              </div>

              {/* LINE ITEMS */}

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Items
                </h4>

                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                  {cart.map((item) => {
                    const { total: lineTotal } = calculateLineTotals(item);
                    const overStock = item.quantity > item.stock;

                    return (
                      <div
                        key={item.productId}
                        className="p-3 flex flex-wrap items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package size={16} className="text-primary" />
                          )}
                        </div>

                        <div className="flex-1 min-w-[120px]">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ₹{Number(item.price).toFixed(2)} · GST {item.gst}%
                          </p>
                          {overStock && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                              <AlertTriangle size={12} />
                              Only {item.stock} in stock
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg shrink-0">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1.5 text-gray-500 hover:text-gray-800"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1.5 text-gray-500 hover:text-gray-800"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <label className="text-xs text-gray-400">Disc%</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discountPercent}
                            onChange={(e) =>
                              updateCartDiscount(item.productId, parseFloat(e.target.value))
                            }
                            className="w-14 text-center text-sm border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-secondary"
                          />
                        </div>

                        <p className="ml-auto text-sm font-semibold text-gray-800 shrink-0">
                          ₹{lineTotal.toFixed(2)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-600 shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NOTES */}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Notes
                </label>
                <textarea
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  placeholder="Add notes for this invoice (optional)..."
                  className="input-field"
                  rows="2"
                />
              </div>

              {/* TOTALS */}

              {(() => {
                const { subtotal, discount, tax, total } = calculateCartTotals();
                return (
                  <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">− ₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (GST)</span>
                      <span className="font-medium">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-lg text-secondary">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {invoiceError && (
                <p className="text-sm text-red-600">{invoiceError}</p>
              )}

            </div>

            {/* FOOTER */}

            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={closeInvoiceReview}
                disabled={creatingInvoice}
                className="px-4 py-2.5 rounded-lg font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={creatingInvoice || cart.length === 0}
                className="px-5 py-2.5 rounded-lg font-medium bg-secondary text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingInvoice
                  ? "Creating..."
                  : "Create Invoice "}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
