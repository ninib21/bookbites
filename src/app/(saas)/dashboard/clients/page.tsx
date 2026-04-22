'use client'

import { useEffect, useState } from 'react'
import { Search, Users, Plus, Mail, Phone, Loader2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  tags: string | null
  source: string
  lifetimeValue: number
  totalBookings: number
  totalOrders: number
  lastContactAt: string | null
  createdAt: string
}

const tagColors: Record<string, string> = {
  VIP: 'bg-amber-100 text-amber-700',
  REPEAT: 'bg-green-100 text-green-700',
  CORPORATE: 'bg-blue-100 text-blue-700',
  NEW: 'bg-purple-100 text-purple-700',
  LEAD: 'bg-gray-100 text-gray-600',
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('ALL')

  useEffect(() => { fetchClients() }, [tagFilter])

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams()
      if (tagFilter !== 'ALL') params.set('tag', tagFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/dashboard/clients?${params}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) setClients(data.data || data.clients || [])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  const parseTags = (tags: string | null): string[] => { if (!tags) return []; try { return JSON.parse(tags) } catch { return [] } }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Clients</h1>
          <p className="text-sm text-muted mt-1">Your customer database and CRM.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-300 text-white text-sm font-semibold rounded-lg hover:bg-primary-400 transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchClients()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option value="ALL">All Tags</option>
            <option value="VIP">VIP</option>
            <option value="REPEAT">Repeat</option>
            <option value="CORPORATE">Corporate</option>
            <option value="NEW">New</option>
            <option value="LEAD">Lead</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary-300 mx-auto" /></div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-semibold text-charcoal mb-1">No clients yet</h3>
          <p className="text-sm text-muted">Clients will be added automatically when they book or place orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const tags = parseTags(client.tags)
            return (
              <div key={client.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-primary-300 font-semibold">{client.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal text-sm">{client.name}</h3>
                    <p className="text-xs text-muted">{client.source}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted"><Mail size={12} /> {client.email}</div>
                  {client.phone && <div className="flex items-center gap-2 text-xs text-muted"><Phone size={12} /> {client.phone}</div>}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tags.map((tag) => (
                      <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm font-bold text-charcoal">{formatCurrency(client.lifetimeValue)}</p>
                    <p className="text-[10px] text-muted">LTV</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-charcoal">{client.totalBookings}</p>
                    <p className="text-[10px] text-muted">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-charcoal">{client.totalOrders}</p>
                    <p className="text-[10px] text-muted">Orders</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
