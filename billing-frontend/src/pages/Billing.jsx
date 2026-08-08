import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { invoiceAPI, clientAPI, productAPI } from '../services/api'import {
  Plus,
  Minus,
  Trash2,
  Search,
  X,
  ShoppingCart,
  Package,
  FileText,
  AlertTriangle,
} from 'lucide-react'

export default function Billing() {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [cart, setCart] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [productSearch, setProductSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const searchBoxRef = useRef(null)
const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    loadData()
  }, [])
// Pre-fill from Catalogue's "Proceed to Bill" hand-off
  useEffect(() => {
    if (location.state?.client) {
      setSelectedClient(location.state.client)
    }
    if (location.state?.cartItems) {
      setCart(location.state.cartItems)
    }
    if (location.state) {
      // Clear the navigation state so a page refresh doesn't re-seed old data
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadData = async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        clientAPI.getAll(),
        productAPI.getAll(),
      ])
      setClients(clientsRes.data || [])
      setProducts(productsRes.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const suggestions = (() => {
    const term = productSearch.trim().toLowerCase()
    if (!term) return []
    const startsWith = []
    const contains = []
    products.forEach((p) => {
      const name = (p.name || '').toLowerCase()
      const category = (p.category || '').toLowerCase()
      if (name.startsWith(term)) {
        startsWith.push(p)
      } else if (name.includes(term) || category.includes(term)) {
        contains.push(p)
      }
    })
    return [...startsWith, ...contains].slice(0, 8)
  })()

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          gst: product.gst,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: 1,
          discountPercent: 0,
        },
      ]
    })
    setProductSearch('')
    setShowSuggestions(false)
    setHighlightedIndex(0)
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const updateDiscount = (productId, discountPercent) => {
    const clamped = Math.max(0, Math.min(100, isNaN(discountPercent) ? 0 : discountPercent))
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, discountPercent: clamped } : item
      )
    )
  }

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      addToCart(suggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Discount is applied before tax, matching the backend calculation
  const calculateLineTotals = (item) => {
    const lineBase = item.price * item.quantity
    const discountAmount = lineBase * (item.discountPercent / 100)
    const taxable = lineBase - discountAmount
    const tax = taxable * (item.gst / 100)
    const total = taxable + tax
    return { lineBase, discountAmount, taxable, tax, total }
  }

  const calculateTotals = () => {
    let subtotal = 0
    let discount = 0
    let tax = 0
    cart.forEach((item) => {
      const { taxable, discountAmount, tax: itemTax } = calculateLineTotals(item)
      subtotal += taxable
      discount += discountAmount
      tax += itemTax
    })
    return { subtotal, discount, tax, total: subtotal + tax }
  }

  const { subtotal, discount, tax, total } = calculateTotals()

  const handleCreateInvoice = async () => {
    if (!selectedClient || cart.length === 0) {
      alert('Please select a client and add at least one item')
      return
    }

    setSubmitting(true)
    try {
      const invoiceData = {
        client: selectedClient,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discountPercentage: item.discountPercent,
        })),
        notes,
      }
      await invoiceAPI.create(invoiceData)
      alert('Invoice created successfully')
      setSelectedClient(null)
      setCart([])
      setNotes('')
    } catch (err) {
      alert('Failed to create invoice: ' + (err.response?.data?.message || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    !!selectedClient &&
    cart.length > 0 &&
    cart.every((item) => item.quantity > 0) &&
    !submitting

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Invoice</h1>
        <p className="text-gray-500 text-sm sm:text-base">Search products, build the order, and generate a bill</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Client
            </h2>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find((c) => c.id === parseInt(e.target.value))
                setSelectedClient(client)
              }}
              className="input-field"
            >
              <option value="">Choose a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.company}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                <span>{selectedClient.contactPerson}</span>
                <span>{selectedClient.phone}</span>
                <span>GSTIN: {selectedClient.gstNumber || 'N/A'}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Add Products
            </h2>
            <div className="relative" ref={searchBoxRef}>
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value)
                  setShowSuggestions(true)
                  setHighlightedIndex(0)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Type a product name to search, e.g. 'Copper'..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              {productSearch && (
                <button
                  onClick={() => {
                    setProductSearch('')
                    setShowSuggestions(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}

              {showSuggestions && productSearch && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {suggestions.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      No products match "{productSearch}"
                    </div>
                  ) : (
                    suggestions.map((product, idx) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b last:border-b-0 transition-colors ${
                          idx === highlightedIndex ? 'bg-orange-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt=""
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.style.display = 'none' }}
                              />
                            ) : (
                              <Package size={16} className="text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.category} · GST {product.gst}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-gray-800">
                            ₹{Number(product.price).toFixed(2)}
                          </p>
                          <p
                            className={`text-xs ${
                              product.stock > 20
                                ? 'text-green-600'
                                : product.stock > 0
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Order Items
                </h2>
              </div>
              {cart.length > 0 && (
                <span className="text-xs font-medium bg-primary text-white px-2.5 py-1 rounded-full">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No items yet — search above to add products</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const { total: lineTotal } = calculateLineTotals(item)
                  const overStock = item.quantity > item.stock
                  return (
                    <div
                      key={item.productId}
                      className="flex flex-wrap items-start gap-3 px-4 sm:px-6 py-4"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <Package size={16} className="text-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-[140px]">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.price.toFixed(2)} · GST {item.gst}%
                        </p>
                        {overStock && (
                          <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle size={12} />
                            Only {item.stock} in stock
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-red-600 shrink-0 order-1 sm:order-none"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Quantity, discount, price row — wraps below on narrow phones */}
                      <div className="w-full flex flex-wrap items-center gap-3 sm:gap-4 pl-12 sm:pl-12">
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg shrink-0">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            className="p-2 text-gray-500 hover:text-gray-800"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              updateQuantity(item.productId, isNaN(val) ? 1 : Math.max(1, val))
                            }}
                            className="w-12 text-center text-sm border-0 focus:outline-none focus:ring-0"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 text-gray-500 hover:text-gray-800"
                          >
                            <Plus size={14} />
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
                              updateDiscount(item.productId, parseFloat(e.target.value))
                            }
                            className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                          />
                        </div>

                        <p className="ml-auto text-right text-sm font-semibold text-gray-800 shrink-0">
                          ₹{lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this invoice (optional)..."
                className="input-field"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Summary
            </h2>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Client</span>
              <span className="text-gray-800 font-medium truncate max-w-[140px]">
                {selectedClient?.company || '—'}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Items</span>
              <span className="text-gray-800 font-medium">{itemCount}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">− ₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (GST)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-lg text-secondary">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCreateInvoice}
            disabled={!canSubmit}
            className="w-full bg-secondary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Invoice'}
          </button>
          {!selectedClient && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Select a client to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
