'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PaymentReviewActions from '@/components/admin/PaymentReviewActions'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    // TODO: Create API endpoint for single booking
    // Mock data for now
    setBooking({
      id: params.id,
      reference: 'BK-ABC123',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@email.com',
      customerPhone: '(555) 123-4567',
      eventType: 'Birthday',
      eventDate: new Date('2024-03-15'),
      eventTime: '2:00 PM',
      venue: '123 Main St, City',
      guestCount: 50,
      packageName: 'Celebration Plus',
      customizations: 'Pink and gold theme',
      status: 'pending',
      paymentStatus: 'awaiting_payment',
      totalPrice: 599,
      adminNotes: '',
      createdAt: new Date(Date.now() - 86400000),
      events: [
        { id: '1', status: 'pending', note: 'Booking created', createdAt: new Date(Date.now() - 86400000) },
      ],
    })
    setLoading(false)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          adminNotes: adminNotes || undefined,
        }),
      })

      if (response.ok) {
        fetchBooking()
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handlePaymentUpdate = async (paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      })

      if (response.ok) {
        fetchBooking()
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading booking details...</div>
  }

  if (!booking) {
    return <div className="error">Booking not found</div>
  }

  return (
    <div className="booking-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          ← Back
        </button>
        <h1>Booking {booking.reference}</h1>
      </div>

      <div className="detail-grid">
        {/* Status & Actions */}
        <Card padding="lg">
          <h2>Status & Actions</h2>
          
          <div className="status-section">
            <div className="status-item">
              <span className="label">Booking Status:</span>
              <span className={`status-badge status-${booking.status}`}>
                {booking.status}
              </span>
            </div>
          </div>

          <PaymentReviewActions
            bookingId={booking.id}
            paymentStatus={booking.paymentStatus}
            paymentMethod={booking.paymentMethod}
            paymentReference={booking.paymentReference}
            paymentSubmittedAt={booking.paymentSubmittedAt}
            paymentReviewNote={booking.paymentReviewNote}
            onPaymentUpdate={fetchBooking}
          />

          {booking.status === 'pending' && (
            <div className="action-buttons">
              <Button
                onClick={() => handleStatusUpdate('confirmed')}
                variant="primary"
                fullWidth
              >
                <CheckCircle size={18} /> Approve Booking
              </Button>
              <Button
                onClick={() => handleStatusUpdate('cancelled')}
                variant="secondary"
                fullWidth
              >
                <XCircle size={18} /> Decline Booking
              </Button>
            </div>
          )}

          <div className="notes-section">
            <label>Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={4}
            />
          </div>
        </Card>

        {/* Customer Information */}
        <Card padding="lg">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{booking.customerName}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{booking.customerEmail}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{booking.customerPhone}</span>
            </div>
          </div>
        </Card>

        {/* Event Details */}
        <Card padding="lg">
          <h2>Event Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Event Type:</span>
              <span className="value">{booking.eventType}</span>
            </div>
            <div className="info-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(booking.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Time:</span>
              <span className="value">{booking.eventTime}</span>
            </div>
            <div className="info-item">
              <span className="label">Venue:</span>
              <span className="value">{booking.venue}</span>
            </div>
            <div className="info-item">
              <span className="label">Guest Count:</span>
              <span className="value">{booking.guestCount}</span>
            </div>
            <div className="info-item">
              <span className="label">Package:</span>
              <span className="value">{booking.packageName}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Price:</span>
              <span className="value price">${booking.totalPrice}</span>
            </div>
            {booking.customizations && (
              <div className="info-item full-width">
                <span className="label">Customizations:</span>
                <span className="value">{booking.customizations}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Status Timeline */}
        <Card padding="lg">
          <h2>Status Timeline</h2>
          <div className="timeline">
            {booking.events.map((event: any) => (
              <div key={event.id} className="timeline-item">
                <div className="timeline-icon">
                  {event.status === 'confirmed' ? (
                    <CheckCircle size={20} />
                  ) : event.status === 'cancelled' ? (
                    <XCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{event.note}</div>
                  <div className="timeline-time">
                    {new Date(event.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style jsx>{`
        .booking-detail-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading, .error {
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }

        .page-header {
          margin-bottom: 30px;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .page-header h1 {
          font-size: 36px;
          margin: 0;
          color: var(--text-primary);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .detail-grid :global(h2) {
          font-size: 22px;
          margin: 0 0 20px;
          color: var(--text-primary);
        }

        .status-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-size: 15px;
          color: var(--text-secondary);
        }

        .value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .price {
          font-size: 24px;
          color: var(--color-primary);
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 12px;
          font-size: 14px;
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

        .payment-badge {
          padding: 6px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }

        .payment-awaiting_payment {
          background: #fff3cd;
          color: #856404;
        }

        .payment-paid {
          background: #d4edda;
          color: #155724;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .notes-section {
          margin-top: 20px;
        }

        .notes-section label {
          display: block;
          margin-bottom: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .notes-section textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .info-grid {
          display: grid;
          gap: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
        }

        .info-item.full-width {
          flex-direction: column;
          gap: 8px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timeline-item {
          display: flex;
          gap: 15px;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          background: var(--color-secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .timeline-time {
          font-size: 14px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
