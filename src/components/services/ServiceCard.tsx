'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const accents = [
  'from-primary-200 to-primary-100',
  'from-cream to-primary-50',
  'from-primary-100 to-cream',
  'from-primary-50 to-primary-100',
  'from-cream to-primary-100',
  'from-primary-200 to-cream',
]

type ServiceCardProps = {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  index?: number
}

export default function ServiceCard({ icon: Icon, title, description, features, index = 0 }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: 'power3.out', scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="group bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col gap-4">
        <div className={`w-[72px] h-[72px] mx-auto bg-gradient-to-br ${accents[index % accents.length]} rounded-2xl flex items-center justify-center text-primary-300 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={30} strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal text-center">{title}</h3>
        <p className="text-muted text-sm leading-relaxed text-center">{description}</p>
        <ul className="space-y-2.5 mt-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-charcoal/70">
              <Check size={16} className="text-primary-300 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button href="/inquire" variant="primary" fullWidth className="mt-2">
          Inquire Now
        </Button>
      </div>
    </div>
  )
}
