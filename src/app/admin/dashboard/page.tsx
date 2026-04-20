'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { Mail, Calendar, TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalBookings: 0,
    pendingBookings: 0,
    newLeads: 0,
    pendingPayments: 0,
  })

  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [pendingPayments, setPendingPayments] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchPendingPayments()
  }, [])

  const fetchStats = async () => {
    // TODO: Create API endpoints for stats
    // For now, using mock data
    setStats({
      totalLeads: 24,
      totalBookings: 12,
      pendingBookings: 5,
      newLeads: 3,
      pendingPayments: 0,
    })

    setRecentLeads([
      { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', eventType: 'Birthday', createdAt: new Date() },
      { id: '2', name: 'Mike Chen', email: 'mike@email.com', eventType: 'Wedding', createdAt: new Date(Date.now() - 86400000) },
      { id: '3', name: 'Emily Davis', email: 'emily@email.com', eventType: 'Corporate', createdAt: new Date(Date.now() - 172800000) },
    ])

    setRecentBookings([
      { id: '1', reference: 'BK-ABC123', customerName: 'Sarah Johnson', eventDate: new Date(), status: 'pending' },
      { id: '2', reference: 'BK-DEF456', customerName: 'Mike Chen', eventDate: new Date(Date.now() + 604800000), status: 'confirmed' },
    ])
  }

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments/pending')
      const data = await response.json()
      
      if (data.success) {
        setPendingPayments(data.bookings)
        setStats(prev => ({ ...prev, pendingPayments: data.count }))
      }
    } catch (error) {
      console.error('Failed to fetch pending payments:', error)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card padding="lg">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Mail size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalLeads}</div>
              <div className="stat-label">Total Leads</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="stat-card">
            <div className="stat-icon green">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.pendingBookings}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="stat-card">
            <div className="stat-icon pink">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.newLeads}</div>
              <div className="stat-label">New This Week</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="stat-card">
            <div className="stat-icon gold">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.pendingPayments}</div>
              <div className="stat-label">Payments to Review</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Payments Alert */}
      {pendingPayments.length > 0 && (
        <div className="pending-payments-alert">
          <Card padding="lg" className="alert-card">
            <div className="alert-header">
              <div className="alert-icon">
                <AlertCircle size={24} />
              </div>
              <div className="alert-content">
                <h2>Payments Awaiting Review</h2>
                <p>{pendingPayments.length} payment submission{pendingPayments.length !== 1 ? 's' : ''} need{pendingPayments.length === 1 ? 's' : ''} your attention</p>
              </div>
              <a href="/admin/payments" className="alert-action">
                Review Payments →
              </a>
            </div>
            <div className="pending-list">
              {pendingPayments.slice(0, 3).map((booking) => (
                <div key={booking.id} className="pending-item">
                  <span className="pending-ref">{booking.reference}</span>
                  <span className="pending-name">{booking.customerName}</span>
                  <span className="pending-date">
                    {new Date(booking.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {pendingPayments.length > 3 && (
                <div className="pending-more">
                  +{pendingPayments.length - 3} more...
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="activity-grid">
        <Card padding="lg">
          <h2>Recent Leads</h2>
          <div className="activity-list">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="activity-item">
                <div className="activity-icon">
                  <Mail size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">{lead.name}</div>
                  <div className="activity-meta">
                    {lead.eventType} • {lead.email}
                  </div>
                </div>
                <div className="activity-time">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <a href="/admin/leads" className="view-all">View All Leads →</a>
        </Card>

        <Card padding="lg">
          <h2>Recent Bookings</h2>
          <div className="activity-list">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="activity-item">
                <div className="activity-icon">
                  <Calendar size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">{booking.customerName}</div>
                  <div className="activity-meta">
                    {booking.reference} • {new Date(booking.eventDate).toLocaleDateString()}
                  </div>
                </div>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
          <a href="/admin/bookings" className="view-all">View All Bookings →</a>
        </Card>
      </div>

      <style jsx>{`
        .dashboard-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-size: 36px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .dashboard-header p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .stat-icon.green {
          background: linear-gradient(135deg, #11998e, #38ef7d);
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .stat-icon.pink {
          background: linear-gradient(135deg, #ff5fa2, #ff8a5c);
        }

        .stat-icon.gold {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .pending-payments-alert {
          margin-bottom: 30px;
        }

        .alert-card {
          background: linear-gradient(135deg, #fff9e6, #fff3cd);
          border: 1px solid #ffc107;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .alert-icon {
          width: 50px;
          height: 50px;
          background: #ffc107;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #856404;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
        }

        .alert-content h2 {
          font-size: 22px;
          margin: 0 0 5px;
          color: #856404;
        }

        .alert-content p {
          margin: 0;
          color: #856404;
          opacity: 0.8;
        }

        .alert-action {
          padding: 12px 24px;
          background: #ffc107;
          color: #856404;
          font-weight: 600;
          text-decoration: none;
          border-radius: var(--radius-md);
          white-space: nowrap;
        }

        .alert-action:hover {
          background: #e0a800;
        }

        .pending-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid rgba(133, 100, 4, 0.2);
        }

        .pending-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: var(--radius-md);
          font-size: 14px;
        }

        .pending-ref {
          font-weight: 600;
          color: #856404;
        }

        .pending-name {
          color: var(--text-primary);
        }

        .pending-date {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .pending-more {
          text-align: center;
          padding: 10px;
          color: #856404;
          font-size: 14px;
          font-style: italic;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .activity-grid :global(h2) {
          font-size: 22px;
          margin: 0 0 20px;
          color: var(--text-primary);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .activity-meta {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .activity-time {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }

        .view-all {
          display: block;
          text-align: center;
          padding: 12px;
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
          border-top: 1px solid var(--border-color);
        }

        .view-all:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .activity-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
