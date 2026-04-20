'use client'

import { useEffect, useRef } from 'react'
import SectionShell from '@/components/global/SectionShell'
import { gsap } from '@/lib/animations'
import { homeTestimonials } from '@/data/testimonials'

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.testimonial-card')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current!,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      eyebrow="Testimonials"
      title="What Our Clients Say"
      description="Don't just take our word for it - hear from our happy customers"
      align="center"
      background="white"
      spacing="lg"
    >
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homeTestimonials.map((testimonial) => (
          <div
            key={`${testimonial.name}-${testimonial.event}`}
            className="testimonial-card bg-white p-8 rounded-lg shadow-soft border border-[#E8D5D5]/50"
          >
            <div className="text-gold-star text-xl mb-4">
              {'★'.repeat(testimonial.rating)}
            </div>
            <p className="text-charcoal text-sm leading-relaxed mb-6 italic">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="border-t border-[#E8D5D5]/50 pt-5">
              <div className="font-bold text-charcoal">{testimonial.name}</div>
              <div className="text-muted text-sm">{testimonial.event}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
