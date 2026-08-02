import React, { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react'
import ProductModal from '../components/ProductModal'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, brandFilter, products])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data || [])
      setError('')
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    const term = searchTerm.trim().toLowerCase()
    setFilteredProducts(
      products.filter((p) => {
        const matchesSearch =
          !term ||
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term)
        const matchesBrand = brandFilter === 'All' || p.brand === brandFilter
        return matchesSearch && matchesBrand
      })
    )
  }

  // Unique brand list (in the order first seen), used for both the filter
  // tabs and the autocomplete suggestions in the Add/Edit modal.
  const existingBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).sort()

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData)
      } else {
        await productAPI.create(productData)
      }
      setShowModal(false)
      setEditingProduct(null)
      loadProducts()
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id)
        loadProducts()
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const stockBadge = (stock) =>
    stock > 20
      ? 'bg-green-100 text-green-800'
      : stock > 0
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, category, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {existingBrands.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setBrandFilter('All')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                brandFilter === 'All'
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Brands
            </button>
            {existingBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  brandFilter === brand
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex-col items-center justify-center text-gray-300"
                  style={{ display: product.imageUrl ? 'none' : 'flex' }}
                >
                  <Package size={36} />
                  <span className="text-xs mt-1">No image</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 leading-snug">{product.name}</h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${stockBadge(product.stock)}`}
                  >
                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="inline-block w-fit px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="inline-block w-fit px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                      {product.brand}
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      ₹{Number(product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">GST {product.gst}%</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingProduct(product); setShowModal(true) }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          existingBrands={existingBrands}
          onSave={handleSaveProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null) }}
        />
      )}
    </div>
  )
}
