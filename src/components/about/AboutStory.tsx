'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import SectionShell from '@/components/global/SectionShell'
import { Sparkles, Heart } from 'lucide-react'

export default function AboutStory() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.story-animate') ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      eyebrow="Our Journey"
      title="Our Story"
      description=""
      align="left"
      background="white"
      spacing="lg"
    >
      <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-5">
          <p className="story-animate text-charcoal/80 leading-relaxed text-base">
            Pretty Party Sweets was born from a deep love of creating beautiful, delicious treats that bring people together.
            What started as a passion project has grown into a beloved service, helping hundreds of families make their
            celebrations truly special.
          </p>
          <p className="story-animate text-charcoal/80 leading-relaxed text-base">
            Every dessert table we create is a work of art, carefully designed to match your theme, colors, and vision.
            We use only the finest ingredients and pay attention to every detail, from the smallest cookie to the grandest centerpiece.
          </p>
          <p className="story-animate text-charcoal/80 leading-relaxed text-base">
            From intimate birthday parties to grand wedding receptions, we bring the same level of passion and craftsmanship
            to every order. Your celebration deserves to be sweet, and we&apos;re here to make that happen.
          </p>
        </div>
        <div className="story-animate relative group">
          <div className="w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 via-cream to-primary-100 border border-[#E8D5D5]/50 shadow-soft flex flex-col items-center justify-center gap-4 relative">
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-primary-100/60 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-300" />
            </div>
            <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-400" />
            </div>
            <div className="w-24 h-24 rounded-full bg-white shadow-glow flex items-center justify-center mb-2">
              <span className="font-display text-4xl font-bold text-primary-300">P</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-charcoal">Our Story</h3>
            <p className="text-muted text-sm italic">Crafting sweet moments since 2020</p>
          </div>
          {/* Decorative corner accent */}
          <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-primary-50 rounded-2xl -z-10 border border-primary-100" />
        </div>
      </div>
    </SectionShell>
  )
}
