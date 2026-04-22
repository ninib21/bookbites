'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, createContext, useContext } from 'react'
import {
  LayoutDashboard, Calendar, Package, Users, ChefHat, Menu as MenuIcon,
  Settings, CreditCard, Bell, LogOut, DollarSign, X, Tag, BookOpen
} from 'lucide-react'

interface SessionData {
  businessId: string
  userId: string
  businessName: string
  slug: string
  email: string
  plan: string
}

const SessionContext = createContext<SessionData | null>(null)

export function useSession() {
  return useContext(SessionContext)
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'Custom Orders', href: '/dashboard/orders', icon: Package },
  { label: 'Clients', href: '/dashboard/clients', icon: Users },
  { label: 'Menu & Services', href: '/dashboard/menu', icon: Tag },
  { label: 'Catering', href: '/dashboard/catering', icon: ChefHat },
  { label: 'Finance', href: '/dashboard/finance', icon: DollarSign },
  { label: 'Gallery', href: '/dashboard/gallery', icon: BookOpen },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const result = await res.json()
        if (result.success && result.data) {
          const s = result.data
          setSession({
            businessId: s.businessId,
            userId: s.userId,
            businessName: s.businessName || 'My Business',
            slug: s.businessSlug || '',
            email: s.email || '',
            plan: s.subscriptionTier || 'free',
          })
        } else {
          router.push('/login')
          return
        }
      }
    } catch {
      router.push('/login')
      return
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 bg-primary-300 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <SessionContext.Provider value={session}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-white transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-300 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <span className="font-display text-lg font-bold">BookBites</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-700 rounded">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Business info */}
            <div className="px-5 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white truncate">{session.businessName}</p>
              <p className="text-xs text-gray-400 truncate">{session.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-300/20 text-primary-300'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-700 space-y-1">
              <Link
                href={`/b/${session.slug}`}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
              >
                <BookOpen size={18} />
                View Public Page
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <MenuIcon size={20} className="text-charcoal" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/dashboard/notifications" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={18} className="text-charcoal" />
              </Link>
              <div className="w-8 h-8 bg-primary-300 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{session.businessName.charAt(0)}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-5 lg:p-8 max-w-6xl">
            {children}
          </main>
        </div>
      </div>
    </SessionContext.Provider>
  )
}
