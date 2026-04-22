'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, CreditCard, FileText, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, X, Loader2, Download, Send } from 'lucide-react'

type TabType = 'overview' | 'payments' | 'invoices'

interface PaymentRecord {
  id: string
  reference: string
  amount: number
  method: string
  status: string
  createdAt: string
  bookingRef: string | null
  clientName: string
}

interface Invoice {
  id: string
  number: string
  clientName: string
  amount: number
  status: string
  dueDate: string
  createdAt: string
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [payRes, invRes] = await Promise.all([
        fetch('/api/dashboard/payments'),
        fetch('/api/dashboard/invoices'),
      ])
      if (payRes.ok) {
        const data = await payRes.json()
        if (data.success) setPayments(data.payments)
      }
      if (invRes.ok) {
        const data = await invRes.json()
        if (data.success) setInvoices(data.invoices)
      }
    } catch (err) {
      console.error('Failed to fetch finance data:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = payments.filter(p => p.status === 'CONFIRMED').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'AWAITING_PAYMENT')
  const outstandingInvoices = invoices.filter(i => i.status === 'SENT' || i.status === 'OVERDUE')
  const overdueAmount = invoices.filter(i => i.status === 'OVERDUE').reduce((sum, i) => sum + i.amount, 0)

  const statusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700'
      case 'PENDING': case 'AWAITING_PAYMENT': return 'bg-yellow-100 text-yellow-700'
      case 'OVERDUE': return 'bg-red-100 text-red-700'
      case 'PAID': return 'bg-green-100 text-green-700'
      case 'SENT': return 'bg-blue-100 text-blue-700'
      case 'DRAFT': return 'bg-gray-100 text-gray-600'
      case 'CANCELLED': case 'REFUNDED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary-300" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <DollarSign size={28} className="text-primary-300" /> Finance
        </h1>
        <p className="text-sm text-muted mt-1">Track payments, manage invoices, and monitor revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Total Revenue</span>
            <ArrowUpRight size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Pending</span>
            <Clock size={16} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{pendingPayments.length}</p>
          <p className="text-xs text-muted">payments</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Outstanding</span>
            <FileText size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{outstandingInvoices.length}</p>
          <p className="text-xs text-muted">invoices</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Overdue</span>
            <ArrowDownRight size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal">${overdueAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['overview', 'payments', 'invoices'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-charcoal mb-4">Recent Payments</h3>
            {payments.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{p.clientName}</p>
                      <p className="text-xs text-muted">{p.method} &middot; {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal">${p.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-charcoal mb-4">Recent Invoices</h3>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{inv.clientName}</p>
                      <p className="text-xs text-muted">{inv.number} &middot; Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal">${inv.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-200">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <CreditCard size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium">No payments recorded</p>
              <p className="text-sm">Payments will appear here as bookings are confirmed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Client</th>
                    <th className="px-4 py-3 text-left font-medium">Method</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-charcoal">{p.clientName}</td>
                      <td className="px-4 py-3 text-muted">{p.method}</td>
                      <td className="px-4 py-3 font-semibold text-charcoal">${p.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-gray-200">
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <FileText size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium">No invoices yet</p>
              <p className="text-sm">Create invoices from bookings or clients.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Invoice #</th>
                    <th className="px-4 py-3 text-left font-medium">Client</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-charcoal">{inv.number}</td>
                      <td className="px-4 py-3 text-muted">{inv.clientName}</td>
                      <td className="px-4 py-3 font-semibold text-charcoal">${inv.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
