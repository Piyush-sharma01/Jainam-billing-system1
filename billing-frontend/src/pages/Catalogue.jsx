import React, { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import { Package } from 'lucide-react'

export default function Catalogue() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [brandFilter, setBrandFilter] = useState('All')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const existingBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).sort()

  const filteredProducts =
    brandFilter === 'All' ? products : products.filter((p) => p.brand === brandFilter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Catalogue</h1>
        <p className="text-gray-500 text-sm sm:text-base">Browse products by brand</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBrandFilter('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                brandFilter === brand
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading catalogue...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <Package size={32} />
                    <span className="text-xs mt-1">No image</span>
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                {product.brand && (
                  <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
