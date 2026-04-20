'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import { packages } from '@/data/packages'
import Button from '@/components/ui/Button'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PackageGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current?.querySelectorAll('.pkg-card') ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
      {packages.map((pkg) => (
        <div
          key={pkg.name}
          className={cn(
            'pkg-card relative bg-white rounded-2xl border p-6 md:p-8 text-center shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300',
            pkg.popular
          ? 'border-primary-300 ring-2 ring-primary-100 lg:scale-105 lg:z-10'
          : 'border-[#E8D5D5]/50'
          )}
        >
          {pkg.popular && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-300 text-white px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-soft">
              <Star size={12} fill="currentColor" />
              Most Popular
            </div>
          )}
          <h3 className="font-display text-2xl font-bold text-charcoal mb-3">{pkg.name}</h3>
          <div className="text-4xl font-bold text-primary-300 mb-3">{pkg.price}</div>
          <p className="text-muted text-sm mb-6 leading-relaxed">{pkg.description}</p>
          <ul className="space-y-3 mb-8 text-left">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <Check size={16} className="text-primary-300 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button href="/inquire" variant={pkg.popular ? 'primary' : 'secondary'} fullWidth size="lg">
            {pkg.cta}
          </Button>
        </div>
      ))}
    </div>
  )
}
