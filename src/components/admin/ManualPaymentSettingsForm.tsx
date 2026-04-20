'use client'

import { FormEvent, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

type ManualPaymentSettings = {
  cashAppTag: string
  chimeTag: string
  applePayValue: string
  applePayLabel: string
  instructions: string
  depositNote: string
  isCashAppEnabled: boolean
  isChimeEnabled: boolean
  isApplePayEnabled: boolean
}

const initialState: ManualPaymentSettings = {
  cashAppTag: '',
  chimeTag: '',
  applePayValue: '',
  applePayLabel: 'Apple Pay',
  instructions:
    'Send your payment using one of the methods below. After sending payment, return to the booking lookup page and click the payment submitted button so the owner can review and approve it.',
  depositNote:
    'Your date is not fully secured until the owner reviews and approves your payment submission.',
  isCashAppEnabled: true,
  isChimeEnabled: true,
  isApplePayEnabled: true,
}

export default function ManualPaymentSettingsForm() {
  const [form, setForm] = useState<ManualPaymentSettings>(initialState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/admin/settings/payment', {
          method: 'GET',
          cache: 'no-store',
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Unable to load payment settings.')
        }

        setForm(result.settings)
      } catch (err) {
        console.error(err)
        setError('Unable to load payment settings.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/admin/settings/payment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Save failed.')
      }

      setMessage('Payment settings saved successfully.')
      setForm(result.settings)
    } catch (err) {
      console.error(err)
      setError('Unable to save payment settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card padding="lg">
        <p>Loading payment settings...</p>
      </Card>
    )
  }

  return (
    <>
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="payment-settings-form">
          <h2>Manual Payment Settings</h2>
          <p className="subtitle">
            Configure your Cash App, Chime, and Apple Pay details for clients to send deposits.
          </p>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3>Payment Methods</h3>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isCashAppEnabled}
                  onChange={(e) => setForm({ ...form, isCashAppEnabled: e.target.checked })}
                />
                <span>Enable Cash App</span>
              </label>
            </div>

            {form.isCashAppEnabled && (
              <div className="form-group">
                <label htmlFor="cashAppTag">Cash App Tag</label>
                <input
                  id="cashAppTag"
                  type="text"
                  value={form.cashAppTag}
                  onChange={(e) => setForm({ ...form, cashAppTag: e.target.value })}
                  placeholder="$YourCashtag"
                />
                <small>Example: $PrettyPartySweets</small>
              </div>
            )}

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isChimeEnabled}
                  onChange={(e) => setForm({ ...form, isChimeEnabled: e.target.checked })}
                />
                <span>Enable Chime</span>
              </label>
            </div>

            {form.isChimeEnabled && (
              <div className="form-group">
                <label htmlFor="chimeTag">Chime Tag</label>
                <input
                  id="chimeTag"
                  type="text"
                  value={form.chimeTag}
                  onChange={(e) => setForm({ ...form, chimeTag: e.target.value })}
                  placeholder="$YourChimeTag"
                />
                <small>Example: $PrettyPartySweets</small>
              </div>
            )}

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isApplePayEnabled}
                  onChange={(e) => setForm({ ...form, isApplePayEnabled: e.target.checked })}
                />
                <span>Enable Apple Pay</span>
              </label>
            </div>

            {form.isApplePayEnabled && (
              <>
                <div className="form-group">
                  <label htmlFor="applePayLabel">Apple Pay Label</label>
                  <input
                    id="applePayLabel"
                    type="text"
                    value={form.applePayLabel}
                    onChange={(e) => setForm({ ...form, applePayLabel: e.target.value })}
                    placeholder="Apple Pay"
                  />
                  <small>How you want it labeled (e.g., Apple Pay, iPhone Payment)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="applePayValue">Apple Pay Contact</label>
                  <input
                    id="applePayValue"
                    type="text"
                    value={form.applePayValue}
                    onChange={(e) => setForm({ ...form, applePayValue: e.target.value })}
                    placeholder="phone number or email"
                  />
                  <small>The phone number or email clients should send payment to</small>
                </div>
              </>
            )}
          </div>

          <div className="form-section">
            <h3>Instructions & Notes</h3>

            <div className="form-group">
              <label htmlFor="instructions">Payment Instructions</label>
              <textarea
                id="instructions"
                rows={4}
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              />
              <small>Shown to clients explaining how to pay</small>
            </div>

            <div className="form-group">
              <label htmlFor="depositNote">Deposit Note</label>
              <textarea
                id="depositNote"
                rows={2}
                value={form.depositNote}
                onChange={(e) => setForm({ ...form, depositNote: e.target.value })}
              />
              <small>Important notice shown to clients about deposit security</small>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" size="lg" disabled={saving}>
              {saving ? 'Saving...' : 'Save Payment Settings'}
            </Button>
          </div>
        </form>
      </Card>

      <style jsx>{`
        .payment-settings-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        h2 {
          margin: 0;
          font-size: 28px;
          color: var(--text-primary);
        }

        .subtitle {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
        }

        .form-section h3 {
          margin: 0;
          font-size: 18px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 16px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-group small {
          color: var(--text-muted);
          font-size: 13px;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .success-message {
          padding: 16px;
          background: #e8f5e9;
          border: 1px solid #4caf50;
          border-radius: var(--radius-md);
          color: #2e7d32;
        }

        .error-message {
          padding: 16px;
          background: #ffebee;
          border: 1px solid #f44336;
          border-radius: var(--radius-md);
          color: #c62828;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </>
  )
}
