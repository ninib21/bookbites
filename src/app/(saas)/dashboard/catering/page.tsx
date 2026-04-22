'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChefHat, ToggleLeft, ToggleRight, Save, Loader2, X, Plus, Trash2 } from 'lucide-react'

interface CateringSettings {
  isEnabled: boolean
  minGuests: number
  maxGuests: number
  perHeadPrice: number
  includesStaff: boolean
  includesDelivery: boolean
  deliveryRadius: number
  description: string
  packages: CateringPackage[]
}

interface CateringPackage {
  id?: string
  name: string
  description: string
  pricePerHead: number
  minGuests: number
  includes: string
}

const defaultSettings: CateringSettings = {
  isEnabled: false,
  minGuests: 20,
  maxGuests: 500,
  perHeadPrice: 0,
  includesStaff: false,
  includesDelivery: false,
  deliveryRadius: 25,
  description: '',
  packages: [],
}

export default function CateringPage() {
  const [settings, setSettings] = useState<CateringSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/dashboard/catering')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.settings) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
      }
    } catch (err) {
      console.error('Failed to fetch catering settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/catering', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        showToast('Catering settings saved!', 'success')
      } else {
        showToast(data.error || 'Failed to save', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  const addPackage = () => {
    setSettings({
      ...settings,
      packages: [
        ...settings.packages,
        { name: '', description: '', pricePerHead: 0, minGuests: 20, includes: '[]' },
      ],
    })
  }

  const updatePackage = (index: number, field: keyof CateringPackage, value: string | number) => {
    const updated = [...settings.packages]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, packages: updated })
  }

  const removePackage = (index: number) => {
    setSettings({ ...settings, packages: settings.packages.filter((_, i) => i !== index) })
  }

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
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <ChefHat size={28} className="text-primary-300" /> Catering
          </h1>
          <p className="text-sm text-muted mt-1">Configure your catering services and packages</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-300 text-white rounded-lg font-semibold text-sm hover:bg-primary-400 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings
        </button>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-charcoal">Enable Catering</h3>
            <p className="text-sm text-muted mt-0.5">Allow clients to book catering services from your booking page</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
            className="flex items-center"
          >
            {settings.isEnabled ? (
              <ToggleRight size={48} className="text-primary-300" />
            ) : (
              <ToggleLeft size={48} className="text-gray-300" />
            )}
          </button>
        </div>

        {settings.isEnabled && (
          <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Catering Description</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={3}
                placeholder="Describe your catering services, what's included, specialties..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Min Guests</label>
                <input
                  type="number"
                  value={settings.minGuests}
                  onChange={(e) => setSettings({ ...settings, minGuests: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Max Guests</label>
                <input
                  type="number"
                  value={settings.maxGuests}
                  onChange={(e) => setSettings({ ...settings, maxGuests: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Default $/Head</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.perHeadPrice}
                  onChange={(e) => setSettings({ ...settings, perHeadPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Delivery Radius (mi)</label>
                <input
                  type="number"
                  value={settings.deliveryRadius}
                  onChange={(e) => setSettings({ ...settings, deliveryRadius: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includesStaff}
                  onChange={(e) => setSettings({ ...settings, includesStaff: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-charcoal">Includes Staff</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includesDelivery}
                  onChange={(e) => setSettings({ ...settings, includesDelivery: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-charcoal">Includes Delivery</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Catering Packages */}
      {settings.isEnabled && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-charcoal">Catering Packages</h3>
              <p className="text-sm text-muted mt-0.5">Define tiered pricing packages for your catering services</p>
            </div>
            <button
              onClick={addPackage}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-300 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Package
            </button>
          </div>

          {settings.packages.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <ChefHat size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No catering packages yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.packages.map((pkg, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-charcoal text-sm">Package {index + 1}</h4>
                    <button onClick={() => removePackage(index)} className="p-1 hover:bg-red-50 rounded">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(index, 'name', e.target.value)}
                        placeholder="e.g., Basic, Premium"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Price Per Head</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pkg.pricePerHead}
                        onChange={(e) => updatePackage(index, 'pricePerHead', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Min Guests</label>
                      <input
                        type="number"
                        value={pkg.minGuests}
                        onChange={(e) => updatePackage(index, 'minGuests', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Description</label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) => updatePackage(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="What's included in this package..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
