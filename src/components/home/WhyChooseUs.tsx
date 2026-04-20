'use client'

import SectionShell from '@/components/global/SectionShell'
import { Heart, Star, Sparkles, Award } from 'lucide-react'

const reasons = [
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description: 'Every treat is made from scratch with premium ingredients and attention to detail.',
  },
  {
    icon: Star,
    title: '5-Star Rated',
    description: 'Hundreds of happy customers and consistently excellent reviews.',
  },
  {
    icon: Sparkles,
    title: 'Custom Designs',
    description: 'We work with you to create a dessert table that matches your vision perfectly.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only the finest ingredients, beautiful presentation, and unforgettable taste.',
  },
]

export default function WhyChooseUs() {
  return (
    <SectionShell
      eyebrow="Why Us"
      title="Why Choose Us?"
      description="We're passionate about making your special moments even sweeter"
      align="center"
      background="white"
      spacing="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover"
          >
            <div className="w-[70px] h-[70px] mx-auto mb-5 bg-cream rounded-full flex items-center justify-center text-primary-300">
              <reason.icon size={32} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">{reason.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{reason.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
