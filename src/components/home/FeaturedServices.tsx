'use client'

import { useEffect, useRef } from 'react'
import SectionShell from '@/components/global/SectionShell'
import Card from '@/components/ui/Card'
import { Cake, Candy, Cookie, CakeSlice } from 'lucide-react'
import { gsap } from '@/lib/animations'

const services = [
  {
    icon: Cake,
    title: 'Custom Cakes',
    description: 'Beautiful bespoke cakes designed to match your theme and taste preferences.',
    href: '/services',
  },
  {
    icon: CakeSlice,
    title: 'Dessert Tables',
    description: 'Stunning dessert spreads with coordinated treats that wow your guests.',
    href: '/services',
  },
  {
    icon: Candy,
    title: 'Sweet Treats',
    description: 'Cookies, cake pops, macarons, and more handcrafted delights.',
    href: '/services',
  },
  {
    icon: Cookie,
    title: 'Party Packages',
    description: 'Complete packages tailored to your event size and budget.',
    href: '/packages',
  },
]

export default function FeaturedServices() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.service-card')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
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
      eyebrow="What We Offer"
      title="Our Sweet Services"
      description="From intimate gatherings to grand celebrations, we create sweet experiences your guests will remember."
      align="center"
      background="light"
      spacing="lg"
    >
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Card key={service.title} padding="lg" hover className="service-card text-center">
            <div className="w-[70px] h-[70px] mx-auto bg-cream rounded-full flex items-center justify-center text-primary-300 mb-4">
              <service.icon size={32} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">{service.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{service.description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  )
}
