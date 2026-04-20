'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Mail, Calendar, Star, Settings, LogOut, Menu, X, DollarSign, Image, Package } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Mail },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/payments', label: 'Payments', icon: DollarSign },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(c => c.trim().startsWith('admin_authenticated='))
    
    if (!authCookie || !pathname?.startsWith('/admin/login')) {
      setIsAuthenticated(true)
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/admin/login')
  }

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="admin-layout">
      {/* Mobile sidebar toggle */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Pretty Party Sweets</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        {children}
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }

        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          width: 45px;
          height: 45px;
          background: white;
          border: none;
          border-radius: var(--radius-md);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 30px 25px;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h2 {
          font-size: 24px;
          margin: 0 0 5px;
          color: var(--text-primary);
        }

        .sidebar-header p {
          font-size: 14px;
          color: var(--color-primary);
          margin: 0;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 25px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--color-secondary);
          color: var(--color-primary);
          border-left-color: var(--color-primary);
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 20px 0;
          border-top: 1px solid var(--border-color);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 25px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
        }

        .logout-btn:hover {
          background: #fff0f0;
          color: #d32f2f;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .sidebar-toggle {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0;
            padding: 80px 20px 20px;
          }
        }
      `}</style>
    </div>
  )
}
