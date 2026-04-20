'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Calendar, User } from 'lucide-react'

export default function PaymentReviewPage() {
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments/pending')
      const data = await response.json()
      
      if (data.success) {
        setPendingPayments(data.bookings)
      }
    } catch (error) {
      console.error('Failed to fetch pending payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async (bookingId: string) => {
    setProcessingId(bookingId)
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.success) {
        // Remove from pending list
        setPendingPayments(prev => prev.filter(b => b.id !== bookingId))
      } else {
        alert(data.message || 'Failed to confirm payment')
      }
    } catch (error) {
      console.error('Failed to confirm payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectPayment = async (bookingId: string) => {
    const reason = prompt('Please enter a reason for rejecting this payment:')
    if (!reason) return

    setProcessingId(bookingId)
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (data.success) {
        // Remove from pending list
        setPendingPayments(prev => prev.filter(b => b.id !== bookingId))
      } else {
        alert(data.message || 'Failed to reject payment')
      }
    } catch (error) {
      console.error('Failed to reject payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="payment-review-page">
        <div className="page-header">
          <h1>Payment Review Queue</h1>
          <p>Review and confirm client payment submissions</p>
        </div>
        <div className="loading">Loading pending payments...</div>
      </div>
    )
  }

  return (
    <div className="payment-review-page">
      <div className="page-header">
        <h1>Payment Review Queue</h1>
        <p>Review and confirm client payment submissions</p>
      </div>

      {pendingPayments.length === 0 ? (
        <Card padding="lg" className="empty-state">
          <div className="empty-icon">
            <CheckCircle size={64} />
          </div>
          <h2>All Caught Up!</h2>
          <p>There are no pending payments to review at this time.</p>
          <p className="empty-note">
            When clients submit payments, they will appear here for your review.
          </p>
        </Card>
      ) : (
        <div className="payments-list">
          {pendingPayments.map((booking) => (
            <Card key={booking.id} padding="lg" className="payment-card">
              <div className="payment-header">
                <div className="payment-icon">
                  <DollarSign size={28} />
                </div>
                <div className="payment-title">
                  <h3>{booking.reference}</h3>
                  <span className="payment-status">
                    <Clock size={14} />
                    Submitted for Review
                  </span>
                </div>
                <div className="payment-amount">
                  ${booking.totalPrice || '—'}
                </div>
              </div>

              <div className="payment-details">
                <div className="detail-row">
                  <User size={18} />
                  <div>
                    <label>Customer</label>
                    <span>{booking.customerName}</span>
                    <small>{booking.customerEmail}</small>
                  </div>
                </div>

                <div className="detail-row">
                  <Calendar size={18} />
                  <div>
                    <label>Event Date</label>
                    <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <AlertCircle size={18} />
                  <div>
                    <label>Submitted</label>
                    <span>{new Date(booking.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                {booking.events?.[0]?.note && (
                  <div className="payment-notes">
                    <label>Payment Notes:</label>
                    <p>{booking.events[0].note}</p>
                  </div>
                )}
              </div>

              <div className="payment-actions">
                <Button
                  onClick={() => handleConfirmPayment(booking.id)}
                  variant="primary"
                  disabled={processingId === booking.id}
                >
                  {processingId === booking.id ? (
                    'Processing...'
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm Payment Received
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleRejectPayment(booking.id)}
                  variant="secondary"
                  disabled={processingId === booking.id}
                >
                  <XCircle size={18} />
                  Reject / Request Again
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <style jsx>{`
        .payment-review-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 32px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .page-header p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
          background: #d4edda;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155724;
        }

        .empty-state h2 {
          font-size: 28px;
          margin: 0 0 15px;
          color: var(--text-primary);
        }

        .empty-state p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0 0 10px;
        }

        .empty-note {
          font-size: 14px !important;
          opacity: 0.7;
        }

        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .payment-card {
          border-left: 4px solid #ffc107;
        }

        .payment-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .payment-icon {
          width: 50px;
          height: 50px;
          background: #fff3cd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #856404;
        }

        .payment-title {
          flex: 1;
        }

        .payment-title h3 {
          font-size: 20px;
          margin: 0 0 5px;
          color: var(--text-primary);
        }

        .payment-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #fff3cd;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #856404;
        }

        .payment-amount {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .detail-row :global(svg) {
          color: var(--color-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .detail-row > div {
          display: flex;
          flex-direction: column;
        }

        .detail-row label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .detail-row span {
          font-size: 15px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .detail-row small {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .payment-notes {
          padding: 15px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
          margin-top: 10px;
        }

        .payment-notes label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }

        .payment-notes p {
          margin: 0;
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.6;
        }

        .payment-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .payment-actions :global(button) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  )
}
