'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import InquiryForm from '@/components/forms/InquiryForm'
import { cn } from '@/lib/utils'

type InquiryModalProps = {
  triggerText?: string
  triggerVariant?: 'primary' | 'secondary' | 'ghost'
  triggerSize?: 'sm' | 'md' | 'lg'
}

export default function InquiryModal({
  triggerText = 'Get a Quote',
  triggerVariant = 'primary',
  triggerSize = 'md',
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center justify-center gap-2.5 rounded-md font-semibold leading-none transition-all duration-200 cursor-pointer text-center whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0',
          triggerVariant === 'primary' && 'bg-primary-300 text-white shadow-soft hover:bg-primary-400 hover:shadow-hover',
          triggerVariant === 'secondary' && 'bg-white text-primary-300 border-2 border-primary-300 hover:bg-cream',
          triggerVariant === 'ghost' && 'bg-transparent text-charcoal border-2 border-[#E8D5D5] hover:bg-white hover:border-mauve-light',
          triggerSize === 'sm' && 'min-h-[40px] px-4 py-2.5 text-sm',
          triggerSize === 'md' && 'min-h-[48px] px-5.5 py-3.5 text-[15px]',
          triggerSize === 'lg' && 'min-h-[56px] px-7 py-4 text-base',
        )}
      >
        {triggerText}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="max-w-3xl"
        className="p-0 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#E8D5D5]/50">
          <p className="text-xs font-semibold uppercase tracking-widest text-mauve mb-2">
            Quick Contact
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Let&apos;s start planning something sweet
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Share a few details and we&apos;ll follow up about availability, services, and
            next steps for your celebration.
          </p>

          {/* Info chips */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-cream rounded-md border border-[#E8D5D5]/50">
              <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Email</p>
                <p className="text-sm text-charcoal font-medium">hello@prettypartysweets.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-cream rounded-md border border-[#E8D5D5]/50">
              <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Response Time</p>
                <p className="text-sm text-charcoal font-medium">Within 1–2 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <InquiryForm
            onCancel={() => setIsOpen(false)}
            onSuccess={() => setIsOpen(false)}
            compact
          />
        </div>
      </Modal>
    </>
  )
}
