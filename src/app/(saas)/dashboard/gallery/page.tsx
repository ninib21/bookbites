'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Star, Image as ImageIcon, X } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  isFeatured: boolean
  sortOrder: number
}

const categories = ['Cakes', 'Cupcakes', 'Desserts', 'Catering', 'Custom Orders', 'Other']

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', category: 'Cakes', isFeatured: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/dashboard/gallery')
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.title || !form.imageUrl) return
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setItems(prev => [data.item, ...prev])
        setForm({ title: '', description: '', imageUrl: '', category: 'Cakes', isFeatured: false })
        setShowForm(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch(`/api/dashboard/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/dashboard/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      })
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, isFeatured: !i.isFeatured } : i))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-muted">Loading gallery...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Gallery</h1>
          <p className="text-muted text-sm mt-1">Manage your photo gallery to showcase your work</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-300 text-white rounded-lg text-sm font-semibold hover:bg-primary-400 transition-colors"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal">New Gallery Image</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="e.g. Wedding Cake"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Image URL *</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="Brief description of the item"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.isFeatured}
                onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                className="rounded border-gray-300 text-primary-300 focus:ring-primary-300"
              />
              <label htmlFor="featured" className="text-sm text-charcoal">Mark as featured</label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-charcoal">Cancel</button>
            <button
              onClick={handleAdd}
              disabled={saving || !form.title || !form.imageUrl}
              className="px-4 py-2 bg-primary-300 text-white rounded-lg text-sm font-semibold hover:bg-primary-400 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Add Image'}
            </button>
          </div>
        </div>
      )}

      {/* Gallery grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-charcoal mb-1">No gallery images yet</h3>
          <p className="text-muted text-sm">Add your first image to start showcasing your work</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon size={32} className="text-gray-300" />
                  </div>
                )}
                {item.isFeatured && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} /> Featured
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={`p-1.5 rounded-lg shadow-sm ${item.isFeatured ? 'bg-yellow-400 text-yellow-900' : 'bg-white text-gray-500 hover:text-yellow-500'}`}
                  >
                    <Star size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white text-gray-500 hover:text-red-500 rounded-lg shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-charcoal text-sm">{item.title}</h3>
                {item.description && <p className="text-muted text-xs mt-1 line-clamp-2">{item.description}</p>}
                <span className="inline-block mt-2 text-xs bg-primary-50 text-primary-300 px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
