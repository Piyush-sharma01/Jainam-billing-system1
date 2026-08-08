import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import BrandModal from './BrandModal'
import { brandAPI } from '../services/api'

const ADD_NEW = '__add_new__'

export default function ProductModal({ product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pipes',
    brand: '',
    price: '',
    gst: '',
    stock: '',
    imageUrl: '',
  })

  const [brands, setBrands] = useState([])
  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [brandLogoUrl, setBrandLogoUrl] = useState('')
  const [brandLocked, setBrandLocked] = useState(false)
  const [showBrandModal, setShowBrandModal] = useState(false)

  useEffect(() => {
    brandAPI.getAll().then((res) => {
      setBrands(res.data)
      // If editing an existing product, try to match its brand name to a saved brand
      if (product?.brand) {
        const match = res.data.find((b) => b.name === product.brand)
        if (match) {
          setSelectedBrandId(String(match.id))
          setBrandLogoUrl(match.logoUrl || '')
          setBrandLocked(true)
        }
      }
    }).catch((err) => console.error('Failed to load brands', err))
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Pipes',
        brand: product.brand || '',
        price: product.price ?? '',
        gst: product.gst ?? '',
        stock: product.stock ?? '',
        imageUrl: product.imageUrl || '',
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleBrandSelect = (e) => {
    const value = e.target.value

    if (value === ADD_NEW) {
      setShowBrandModal(true)
      return
    }

    if (value === '') {
      setSelectedBrandId('')
      setBrandLogoUrl('')
      setBrandLocked(false)
      setFormData((prev) => ({ ...prev, brand: '' }))
      return
    }

    const chosen = brands.find((b) => String(b.id) === value)
    setSelectedBrandId(value)
    setBrandLogoUrl(chosen?.logoUrl || '')
    setBrandLocked(true)
    setFormData((prev) => ({ ...prev, brand: chosen?.name || '' }))
  }

  const handleBrandCreated = (newBrand) => {
    setBrands((prev) => [...prev, newBrand].sort((a, b) => a.name.localeCompare(b.name)))
    setSelectedBrandId(String(newBrand.id))
    setBrandLogoUrl(newBrand.logoUrl || '')
    setBrandLocked(true)
    setFormData((prev) => ({ ...prev, brand: newBrand.name }))
    setShowBrandModal(false)
  }

  const handleDeleteBrand = async () => {
    if (!selectedBrandId) return
    if (!window.confirm(`Delete brand "${formData.brand}"? This can't be undone.`)) return
    try {
      await brandAPI.delete(selectedBrandId)
      setBrands((prev) => prev.filter((b) => String(b.id) !== selectedBrandId))
      setSelectedBrandId('')
      setBrandLogoUrl('')
      setBrandLocked(false)
      setFormData((prev) => ({ ...prev, brand: '' }))
    } catch (err) {
      alert(err.response?.data || 'Could not delete brand')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill all required fields')
      return
    }
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      gst: parseFloat(formData.gst),
      stock: parseInt(formData.stock),
    })
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal-panel bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ImageUpload value={formData.imageUrl} onChange={handleImageChange} label="Product Image" />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Short description (optional)"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
              <option>Pipes</option>
              <option>Valves</option>
              <option>Fittings</option>
              <option>Tools</option>
              <option>Sealants</option>
              <option>Pumps</option>
              <option>Meters</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Brand</label>
            <select
              value={selectedBrandId}
              onChange={handleBrandSelect}
              className="input-field"
            >
              <option value="">Select a brand...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value={ADD_NEW}>+ Add new brand</option>
            </select>
          </div>

          {brandLocked && (
            <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-gray-500 text-sm font-medium">Brand Name (locked)</label>
                <button
                  type="button"
                  onClick={handleDeleteBrand}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Delete brand
                </button>
              </div>
              <input type="text" value={formData.brand} disabled className="input-field bg-gray-100 text-gray-500" />
              <ImageUpload value={brandLogoUrl} onChange={() => {}} label="Brand Logo (locked)" disabled />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">GST %</label>
              <input
                type="number"
                step="0.01"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter stock quantity"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {product ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {showBrandModal && (
        <BrandModal
          onCreated={handleBrandCreated}
          onClose={() => setShowBrandModal(false)}
        />
      )}
    </div>
  )
}
