'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, Clock, DollarSign, AlertCircle } from 'lucide-react'

type PaymentReviewActionsProps = {
  bookingId: string
  paymentStatus: string
  paymentMethod?: string | null
  paymentReference?: string | null
  paymentSubmittedAt?: string | Date | null
  paymentReviewNote?: string | null
  onPaymentUpdate?: () => void
}

export default function PaymentReviewActions({
  bookingId,
  paymentStatus,
  paymentMethod,
  paymentReference,
  paymentSubmittedAt,
  paymentReviewNote,
  onPaymentUpdate,
}: PaymentReviewActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleConfirmPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.success) {
        onPaymentUpdate?.()
      } else {
        alert(data.message || 'Failed to confirm payment')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting the payment')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      })

      const data = await response.json()

      if (data.success) {
        setShowRejectForm(false)
        setRejectReason('')
        onPaymentUpdate?.()
      } else {
        alert(data.message || 'Failed to reject payment')
      }
    } catch (error) {
      console.error('Error rejecting payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'approved':
        return <CheckCircle size={24} className="icon-approved" />
      case 'submitted':
        return <Clock size={24} className="icon-submitted" />
      case 'pending':
        return <DollarSign size={24} className="icon-pending" />
      case 'declined':
        return <XCircle size={24} className="icon-declined" />
      default:
        return <AlertCircle size={24} className="icon-default" />
    }
  }

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'approved':
        return 'Payment Approved'
      case 'submitted':
        return 'Payment Submitted - Awaiting Review'
      case 'pending':
        return 'Awaiting Payment'
      case 'declined':
        return 'Payment Declined'
      default:
        return 'Payment Status'
    }
  }

  return (
    <div className="payment-review-actions">
      <div className="payment-status-header">
        {getStatusIcon()}
        <div className="status-info">
          <h3>{getStatusTitle()}</h3>
          <span className={`status-badge status-${paymentStatus}`}>
            {paymentStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {paymentStatus === 'pending_confirmation' && (
        <div className="payment-details">
          {paymentMethod && (
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{paymentMethod}</span>
            </div>
          )}
          {paymentReference && (
            <div className="detail-row">
              <span className="detail-label">Reference/ID:</span>
              <span className="detail-value">{paymentReference}</span>
            </div>
          )}
          {paymentSubmittedAt && (
            <div className="detail-row">
              <span className="detail-label">Submitted:</span>
              <span className="detail-value">
                {new Date(paymentSubmittedAt).toLocaleString()}
              </span>
            </div>
          )}
          {paymentReviewNote && (
            <div className="payment-note">
              <span className="detail-label">Client Note:</span>
              <p>{paymentReviewNote}</p>
            </div>
          )}
        </div>
      )}

      {paymentStatus === 'submitted' && !showRejectForm && (
        <div className="action-buttons">
          <Button
            onClick={handleConfirmPayment}
            variant="primary"
            fullWidth
            disabled={loading}
          >
            <CheckCircle size={18} />
            {loading ? 'Processing...' : 'Confirm Payment Received'}
          </Button>
          <Button
            onClick={() => setShowRejectForm(true)}
            variant="secondary"
            fullWidth
            disabled={loading}
          >
            <XCircle size={18} />
            Reject / Request Again
          </Button>
        </div>
      )}

      {showRejectForm && (
        <div className="reject-form">
          <label htmlFor="rejectReason">Reason for Rejection:</label>
          <textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why the payment is being rejected (e.g., payment not received, incorrect amount, etc.)"
            rows={3}
          />
          <div className="reject-actions">
            <Button
              onClick={handleRejectPayment}
              variant="secondary"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Rejection'}
            </Button>
            <Button
              onClick={() => {
                setShowRejectForm(false)
                setRejectReason('')
              }}
              variant="ghost"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {paymentStatus === 'approved' && (
        <div className="payment-confirmed-message">
          <CheckCircle size={48} />
          <p>Payment has been approved and the booking is secured.</p>
        </div>
      )}

      {paymentStatus === 'declined' && (
        <div className="payment-declined-message">
          <XCircle size={48} />
          <p>Payment was declined. Client has been notified to resubmit.</p>
          {paymentReviewNote && (
            <div className="decline-reason">
              <strong>Reason:</strong> {paymentReviewNote}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .payment-review-actions {
          padding: 20px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
        }

        .payment-status-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .payment-status-header :global(svg) {
          flex-shrink: 0;
        }

        .icon-approved {
          color: #28a745;
        }

        .icon-submitted {
          color: #ffc107;
        }

        .icon-pending {
          color: #6c757d;
        }

        .icon-declined {
          color: #dc3545;
        }

        .icon-default {
          color: #6c757d;
        }

        .status-info {
          flex: 1;
        }

        .status-info h3 {
          font-size: 18px;
          margin: 0 0 8px;
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

        .status-approved {
          background: #d4edda;
          color: #155724;
        }

        .status-submitted {
          background: #fff3cd;
          color: #856404;
        }

        .status-pending {
          background: #e9ecef;
          color: #495057;
        }

        .status-declined {
          background: #f8d7da;
          color: #721c24;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: var(--radius-md);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .payment-note {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .payment-note p {
          margin: 8px 0 0;
          font-size: 14px;
          color: var(--text-primary);
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-buttons :global(button) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .reject-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reject-form label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .reject-form textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .reject-form textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .reject-actions {
          display: flex;
          gap: 10px;
        }

        .payment-confirmed-message {
          text-align: center;
          padding: 30px;
        }

        .payment-confirmed-message :global(svg) {
          color: #28a745;
          margin-bottom: 15px;
        }

        .payment-confirmed-message p {
          margin: 0;
          color: var(--text-secondary);
        }

        .payment-declined-message {
          text-align: center;
          padding: 30px;
        }

        .payment-declined-message :global(svg) {
          color: #dc3545;
          margin-bottom: 15px;
        }

        .payment-declined-message p {
          margin: 0 0 15px;
          color: var(--text-secondary);
        }

        .decline-reason {
          margin-top: 15px;
          padding: 15px;
          background: #fff3cd;
          border-radius: var(--radius-md);
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
