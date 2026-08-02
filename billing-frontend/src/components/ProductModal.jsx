import React, { useState, useEffect } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'

export default function ProductModal({ product, existingBrands = [], onSave, onClose }) {
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
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (product) {
      // Only pick the fields this form actually manages — spreading the
      // whole product object would also carry along id/createdAt/etc.
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
    if (name === 'imageUrl') setImageError(false)
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/product.jpg"
            />
            <div className="mt-3 w-full h-36 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
              {formData.imageUrl && !imageError ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon size={28} className="mx-auto mb-1" />
                  <p className="text-xs">
                    {formData.imageUrl ? "Couldn't load that image" : 'Image preview'}
                  </p>
                </div>
              )}
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Tata"
                list="brand-suggestions"
              />
              <datalist id="brand-suggestions">
                {existingBrands.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

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
    </div>
  )
}
