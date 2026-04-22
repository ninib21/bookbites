'use client'

import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Save, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#D4A5B8')

  const [allowOnlineBooking, setAllowOnlineBooking] = useState(true)
  const [allowCustomOrders, setAllowCustomOrders] = useState(true)
  const [allowCatering, setAllowCatering] = useState(false)
  const [requireDeposit, setRequireDeposit] = useState(false)
  const [depositPercentage, setDepositPercentage] = useState(50)

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(data => {
      if (data.success) fetchBusinessDetails()
    })
  }, [])

  const fetchBusinessDetails = async () => {
    try {
      const res = await fetch('/api/dashboard/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.business) {
          const b = data.business
          setBusinessName(b.name || '')
          setDescription(b.description || '')
          setPhone(b.phone || '')
          setAddress(b.address || '')
          setCity(b.city || '')
          setState(b.state || '')
          setZipCode(b.zipCode || '')
          setPrimaryColor(b.primaryColor || '#D4A5B8')
          if (b.settings) {
            setAllowOnlineBooking(b.settings.allowOnlineBooking)
            setAllowCustomOrders(b.settings.allowCustomOrders)
            setAllowCatering(b.settings.allowCatering)
            setRequireDeposit(b.settings.requireDeposit)
            setDepositPercentage(b.settings.depositPercentage)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName, description, phone, address, city, state, zipCode, primaryColor,
          allowOnlineBooking, allowCustomOrders, allowCatering, requireDeposit, depositPercentage,
        }),
      })
      const data = await res.json()
      setMessage(data.success ? 'Settings saved successfully!' : (data.error || 'Failed to save settings.'))
    } catch {
      setMessage('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Settings</h1>
          <p className="text-sm text-muted mt-1">Manage your business profile and preferences.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-300 text-white text-sm font-semibold rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-lg ${message.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <SettingsIcon size={18} /> Business Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">ZIP</label>
              <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-charcoal mb-4">Booking Settings</h2>
        <div className="space-y-4">
          <ToggleSetting label="Allow Online Bookings" description="Let clients book events directly from your public page" checked={allowOnlineBooking} onChange={setAllowOnlineBooking} />
          <ToggleSetting label="Allow Custom Orders" description="Let clients place custom cake and treat orders online" checked={allowCustomOrders} onChange={setAllowCustomOrders} />
          <ToggleSetting label="Catering Services" description="Enable catering-specific features and booking options" checked={allowCatering} onChange={setAllowCatering} />
          <ToggleSetting label="Require Deposit" description="Require a deposit payment when clients book" checked={requireDeposit} onChange={setRequireDeposit} />
          {requireDeposit && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-charcoal mb-1.5">Deposit Percentage</label>
              <div className="flex items-center gap-2">
                <input type="number" value={depositPercentage} onChange={(e) => setDepositPercentage(parseInt(e.target.value) || 0)}
                  min={10} max={100} className="w-20 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <span className="text-sm text-muted">%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSetting({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
      <div>
        <p className="font-medium text-charcoal text-sm">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary-300' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
