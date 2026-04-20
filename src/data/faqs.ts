export type FAQ = {
  question: string
  answer: string
}

export type FAQCategory = {
  category: string
  faqs: FAQ[]
}

export const faqCategories: FAQCategory[] = [
  {
    category: 'Booking & Orders',
    faqs: [
      {
        question: 'How far in advance should I book?',
        answer: 'We recommend booking at least 2-4 weeks in advance for regular events, and 1-3 months for weddings or large celebrations. This ensures availability and gives us time to create your perfect setup.',
      },
      {
        question: 'Do you require a deposit?',
        answer: 'Yes, a 50% deposit is required to secure your booking. The remaining balance is due one week before your event date.',
      },
      {
        question: 'Can I customize my order?',
        answer: 'Absolutely! All our packages are customizable. You can choose specific treats, colors, themes, and display preferences to match your event perfectly.',
      },
    ],
  },
  {
    category: 'Products & Services',
    faqs: [
      {
        question: 'What types of treats do you offer?',
        answer: 'We offer custom cakes, cupcakes, cookies, macarons, chocolate-dipped fruits, candy tables, dessert buffets, and much more. Everything is made fresh and customized to your preferences.',
      },
      {
        question: 'Do you accommodate dietary restrictions?',
        answer: 'Yes! We can create gluten-free, dairy-free, nut-free, and vegan options. Please let us know your specific needs when placing your order.',
      },
      {
        question: 'Do you deliver and set up?',
        answer: 'Yes, delivery and setup are included in most packages. For smaller orders, pickup is available or delivery can be arranged for an additional fee based on distance.',
      },
    ],
  },
  {
    category: 'Payment & Policies',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, bank transfers, and all major credit cards. Payment plans are available for larger orders.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'Cancellations made 2 weeks or more before the event receive a full refund of the deposit. Cancellations within 2 weeks are subject to a 50% cancellation fee.',
      },
      {
        question: 'How many guests can you serve?',
        answer: 'We can accommodate events from 10 to 500+ guests. Our packages are scalable, and we can create custom quotes for any size event.',
      },
    ],
  },
]

export const faqCTA = {
  title: 'Still Have Questions?',
  description: 'Contact us and we\'ll be happy to help!',
  buttonText: 'Get in Touch',
  buttonHref: '/contact',
}

export const homeFAQs = [
  {
    question: 'How far in advance should I book my event?',
    answer: 'We recommend booking as early as possible to secure your date, especially for weekends, holidays, baby showers, birthdays, and peak celebration seasons.',
  },
  {
    question: 'Do you only offer dipped treats or full candy tables too?',
    answer: 'We offer both custom dipped treats and full luxury candy table setups. Packages can be tailored based on your event size, theme, and dessert needs.',
  },
  {
    question: 'Can my treats match my event colors and theme?',
    answer: 'Yes. We customize colors, treat styling, display details, and table presentation so everything feels cohesive with your overall event look.',
  },
  {
    question: 'Do you require a deposit to book?',
    answer: 'Yes. A deposit is typically required to reserve your event date and begin planning, prep, and supply ordering for your custom order.',
  },
]
