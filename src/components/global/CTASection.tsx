'use client'

import Link from 'next/link'
import SectionShell from './SectionShell'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  title?: string
  subtitle?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  className?: string
}

export default function CTASection({
  title = 'Ready to Make Your Event Sweeter?',
  subtitle = "Let's create something beautiful together. Get in touch to discuss your dream dessert table.",
  primaryButtonText = 'Get a Quote',
  primaryButtonHref = '/inquire',
  secondaryButtonText = 'View Packages',
  secondaryButtonHref = '/packages',
  className,
}: CTASectionProps) {
  return (
    <SectionShell background="gradient" spacing="lg" className={cn('py-16 md:py-20', className)}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryButtonHref}
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-md bg-primary-300 text-white font-semibold shadow-soft hover:bg-primary-400 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {primaryButtonText}
          </Link>
          {secondaryButtonText && secondaryButtonHref && (
            <Link
              href={secondaryButtonHref}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-md border-2 border-primary-300 text-primary-300 font-semibold hover:bg-cream hover:border-primary-400 transition-all"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </SectionShell>
  )
}
