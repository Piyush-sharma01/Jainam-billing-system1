import React, { useState } from 'react'
import { X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { brandAPI } from '../services/api'

export default function BrandModal({ onCreated, onClose }) {
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Brand name is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await brandAPI.create({ name: name.trim(), logoUrl })
      onCreated(res.data)
    } catch (err) {
      setError(err.response?.data || 'Could not create brand')
    } finally {
      setSaving(false)
    }
  }

  return (
  <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
  <div className="modal-panel bg-white rounded-xl shadow-xl max-w-sm w-full">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-800">Add New Brand</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Brand Logo" />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Brand Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Tata"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
