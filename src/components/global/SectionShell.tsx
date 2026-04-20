'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionBackground = 'white' | 'light' | 'gradient'
type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl'
type SectionAlign = 'left' | 'center' | 'right'

type SectionShellProps = {
  children: ReactNode
  eyebrow?: string
  title?: string
  description?: string
  align?: SectionAlign
  background?: SectionBackground
  spacing?: SectionSpacing
  className?: string
}

const bgClasses: Record<SectionBackground, string> = {
  white: 'bg-white',
  light: 'bg-surface',
  gradient: 'bg-gradient-to-br from-[#FFFAF8] via-[#F8F2F0] to-[#FBF3F6]',
}

const spacingClasses: Record<SectionSpacing, string> = {
  sm: 'py-10 px-5',
  md: 'py-20 px-5',
  lg: 'py-24 px-5',
  xl: 'py-32 px-5',
}

const alignClasses: Record<SectionAlign, string> = {
  left: 'text-left',
  center: 'text-center max-w-3xl mx-auto',
  right: 'text-right',
}

export default function SectionShell({
  children,
  eyebrow,
  title,
  description,
  align = 'left',
  background = 'white',
  spacing = 'md',
  className,
}: SectionShellProps) {
  return (
    <section className={cn(bgClasses[background], spacingClasses[spacing], className)}>
      <div className="max-w-container mx-auto">
        {(eyebrow || title || description) && (
          <div className={cn('mb-12', alignClasses[align])}>
            {eyebrow && (
              <span className="block text-xs font-semibold uppercase tracking-widest text-primary-300 mb-3">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted text-base md:text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
