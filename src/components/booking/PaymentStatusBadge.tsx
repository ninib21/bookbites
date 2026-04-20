'use client'

type PaymentStatus = 'pending' | 'submitted' | 'approved' | 'declined'

type PaymentStatusBadgeProps = {
  status: string
}

const badgeStyles: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-green-50 text-green-800 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
}

const labelMap: Record<PaymentStatus, string> = {
  pending: 'Payment Pending',
  submitted: 'Payment Submitted',
  approved: 'Payment Approved',
  declined: 'Payment Declined',
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const normalized = (status || 'pending').toLowerCase() as PaymentStatus

  return (
    <span
      className={`inline-flex items-center justify-center min-h-[36px] px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeStyles[normalized] || badgeStyles.pending}`}
    >
      {labelMap[normalized] || 'Payment Pending'}
    </span>
  )
}
