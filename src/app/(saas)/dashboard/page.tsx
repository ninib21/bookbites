'use client'

import { useState, useEffect } from 'react'
import { Calendar, Package, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowRight, Bell } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  totalRevenue: number
  activeClients: number
  recentBookings: Array<{
    id: string
    reference: string
    customerName: string
    eventType: string
    eventDate: string
    status: string
    totalPrice: number | null
  }>
  notifications: Array<{
    id: string
    title: string
    message: string
    createdAt: string
  }>
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) {
        const data = await res.json()
        if (data.success) setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-28" />
          ))}
        </div>
      </div>
    )
  }

  const s = stats || { totalBookings: 0, pendingBookings: 0, totalRevenue: 0, activeClients: 0, recentBookings: [], notifications: [] }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Welcome back!</h1>
        <p className="text-sm text-muted mt-1">Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Total Bookings</span>
            <Calendar size={16} className="text-primary-300" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{s.totalBookings}</p>
          <Link href="/dashboard/bookings" className="text-xs text-primary-300 font-medium mt-1 inline-flex items-center gap-1">
            View all <ArrowRight size={10} />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Pending</span>
            <Package size={16} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{s.pendingBookings}</p>
          <Link href="/dashboard/bookings?status=PENDING" className="text-xs text-primary-300 font-medium mt-1 inline-flex items-center gap-1">
            Review <ArrowRight size={10} />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Revenue</span>
            <DollarSign size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">${s.totalRevenue.toFixed(2)}</p>
          <Link href="/dashboard/finance" className="text-xs text-primary-300 font-medium mt-1 inline-flex items-center gap-1">
            Finance <ArrowRight size={10} />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Clients</span>
            <Users size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{s.activeClients}</p>
          <Link href="/dashboard/clients" className="text-xs text-primary-300 font-medium mt-1 inline-flex items-center gap-1">
            CRM <ArrowRight size={10} />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="text-xs text-primary-300 font-medium">View all</Link>
          </div>
          {s.recentBookings.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {s.recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{b.customerName}</p>
                    <p className="text-xs text-muted">{b.eventType} &middot; {new Date(b.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    {b.totalPrice && <p className="text-sm font-bold text-charcoal">${b.totalPrice.toFixed(2)}</p>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Notifications</h3>
            <Link href="/dashboard/notifications" className="text-xs text-primary-300 font-medium">View all</Link>
          </div>
          {s.notifications.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No notifications</p>
          ) : (
            <div className="space-y-3">
              {s.notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <Bell size={14} className="text-primary-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{n.title}</p>
                    <p className="text-xs text-muted">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-charcoal mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/dashboard/menu" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
            <Calendar size={20} className="text-primary-300" />
            <span className="text-xs font-medium text-charcoal">Add Service</span>
          </Link>
          <Link href="/dashboard/bookings" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
            <Package size={20} className="text-primary-300" />
            <span className="text-xs font-medium text-charcoal">View Bookings</span>
          </Link>
          <Link href="/dashboard/clients" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
            <Users size={20} className="text-primary-300" />
            <span className="text-xs font-medium text-charcoal">Add Client</span>
          </Link>
          <Link href="/dashboard/settings" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
            <DollarSign size={20} className="text-primary-300" />
            <span className="text-xs font-medium text-charcoal">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
