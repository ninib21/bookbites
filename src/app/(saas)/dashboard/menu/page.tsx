'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Search, Tag, DollarSign, X } from 'lucide-react'

interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
  image: string | null
  sortOrder: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  image: string | null
  sortOrder: number
  tags: string
}

type TabType = 'services' | 'menu'

export default function MenuPage() {
  const [session, setSession] = useState<{businessId: string; userId: string} | null>(null)

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (d.success) setSession({ businessId: d.businessId, userId: d.userId })
    }).catch(() => {})
  }, [])
  const [activeTab, setActiveTab] = useState<TabType>('services')
  const [services, setServices] = useState<ServiceItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Form state
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formTags, setFormTags] = useState('')
  const [formActive, setFormActive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session?.businessId) fetchData()
  }, [session])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [servicesRes, menuRes] = await Promise.all([
        fetch('/api/dashboard/services'),
        fetch('/api/dashboard/menu'),
      ])
      if (servicesRes.ok) {
        const data = await servicesRes.json()
        if (data.success) setServices(data.services)
      }
      if (menuRes.ok) {
        const data = await menuRes.json()
        if (data.success) setMenuItems(data.items)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormName('')
    setFormDesc('')
    setFormPrice('')
    setFormCategory('')
    setFormTags('')
    setFormActive(true)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEditService = (s: ServiceItem) => {
    setEditingId(s.id)
    setFormName(s.name)
    setFormDesc(s.description)
    setFormPrice(s.price.toString())
    setFormCategory(s.category)
    setFormActive(s.isActive)
    setShowForm(true)
  }

  const handleEditMenuItem = (m: MenuItem) => {
    setEditingId(m.id)
    setFormName(m.name)
    setFormDesc(m.description)
    setFormPrice(m.price.toString())
    setFormCategory(m.category)
    setFormTags(m.tags || '')
    setFormActive(m.isAvailable)
    setShowForm(true)
  }

  const handleSaveService = async () => {
    if (!formName || !formPrice) {
      setToast({ message: 'Name and price are required', type: 'error' })
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/dashboard/services/${editingId}` : '/api/dashboard/services'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          description: formDesc,
          price: parseFloat(formPrice),
          category: formCategory || 'General',
          isActive: formActive,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setToast({ message: editingId ? 'Service updated!' : 'Service created!', type: 'success' })
        resetForm()
        fetchData()
      } else {
        setToast({ message: data.error || 'Failed to save', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMenuItem = async () => {
    if (!formName || !formPrice) {
      setToast({ message: 'Name and price are required', type: 'error' })
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/dashboard/menu/${editingId}` : '/api/dashboard/menu'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          description: formDesc,
          price: parseFloat(formPrice),
          category: formCategory || 'General',
          isAvailable: formActive,
          tags: formTags,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setToast({ message: editingId ? 'Menu item updated!' : 'Menu item created!', type: 'success' })
        resetForm()
        fetchData()
      } else {
        setToast({ message: data.error || 'Failed to save', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/dashboard/services/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setToast({ message: 'Service deleted', type: 'success' })
        fetchData()
      }
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return
    try {
      const res = await fetch(`/api/dashboard/menu/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setToast({ message: 'Menu item deleted', type: 'success' })
        fetchData()
      }
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
  }

  const toggleServiceActive = async (s: ServiceItem) => {
    try {
      await fetch(`/api/dashboard/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !s.isActive }),
      })
      fetchData()
    } catch {}
  }

  const toggleMenuAvailable = async (m: MenuItem) => {
    try {
      await fetch(`/api/dashboard/menu/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !m.isAvailable }),
      })
      fetchData()
    } catch {}
  }

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredMenu = menuItems.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category
  const serviceCategories = [...new Set(filteredServices.map((s) => s.category))]
  const menuCategories = [...new Set(filteredMenu.map((m) => m.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary-300" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Menu & Services</h1>
          <p className="text-sm text-muted mt-1">Manage your services, menu items, and pricing</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-300 text-white rounded-lg font-semibold text-sm hover:bg-primary-400 transition-colors"
        >
          <Plus size={16} /> Add {activeTab === 'services' ? 'Service' : 'Menu Item'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'services' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'
          }`}
        >
          Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'menu' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'
          }`}
        >
          Menu Items ({menuItems.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-charcoal">
            {editingId ? 'Edit' : 'New'} {activeTab === 'services' ? 'Service' : 'Menu Item'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Custom Cake, Candy Table"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Price *</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
              <input type="text" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g., Cakes, Packages"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            {activeTab === 'menu' && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Tags</label>
                <input type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g., gluten-free, vegan"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)}
              rows={2} placeholder="Brief description of this item..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-charcoal">{activeTab === 'services' ? 'Active' : 'Available'}</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={activeTab === 'services' ? handleSaveService : handleSaveMenuItem}
              disabled={saving}
              className="px-6 py-2 bg-primary-300 text-white rounded-lg font-semibold text-sm hover:bg-primary-400 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={resetForm} className="px-6 py-2 border border-gray-200 text-charcoal rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {activeTab === 'services' ? (
        <div className="space-y-6">
          {serviceCategories.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Tag size={32} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No services yet</p>
              <p className="text-sm">Add your first service to get started.</p>
            </div>
          )}
          {serviceCategories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">{cat}</h3>
              <div className="space-y-2">
                {filteredServices.filter((s) => s.category === cat).map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-charcoal text-sm">{s.name}</h4>
                        {!s.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                      </div>
                      {s.description && <p className="text-xs text-muted mt-0.5 truncate">{s.description}</p>}
                    </div>
                    <div className="text-sm font-bold text-charcoal">${s.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleServiceActive(s)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={s.isActive ? 'Deactivate' : 'Activate'}>
                        {s.isActive ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                      </button>
                      <button onClick={() => handleEditService(s)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Pencil size={16} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDeleteService(s.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {menuCategories.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Tag size={32} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No menu items yet</p>
              <p className="text-sm">Add your first menu item to get started.</p>
            </div>
          )}
          {menuCategories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">{cat}</h3>
              <div className="space-y-2">
                {filteredMenu.filter((m) => m.category === cat).map((m) => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-charcoal text-sm">{m.name}</h4>
                        {!m.isAvailable && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Unavailable</span>}
                      </div>
                      {m.description && <p className="text-xs text-muted mt-0.5 truncate">{m.description}</p>}
                      {m.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {JSON.parse(m.tags || '[]').map((tag: string) => (
                            <span key={tag} className="text-xs bg-primary-50 text-primary-300 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-bold text-charcoal">${m.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleMenuAvailable(m)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={m.isAvailable ? 'Mark unavailable' : 'Mark available'}>
                        {m.isAvailable ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                      </button>
                      <button onClick={() => handleEditMenuItem(m)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Pencil size={16} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDeleteMenuItem(m.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
