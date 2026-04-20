'use client'

import Link from 'next/link'
import SectionShell from '@/components/global/SectionShell'

const packages = [
  {
    id: 1,
    name: 'Sweet Starter',
    price: '$299',
    description: 'Perfect for intimate gatherings',
    features: ['50-75 guests', '3 dessert items', 'Basic setup', 'Delivery included'],
    popular: false,
  },
  {
    id: 2,
    name: 'Party Perfect',
    price: '$499',
    description: 'Our most popular package',
    features: ['75-150 guests', '5 dessert items', 'Premium setup', 'Delivery & setup', 'Custom colors'],
    popular: true,
  },
  {
    id: 3,
    name: 'Luxury Celebration',
    price: '$799',
    description: 'The ultimate experience',
    features: ['150+ guests', '8+ dessert items', 'Luxury setup', 'Full service', 'Custom design', 'Tasting session'],
    popular: false,
  },
]

export default function PackagePreview() {
  return (
    <SectionShell
      eyebrow="Pricing"
      title="Our Packages"
      description="Choose the perfect package for your celebration"
      align="center"
      background="light"
      spacing="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white p-6 md:p-8 rounded-lg border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover ${
              pkg.popular
                ? 'border-primary-300 shadow-soft lg:scale-105'
                : 'border-[#E8D5D5]'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-300 text-white px-5 py-1.5 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="font-display text-2xl font-bold text-charcoal text-center mb-3">
              {pkg.name}
            </h3>
            <div className="text-4xl font-bold text-primary-300 text-center mb-2">
              {pkg.price}
            </div>
            <p className="text-muted text-center mb-6 text-sm">{pkg.description}</p>
            <ul className="space-y-0 mb-6">
              {pkg.features.map((feature, index) => (
                <li
                  key={index}
                  className="py-2.5 border-b border-[#E8D5D5]/50 last:border-0 text-charcoal text-sm"
                >
                  ✓ {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/packages"
              className={`block text-center py-3.5 px-6 rounded-md font-semibold transition-all ${
                pkg.popular
                  ? 'bg-primary-300 text-white hover:bg-primary-400'
                  : 'border-2 border-primary-300 text-primary-300 hover:bg-cream'
              }`}
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/inquire"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-md bg-primary-300 text-white font-semibold shadow-soft hover:bg-primary-400 hover:shadow-hover hover:-translate-y-0.5 transition-all"
        >
          Get Custom Quote
        </Link>
      </div>
    </SectionShell>
  )
}
