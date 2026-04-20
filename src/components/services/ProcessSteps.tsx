'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import { MessageSquare, Palette, Sparkles, Calendar } from 'lucide-react'
import { processSteps as stepsData } from '@/data/services'
import SectionShell from '@/components/global/SectionShell'

const iconMap = {
  MessageSquare,
  Palette,
  Sparkles,
  Calendar,
}

const stepColors = [
  'from-primary-200 to-primary-100',
  'from-cream to-primary-50',
  'from-primary-100 to-cream',
  'from-primary-50 to-primary-200',
]

export default function ProcessSteps() {
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepsRef.current?.querySelectorAll('.step-item') ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      eyebrow="The Process"
      title="How It Works"
      description="From your first inquiry to the final sweet bite, we make the process simple and enjoyable."
      align="center"
      background="light"
      spacing="lg"
    >
      <div ref={stepsRef} className="relative">
        {/* Connector line */}
        <div className="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepsData.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap]
            return (
              <div key={step.title} className="step-item text-center flex flex-col items-center gap-3 relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${stepColors[i % stepColors.length]} rounded-2xl flex items-center justify-center text-primary-300 mb-2 relative z-10 shadow-soft`}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-300">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-charcoal">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
