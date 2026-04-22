'use client'

import { useEffect, useState } from 'react'
import { Search, Cake, Eye, Package, Loader2 } from 'lucide-react'

interface Order {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  orderType: string
  status: string
  total: number
  pickupDate: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  RECEIVED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  READY: 'bg-green-100 text-green-700',
  PICKED_UP: 'bg-gray-100 text-gray-600',
  DELIVERED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => { fetchOrders() }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/dashboard/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) setOrders(data.data || data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Custom Orders</h1>
        <p className="text-sm text-muted mt-1">Manage custom cake orders, treat boxes, and specialty items.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search orders..." value={search}
              onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option value="ALL">All Status</option>
            <option value="RECEIVED">Received</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="READY">Ready</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary-300 mx-auto" /></div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Cake size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-charcoal mb-1">No orders yet</h3>
            <p className="text-sm text-muted">Custom orders will appear here when clients place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Reference</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Pickup/Delivery</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4"><span className="font-mono text-sm text-primary-300 font-medium">{order.reference}</span></td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-charcoal">{order.customerName}</p>
                      <p className="text-xs text-muted">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5"><Package size={14} className="text-muted" /><span className="text-sm text-charcoal capitalize">{order.orderType}</span></div>
                    </td>
                    <td className="px-5 py-4 text-sm text-charcoal">{order.pickupDate ? formatDate(order.pickupDate) : '--'}</td>
                    <td className="px-5 py-4 text-sm font-medium text-charcoal">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
