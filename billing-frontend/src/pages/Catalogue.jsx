import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI, clientAPI, brandAPI } from '../services/api'
import { Package, ShoppingCart, Plus, Minus, Trash2, X, Search, ArrowLeft } from 'lucide-react'

export default function Catalogue() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  const [activeBrand, setActiveBrand] = useState(null) // null = showing brand cards
  const [search, setSearch] = useState('')
  const [brands, setBrands] = useState([]) // full Brand objects: {id, name, logoUrl}

  const [cart, setCart] = useState([])
  const [qtyPicker, setQtyPicker] = useState(null) // product being sized before add
  const [qtyValue, setQtyValue] = useState(1)

  const [showClientModal, setShowClientModal] = useState(false)
  const [modalClientId, setModalClientId] = useState('')
  const searchBoxRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, clientsRes, brandsRes] = await Promise.all([
        productAPI.getAll(),
        clientAPI.getAll(),
        brandAPI.getAll(),
      ])
      setProducts(productsRes.data || [])
      setClients(clientsRes.data || [])
      setBrands(brandsRes.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // brandNames = names actually used on products (drives the grid + drill-down)
  // brandLogo = looked up from the real Brand records for a given name
  const brandNames = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort()
  const brandLogo = (brandName) => brands.find((b) => b.name === brandName)?.logoUrl

  // Search works across ALL products regardless of which brand is open
  const searchResults = (() => {
    const term = search.trim().toLowerCase()
    if (!term) return []
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
      .slice(0, 20)
  })()

  const brandProducts = activeBrand ? products.filter((p) => p.brand === activeBrand) : []

  const visibleProducts = search.trim() ? searchResults : brandProducts

  const openQtyPicker = (product) => {
    setQtyPicker(product)
    setQtyValue(1)
  }

  const confirmAddToCart = () => {
    const product = qtyPicker
    if (!product || qtyValue < 1) return
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qtyValue }
            : item
        )
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
      ]
    })
    setQtyPicker(null)
  }

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleProceedClick = () => {
    if (cart.length === 0) return
    setModalClientId('')
    setShowClientModal(true)
  }

  const confirmClientAndBill = () => {
    const client = clients.find((c) => c.id === parseInt(modalClientId))
    if (!client) return
    navigate('/billing', { state: { client, cartItems: cart } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Catalogue</h1>
        <p className="text-gray-500 text-sm sm:text-base">Browse by brand, build an order, and bill it</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browse column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search — works across all products, independent of brand drill-down */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" ref={searchBoxRef}>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search all products by name, brand, or category..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          {/* Brand cards — hidden while searching */}
          {!search.trim() && !activeBrand && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Brands
              </h2>
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
              ) : brandNames.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                  No brands found — add a brand to your products first
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {brandNames.map((brand) => {
                    const logoUrl = brandLogo(brand)
                    const count = products.filter((p) => p.brand === brand).length
                    return (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
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
                            <Package size={32} className="text-gray-300" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-gray-800 truncate">{brand}</p>
                          <p className="text-xs text-gray-400">{count} product{count !== 1 ? 's' : ''}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Product grid — shown when a brand is open, or when searching */}
          {(activeBrand || search.trim()) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                {activeBrand && !search.trim() && (
                  <button
                    onClick={() => setActiveBrand(null)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
                  >
                    <ArrowLeft size={16} />
                    All Brands
                  </button>
                )}
                {activeBrand && !search.trim() && brandLogo(activeBrand) && (
                  <img
                    src={brandLogo(activeBrand)}
                    alt={activeBrand}
                    className="w-6 h-6 object-contain rounded"
                  />
                )}
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {search.trim() ? `Search results for "${search}"` : activeBrand}
                </h2>
              </div>

              {visibleProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                  No products found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {visibleProducts.map((product) => {
                    const inCart = cart.find((item) => item.productId === product.id)
                    return (
                      <button
                        key={product.id}
                        onClick={() => openQtyPicker(product)}
                        className="text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-secondary/40 transition-all relative"
                      >
                        {inCart && (
                          <span className="absolute top-2 right-2 z-10 bg-secondary text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow">
                            {inCart.quantity}
                          </span>
                        )}
                        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-gray-300">
                              <Package size={28} />
                              <span className="text-xs mt-1">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-gray-400">{product.brand}</p>
                            <p className="text-xs font-semibold text-gray-700">
                              ₹{Number(product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart column — persistent on the right, like Billing's summary panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cart</h2>
            </div>
            {itemCount > 0 && (
              <span className="text-xs font-medium bg-primary text-white px-2.5 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <ShoppingCart size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Click a product to add it here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 -mx-2">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-2 py-3 px-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Package size={14} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">₹{item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Subtotal (excl. tax)</span>
              <span className="font-semibold text-gray-800">₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedClick}
              disabled={cart.length === 0}
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Bill
            </button>
          </div>
        </div>
      </div>

      {/* Quantity picker modal — shown right after clicking a product */}
      {qtyPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">{qtyPicker.name}</h3>
              <button onClick={() => setQtyPicker(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {qtyPicker.imageUrl ? (
                <img src={qtyPicker.imageUrl} alt="" className="w-full h-full object-contain p-2" />
              ) : (
                <Package size={28} className="text-gray-300" />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ₹{Number(qtyPicker.price).toFixed(2)} · {qtyPicker.stock} in stock
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setQtyValue((v) => Math.max(1, v - 1))}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={qtyValue}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setQtyValue(isNaN(val) ? 1 : Math.max(1, val))
                }}
                className="w-20 text-center border border-gray-200 rounded-lg py-2"
              />
              <button
                onClick={() => setQtyValue((v) => v + 1)}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={confirmAddToCart}
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Client selection modal — shown when proceeding to bill */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Select Client</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Client</label>
            <select
              value={modalClientId}
              onChange={(e) => setModalClientId(e.target.value)}
              className="input-field mb-6"
            >
              <option value="">Choose a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.company}
                </option>
              ))}
            </select>
            <button
              onClick={confirmClientAndBill}
              disabled={!modalClientId}
              className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Billing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
