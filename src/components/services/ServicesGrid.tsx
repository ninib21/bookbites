'use client'

import { services } from '@/data/services'
import SectionShell from '@/components/global/SectionShell'
import ServiceCard from './ServiceCard'

export default function ServicesGrid() {
  return (
    <SectionShell
      eyebrow="What We Offer"
      title="Our Sweet Services"
      description="From intimate gatherings to grand celebrations, we create sweet experiences your guests will remember."
      align="center"
      background="white"
      spacing="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, i) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            features={service.features}
            index={i}
          />
        ))}
      </div>
    </SectionShell>
  )
}
