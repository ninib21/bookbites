'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          actionsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-5 text-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #FFFAF8 0%, #F8F2F0 30%, #F0E6E2 60%, #FBF3F6 100%)',
        }}
      />

      <div className="relative max-w-container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1
            ref={titleRef}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6"
          >
            Stop taking messy DMs. Start taking real bookings.
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            The all-in-one booking and client management platform for food, dessert, and
            catering businesses.
          </p>
          <div ref={actionsRef} className="flex justify-center gap-4 flex-wrap">
            <Button href="/inquire" variant="primary" size="lg">
              Book Now
            </Button>
            <Button href="/gallery" variant="secondary" size="lg">
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
