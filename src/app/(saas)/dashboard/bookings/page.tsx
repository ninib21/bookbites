'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, Eye, Loader2 } from 'lucide-react'

interface Booking {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  eventType: string
  eventDate: string
  guestCount: number
  status: string
  paymentStatus: string
  totalPrice: number | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
  DECLINED: 'bg-red-100 text-red-700',
}

const paymentColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  AWAITING_PAYMENT: 'bg-amber-100 text-amber-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [paymentFilter, setPaymentFilter] = useState('ALL')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter, paymentFilter])

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (paymentFilter !== 'ALL') params.set('paymentStatus', paymentFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/dashboard/bookings?${params}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) setBookings(data.data || data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '--'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Bookings</h1>
          <p className="text-sm text-muted mt-1">Manage your event bookings and reservations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search by name, email, or reference..." value={search}
              onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option value="ALL">All Payments</option>
            <option value="PENDING">Payment Pending</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="SUBMITTED">Payment Submitted</option>
            <option value="APPROVED">Payment Approved</option>
            <option value="CONFIRMED">Payment Confirmed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary-300 mx-auto" /></div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-charcoal mb-1">No bookings yet</h3>
            <p className="text-sm text-muted">Share your booking page link to start receiving bookings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Reference</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Event</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4"><span className="font-mono text-sm text-primary-300 font-medium">{booking.reference}</span></td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-charcoal">{booking.customerName}</p>
                      <p className="text-xs text-muted">{booking.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-charcoal">{booking.eventType}</span>
                      <span className="text-xs text-muted ml-1">({booking.guestCount} guests)</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-charcoal">{formatDate(booking.eventDate)}</td>
                    <td className="px-5 py-4 text-sm font-medium text-charcoal">{formatCurrency(booking.totalPrice)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${paymentColors[booking.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {booking.paymentStatus.replace('_', ' ')}
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
