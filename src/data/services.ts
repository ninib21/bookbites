import { Cake, Candy, Cookie, CakeSlice, Gift, Wand2, type LucideIcon } from 'lucide-react'

export type Service = {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export const services: Service[] = [
  {
    icon: Cake,
    title: 'Custom Cakes',
    description: 'Beautiful bespoke cakes designed to match your theme and taste preferences. From elegant wedding cakes to fun birthday creations.',
    features: [
      'Custom flavors and fillings',
      'Tiered cakes available',
      'Fondant or buttercream',
      'Edible decorations',
    ],
  },
  {
    icon: CakeSlice,
    title: 'Dessert Tables',
    description: 'Stunning dessert spreads with coordinated treats that wow your guests. Complete setup and styling included.',
    features: [
      'Coordinated treat selection',
      'Themed decorations',
      'Display stands and props',
      'Setup and teardown',
    ],
  },
  {
    icon: Candy,
    title: 'Sweet Treats',
    description: 'Cookies, cake pops, macarons, chocolate-covered treats, and more handcrafted delights for your event.',
    features: [
      'Custom decorated cookies',
      'Gourmet cake pops',
      'French macarons',
      'Chocolate-dipped fruits',
    ],
  },
  {
    icon: Cookie,
    title: 'Candy Buffets',
    description: 'Colorful candy displays with jars, scoops, and bags. Let your guests create their own sweet treats to take home.',
    features: [
      'Premium candy selection',
      'Custom color themes',
      'Decorative jars and containers',
      'Take-home bags included',
    ],
  },
  {
    icon: Gift,
    title: 'Party Favors',
    description: 'Custom treat boxes, favor bags, and edible gifts your guests will love. Perfect for any celebration.',
    features: [
      'Custom packaging',
      'Personalized labels',
      'Variety of treats',
      'Bulk order discounts',
    ],
  },
  {
    icon: Wand2,
    title: 'Event Styling',
    description: 'Full dessert table styling with backdrops, signage, and decorative elements that match your event theme.',
    features: [
      'Custom backdrop design',
      'Themed signage',
      'Floral arrangements',
      'Table linens and decor',
    ],
  },
]

export const processSteps = [
  {
    icon: 'MessageSquare',
    step: 'Step 1',
    title: 'Consultation',
    description: 'Tell us about your event, theme, and sweet dreams. We listen to your vision.',
  },
  {
    icon: 'Palette',
    step: 'Step 2',
    title: 'Design',
    description: 'We create a custom proposal with treat selections, colors, and display ideas.',
  },
  {
    icon: 'Sparkles',
    step: 'Step 3',
    title: 'Creation',
    description: 'Your treats are handcrafted with love using premium ingredients and techniques.',
  },
  {
    icon: 'Calendar',
    step: 'Step 4',
    title: 'Delivery & Setup',
    description: 'We deliver and set up your dessert table, making it picture-perfect for your event.',
  },
]
