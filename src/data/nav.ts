export type NavItem = {
  label: string
  href: string
}

export const mainNav: NavItem[] = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/faq' },
]

export const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Book a Demo', href: '/contact' },
    { label: 'Client Portal', href: '#' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export const siteInfo = {
  name: 'BookBites',
  tagline: 'The booking platform for food & dessert businesses',
  email: 'hello@bookbites.com',
  phone: '',
  location: '',
  hours: {
    weekday: '',
    saturday: '',
    sunday: '',
  },
}
