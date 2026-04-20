'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import PaymentStatusBadge from '@/components/booking/PaymentStatusBadge'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings${filter !== 'all' ? `?status=${filter}` : ''}`)
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh bookings list
        fetchBookings()
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(booking => booking.status === filter)

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Bookings</h1>
        <p>Manage event bookings and payments</p>
      </div>

      <Card padding="lg">
        {/* Header with Export */}
        <div className="card-header">
          <h2>Bookings List</h2>
          <button className="export-btn" onClick={() => window.open(`/api/admin/export/bookings${filter !== 'all' ? `?status=${filter}` : ''}`, '_blank')}>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : (
          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="reference">{booking.reference}</div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="name">{booking.customerName}</div>
                        <div className="email">{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td>{booking.eventType}</td>
                    <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                    <td>{booking.packageName}</td>
                    <td>
                      <div className="amount">${booking.totalPrice}</div>
                    </td>
                    <td>
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="action-btn" onClick={() => alert('View booking details')}>View</button>
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              className="action-btn approve" 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            >
                              Approve
                            </button>
                            <button 
                              className="action-btn decline" 
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="empty-state">
                <p>No bookings found</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <style jsx>{`
        .bookings-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 36px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .page-header p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 20px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header :global(h2) {
          font-size: 22px;
          margin: 0;
          color: var(--text-primary);
        }

        .export-btn {
          padding: 10px 20px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .export-btn:hover {
          background: var(--color-primary-dark);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .table-container {
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table thead {
          background: var(--bg-main);
        }

        .bookings-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 2px solid var(--border-color);
        }

        .bookings-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          color: var(--text-primary);
        }

        .reference {
          font-weight: 600;
          color: var(--color-primary);
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .name {
          font-weight: 600;
        }

        .email {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
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

        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .action-btn:hover {
          background: var(--color-primary-dark);
        }

        .action-btn.approve {
          background: #28a745;
        }

        .action-btn.approve:hover {
          background: #218838;
        }

        .action-btn.decline {
          background: #dc3545;
        }

        .action-btn.decline:hover {
          background: #c82333;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}
