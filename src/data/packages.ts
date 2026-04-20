export type Package = {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

export const packages: Package[] = [
  {
    name: 'Sweet Starter',
    price: '$299',
    description: 'Perfect for small gatherings and intimate celebrations',
    features: [
      'Up to 20 guests',
      '3 dessert varieties',
      'Basic table setup',
      'Standard decorations',
      '2-hour display',
      'Pickup or delivery',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Celebration Plus',
    price: '$599',
    description: 'Ideal for birthdays, baby showers, and medium events',
    features: [
      'Up to 50 guests',
      '5 dessert varieties',
      'Full table styling',
      'Custom color theme',
      '4-hour display',
      'Setup & teardown',
      'Delivery included',
    ],
    cta: 'Most Popular',
    popular: true,
  },
  {
    name: 'Luxury Event',
    price: '$999',
    description: 'The ultimate experience for weddings and large celebrations',
    features: [
      'Up to 100 guests',
      '8 dessert varieties',
      'Premium table design',
      'Custom backdrop',
      'Full-day display',
      'Setup & teardown',
      'Delivery included',
      'Dedicated coordinator',
    ],
    cta: 'Book Now',
    popular: false,
  },
]

export const customPackageInfo = {
  title: 'Need Something Custom?',
  description: 'We can create a custom package tailored to your specific needs and budget.',
  cta: 'Request Custom Quote',
}
