'use client'

import { useEffect, useRef, useCallback, createContext, useContext, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/animations'

type ToastType = 'success' | 'error' | 'info'

type ToastProps = {
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: () => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const colorMap = {
  success: 'bg-primary-100 border-primary-300',
  error: 'bg-red-50 border-red-300',
  info: 'bg-cream border-mauve-light',
}

const iconColorMap = {
  success: 'text-primary-400',
  error: 'text-red-500',
  info: 'text-mauve',
}

function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null!)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { x: 120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
      )
    }

    timerRef.current = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        x: 120,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      })
    } else {
      onClose()
    }
  }, [onClose])

  const Icon = iconMap[type]

  return (
    <div
      ref={toastRef}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-hover max-w-sm',
        colorMap[type]
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColorMap[type])} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal text-sm">{title}</p>
        {message && (
          <p className="text-muted text-xs mt-1 leading-relaxed">{message}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="text-muted/50 hover:text-charcoal transition-colors p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Toast Container & Context ───────────────────────────────

type ToastItem = {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

type ToastContextType = {
  addToast: (toast: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container - fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
