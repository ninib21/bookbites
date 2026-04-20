'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import SectionShell from '@/components/global/SectionShell'
import { Heart, Sparkles, Award } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Quality First',
    description: 'We never compromise on ingredients or craftsmanship. Every treat is made with care and premium materials.',
    accent: 'from-primary-200 to-primary-100',
  },
  {
    icon: Sparkles,
    title: 'Custom Design',
    description: 'Your vision is unique, and we work closely with you to bring your dream dessert table to life.',
    accent: 'from-cream to-primary-50',
  },
  {
    icon: Award,
    title: 'Exceptional Service',
    description: 'From consultation to setup, we ensure a seamless and stress-free experience.',
    accent: 'from-primary-100 to-cream',
  },
]

export default function BrandValues() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.querySelectorAll('.value-card') ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      eyebrow="What We Stand For"
      title="Our Values"
      align="center"
      background="light"
      spacing="lg"
    >
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {values.map((value) => (
          <div
            key={value.title}
            className="value-card group bg-white rounded-2xl border border-[#E8D5D5]/50 p-6 md:p-8 text-center shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-[72px] h-[72px] mx-auto mb-6 bg-gradient-to-br ${value.accent} rounded-2xl flex items-center justify-center text-primary-300 group-hover:scale-110 transition-transform duration-300`}>
              <value.icon size={30} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal mb-3">{value.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
