'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  actionUrl: string | null
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/dashboard/notifications')
      if (res.ok) {
        const data = await res.json()
        if (data.success) setNotifications(data.notifications)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/dashboard/notifications/${id}`, { method: 'PUT' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await fetch('/api/dashboard/notifications/mark-all-read', { method: 'PUT' })
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch {}
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary-300" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Bell size={28} className="text-primary-300" /> Notifications
          </h1>
          <p className="text-sm text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-primary-300 hover:text-primary-400 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm">We&apos;ll notify you about new bookings, payments, and more.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-all ${
                n.isRead ? 'border-gray-200' : 'border-primary-200 bg-primary-50/20'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-primary-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-charcoal text-sm">{n.title}</h4>
                  <span className="text-xs text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted mt-0.5">{n.message}</p>
                {n.actionUrl && (
                  <Link href={n.actionUrl} className="inline-flex items-center gap-1 text-xs font-medium text-primary-300 mt-2 hover:text-primary-400">
                    View details <ArrowRight size={12} />
                  </Link>
                )}
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-gray-100 rounded" title="Mark as read">
                  <Check size={14} className="text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
