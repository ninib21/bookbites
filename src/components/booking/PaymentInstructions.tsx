'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Info } from 'lucide-react'

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

type PaymentInfoResponse = {
  success: boolean
  paymentMethods: string[]
  settings: ManualPaymentSettings
}

export default function PaymentInstructions() {
  const [data, setData] = useState<PaymentInfoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/payment-info', {
          method: 'GET',
          cache: 'no-store',
        })

        const result: PaymentInfoResponse = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result?.success === false ? 'Unable to load payment instructions.' : 'Request failed.')
        }

        setData(result)
      } catch (err) {
        console.error(err)
        setError('Unable to load payment instructions right now.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-cream rounded-xl flex items-center justify-center text-primary-300">
            <CreditCard size={18} strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal">Payment Instructions</h3>
        </div>
        <p className="text-muted text-sm">Loading payment options...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-cream rounded-xl flex items-center justify-center text-primary-300">
            <CreditCard size={18} strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal">Payment Instructions</h3>
        </div>
        <p className="text-muted text-sm">{error || 'Payment instructions are unavailable at the moment.'}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex px-3 py-1.5 rounded-full bg-cream text-primary-400 text-xs font-bold uppercase tracking-wider">
            Manual Payment
          </span>
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal leading-tight">
          Send your deposit using one of these methods
        </h3>
        <p className="text-muted text-sm leading-relaxed">{data.settings.instructions}</p>

        <div className="flex flex-col gap-3">
          {data.paymentMethods.map((method) => (
            <div
              key={method}
              className="p-4 border border-[#E8D5D5]/50 rounded-xl bg-white text-base font-semibold text-charcoal"
            >
              {method}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100/50 text-muted text-sm leading-relaxed">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-primary-300 flex-shrink-0 mt-0.5" />
            <span><strong className="text-charcoal">Important:</strong> {data.settings.depositNote}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
