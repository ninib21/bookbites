'use client'

import { useEffect, useRef, useCallback, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/animations'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // GSAP animations
  useEffect(() => {
    if (isOpen) {
      // Enter animation
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, y: 20, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
        )
      }
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: onClose,
    })

    if (contentRef.current) {
      tl.to(contentRef.current, {
        scale: 0.95,
        y: 20,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      }, 0)
    }
    if (overlayRef.current) {
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
      }, 0)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-5 bg-charcoal/40 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className={cn(
          'bg-white rounded-2xl shadow-modal w-full relative',
          maxWidth,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-primary-100 text-charcoal hover:text-primary-400 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  )
}
