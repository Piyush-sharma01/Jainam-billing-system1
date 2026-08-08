import React, { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

const CLOUD_NAME = 'kygaxh5x'
const UPLOAD_PRESET = 'jainam_products'

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.secure_url)
    } catch (err) {
      console.error(err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Product Image</label>

      {value ? (
        <div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Product" className="w-full h-full object-contain p-2" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary hover:bg-gray-50 transition-colors">
          {uploading ? (
            <>
              <Loader2 size={28} className="text-gray-400 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={28} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload from your device</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}
