import React, { useState, useEffect } from 'react'
import { X, FileUp, Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import BrandModal from './BrandModal'
import CategoryModal from './CategoryModal'
import { brandAPI, categoryAPI, productAPI } from '../services/api'

const ADD_NEW = '__add_new__'

export default function ProductModal({ product, onSave, onImported, onClose, initialMode = 'single' }) {
  // 'single' = normal form, 'catalogue' = import from PDF (only when adding)
  const [mode, setMode] = useState(initialMode)
  const [pdfFile, setPdfFile] = useState(null)
  const [importRows, setImportRows] = useState([])
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    size: '',
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

  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  useEffect(() => {
    categoryAPI.getAll().then((res) => {
      setCategories(res.data)
      // If editing an existing product, try to match its category name to a saved category
      if (product?.category) {
        const match = res.data.find((c) => c.name === product.category)
        if (match) setSelectedCategoryId(String(match.id))
      }
    }).catch((err) => console.error('Failed to load categories', err))
  }, [])

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
        category: product.category || '',
        brand: product.brand || '',
        size: product.size || '',
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

  const handleCategorySelect = (e) => {
    const value = e.target.value

    if (value === ADD_NEW) {
      setShowCategoryModal(true)
      return
    }

    if (value === '') {
      setSelectedCategoryId('')
      setFormData((prev) => ({ ...prev, category: '' }))
      return
    }

    const chosen = categories.find((c) => String(c.id) === value)
    setSelectedCategoryId(value)
    setFormData((prev) => ({ ...prev, category: chosen?.name || '' }))
  }

  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)))
    setSelectedCategoryId(String(newCategory.id))
    setFormData((prev) => ({ ...prev, category: newCategory.name }))
    setShowCategoryModal(false)
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return
    if (!window.confirm(`Delete category "${formData.category}"? This can't be undone.`)) return
    try {
      await categoryAPI.delete(selectedCategoryId)
      setCategories((prev) => prev.filter((c) => String(c.id) !== selectedCategoryId))
      setSelectedCategoryId('')
      setFormData((prev) => ({ ...prev, category: '' }))
    } catch (err) {
      alert(err.response?.data || 'Could not delete category')
    }
  }

  // Every field is optional: blank text/number -> null
  const textOrNull = (v) => (v === '' || v == null ? null : String(v).trim() || null)
  const numOrNull = (v, parse) => {
    if (v === '' || v == null) return null
    const n = parse(v)
    return Number.isNaN(n) ? null : n
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      name: textOrNull(formData.name),
      description: textOrNull(formData.description),
      category: textOrNull(formData.category),
      brand: textOrNull(formData.brand),
      size: textOrNull(formData.size),
      imageUrl: textOrNull(formData.imageUrl),
      price: numOrNull(formData.price, parseFloat),
      gst: numOrNull(formData.gst, parseFloat),
      stock: numOrNull(formData.stock, (v) => parseInt(v, 10)),
    })
  }

  // ---------- Catalogue PDF import ----------
  const handlePdfPick = (e) => {
    setPdfFile(e.target.files?.[0] || null)
    setImportRows([])
    setImportError('')
  }

  const handleReadPdf = async () => {
    if (!pdfFile) return
    setImportLoading(true)
    setImportError('')
    try {
      const res = await productAPI.importPreview(pdfFile)
      setImportRows((res.data || []).map((p, i) => ({ ...p, _id: i, _selected: false, _imageSourceId: p.extractedImageData ? i : '' })))
    } catch (err) {
      const d = err.response?.data
      setImportRows([])
      setImportError(typeof d === 'string' ? d : d?.message || err.message)
    } finally {
      setImportLoading(false)
    }
  }

  const updateRow = (id, field, value) =>
    setImportRows((rows) => rows.map((r) => (r._id === id ? { ...r, [field]: value } : r)))
  const approveAllRows = () => setImportRows((rows) => rows.map((r) => ({ ...r, _selected: true })))
  const updateRowImage = (id, file) => {
    if (!file) return
    setImportRows((rows) => rows.map((r) => (r._id === id ? { ...r, _replacementFile: file, _replacementPreview: URL.createObjectURL(file) } : r)))
  }

  const selectedRows = importRows.filter((r) => r._selected)

  const imageForRow = (row) => {
    const sourceId = row._imageSourceId === '' || row._imageSourceId == null ? row._id : Number(row._imageSourceId)
    return importRows.find((candidate) => candidate._id === sourceId)?.extractedImageData || null
  }

  const uploadExtractedImage = async (dataUrlOrFile) => {
    const blob = dataUrlOrFile instanceof Blob ? dataUrlOrFile : await (await fetch(dataUrlOrFile)).blob()
    const formData = new FormData()
    formData.append('file', blob, 'catalogue-product.jpg')
    formData.append('upload_preset', 'jainam_products')
    const uploaded = await fetch('https://api.cloudinary.com/v1_1/kygaxh5x/image/upload', { method: 'POST', body: formData })
    if (!uploaded.ok) throw new Error('An extracted product image could not be uploaded to Cloudinary')
    return (await uploaded.json()).secure_url
  }

  const handleImportSave = async () => {
    if (selectedRows.length === 0) return
    setImportLoading(true)
    setImportError('')
    try {
      const payload = []
      let uploadFailures = 0
      const failedNames = []
      for (const r of selectedRows) {
        try {
          const imageSource = r._replacementFile || imageForRow(r)
          if (!imageSource) throw new Error('Assign or upload an image before approving this product')
          const imageUrl = r._replacementFile ? await uploadExtractedImage(r._replacementFile) : await uploadExtractedImage(imageSource)
          payload.push({
            name: textOrNull(r.name),
            productCode: textOrNull(r.productCode),
            size: textOrNull(r.size),
            category: textOrNull(r.category),
            brand: textOrNull(r.brand),
            description: textOrNull(r.sourceLabel || r.description),
            imageUrl,
            price: null,
            gst: null,
            stock: null,
            reviewConfirmed: true,
          })
        } catch (uploadError) {
          uploadFailures += 1
          failedNames.push(r.name || `row ${r._id + 1}`)
        }
      }
      if (payload.length === 0) {
        setImportError(`0 added, ${uploadFailures} failed image upload(s): ${failedNames.join(', ')}`)
        return
      }
      try {
        const res = await productAPI.importBulk(payload)
        const counts = res.data || {}
        const failed = (counts.failed ?? 0) + uploadFailures
        alert(`Import complete: ${counts.saved ?? 0} added, ${counts.skipped ?? 0} duplicates skipped, ${failed} failed.${failedNames.length ? ` Image upload failures: ${failedNames.join(', ')}` : ''}`)
        onImported && onImported()
      } catch (err) {
        const d = err.response?.data
        setImportError(`Database import failed: 0 added, ${payload.length + uploadFailures} failed. ${typeof d === 'string' ? d : d?.message || err.message}`)
      }
    } finally {
      setImportLoading(false)
    }
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`modal-panel bg-white rounded-xl shadow-xl ${mode === 'catalogue' ? 'max-w-4xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {!product && (
          <div className="flex gap-2 px-6 pt-4">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${mode === 'single' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Single product
            </button>
            <button
              type="button"
              onClick={() => setMode('catalogue')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${mode === 'catalogue' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <FileUp size={14} /> Import catalogue PDF
            </button>
          </div>
        )}

        {mode === 'catalogue' && !product && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">
              Each detected JNM caption is matched within its PDF page using text and image coordinates. Every row starts unapproved: inspect the page crop, correct fields/image, then explicitly approve only verified rows. Price is never extracted.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input type="file" accept="application/pdf,.pdf" onChange={handlePdfPick} className="text-sm" />
              <button
                type="button"
                onClick={handleReadPdf}
                disabled={!pdfFile || importLoading}
                className="btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importLoading && importRows.length === 0 && <Loader2 size={16} className="animate-spin" />}
                Read PDF
              </button>
            </div>

            {importError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{importError}</div>
            )}

            {importRows.length > 0 && (
              <>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{selectedRows.length} of {importRows.length} products explicitly approved</span>
                  <button type="button" onClick={approveAllRows} className="btn-secondary !py-1.5 !px-3 text-sm">
                    Approve All
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[45vh] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="text-left text-gray-500">
                        <th className="p-2">Approve</th>
                        <th className="p-2">Source page and image evidence</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Code</th>
                        <th className="p-2">Size</th>
                        <th className="p-2">Category</th>
                        <th className="p-2 w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importRows.map((r) => (
                        <tr key={r._id} className={`border-t border-gray-100 ${r._selected ? 'bg-green-50' : ''}`}>
                          <td className="p-2 align-top min-w-28">
                            <input
                              type="checkbox"
                              checked={r._selected}
                              onChange={(e) => updateRow(r._id, '_selected', e.target.checked)}
                            />
                            <div className="mt-1 text-[10px] font-semibold text-amber-700">{r._selected ? 'Approved' : 'Needs Review'}</div>
                            <div className="mt-1 max-w-36 text-[10px] text-gray-500">{r.reviewReason}</div>
                          </td>
                          <td className="p-2 align-top min-w-64">
                            <div className="text-xs font-semibold mb-1">PDF page {r.sourcePage || '—'}</div>
                            {r.sourceCropData ? <img src={r.sourceCropData} alt={`Original catalogue page ${r.sourcePage} crop`} className="w-56 h-36 object-contain rounded border bg-white" /> : <span className="text-xs text-red-600">Source crop unavailable</span>}
                            <div className="grid grid-cols-2 gap-2 mt-2 items-start">
                              <div>
                                {r._replacementPreview || imageForRow(r) ? <img src={r._replacementPreview || imageForRow(r)} alt="Assigned product image" className="h-20 w-24 object-contain rounded border bg-white" /> : <span className="text-xs text-red-600">No image assigned</span>}
                                <label className="block text-[10px] text-blue-600 cursor-pointer mt-1">Upload replacement<input type="file" accept="image/*" className="hidden" onChange={(e) => updateRowImage(r._id, e.target.files?.[0])} /></label>
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-600">Use image from row</label>
                                <select className="input-field !py-1 text-xs w-32" value={r._imageSourceId ?? ''} onChange={(e) => updateRow(r._id, '_imageSourceId', e.target.value === '' ? '' : Number(e.target.value))}>
                                  <option value="">Choose image</option>
                                  {importRows.filter((candidate) => candidate.extractedImageData).map((candidate) => <option key={candidate._id} value={candidate._id}>Page {candidate.sourcePage}: {candidate.productCode || candidate.sourceLabel || candidate.name || 'unreadable caption'}</option>)}
                                </select>
                              </div>
                            </div>
                          </td>
                          <td className="p-1">
                            <input className="input-field !py-1 min-w-40" value={r.name ?? ''} onChange={(e) => updateRow(r._id, 'name', e.target.value)} />
                          </td>
                          <td className="p-1"><input className="input-field !py-1 min-w-32" value={r.productCode ?? ''} onChange={(e) => updateRow(r._id, 'productCode', e.target.value)} /></td>
                          <td className="p-1"><input className="input-field !py-1 w-24" value={r.size ?? ''} onChange={(e) => updateRow(r._id, 'size', e.target.value)} /></td>
                          <td className="p-1">
                            <input className="input-field !py-1" value={r.category ?? ''} onChange={(e) => updateRow(r._id, 'category', e.target.value)} />
                          </td>
                          <td className="p-1">
                            <input type="number" step="0.01" className="input-field !py-1" value="" placeholder="Blank" disabled />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button
                type="button"
                onClick={handleImportSave}
                disabled={selectedRows.length === 0 || importLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {importLoading && importRows.length > 0 ? 'Uploading images and adding...' : `Add All Products (${selectedRows.length})`}
              </button>
            </div>
          </div>
        )}

        {(mode === 'single' || product) && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block"><span className="block text-gray-700 font-medium mb-1">Size</span><input type="text" name="size" value={formData.size} onChange={handleChange} className="input-field w-full" placeholder="e.g. 20 mm, Medium" /></label>
          <ImageUpload value={formData.imageUrl} onChange={handleImageChange} label="Product Image" />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Name</label>
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
            <select
              value={selectedCategoryId}
              onChange={handleCategorySelect}
              className="input-field"
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value={ADD_NEW}>+ Add new category</option>
            </select>
            {selectedCategoryId && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Delete category
                </button>
              </div>
            )}
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
              <label className="block text-gray-700 font-medium mb-1">Price</label>
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
            <label className="block text-gray-700 font-medium mb-1">Stock</label>
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
        )}
      </div>

      {showBrandModal && (
        <BrandModal
          onCreated={handleBrandCreated}
          onClose={() => setShowBrandModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onCreated={handleCategoryCreated}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  )
}
