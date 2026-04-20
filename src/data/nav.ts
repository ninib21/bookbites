export type NavItem = {
  label: string
  href: string
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Packages', href: '/packages' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Packages', href: '/packages' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Candy Tables', href: '/services' },
    { label: 'Chocolate-Dipped Treats', href: '/services' },
    { label: 'Dessert Table Styling', href: '/services' },
    { label: 'Cakes & Sweets', href: '/services' },
    { label: 'Event Decor Add-Ons', href: '/services' },
    { label: 'Custom Celebration Packages', href: '/packages' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get a Quote', href: '/inquire' },
    { label: 'Book Now', href: '/booking' },
  ],
}

export const siteInfo = {
  name: 'BookBites',
  tagline: 'Sweet treats, styled tables, unforgettable celebrations',
  email: 'hello@bookbites.com',
  phone: '(555) 214-7789',
  location: 'Greater Celebration County & surrounding areas',
  hours: {
    weekday: 'Mon–Sat, 9:00 AM–6 PM',
    saturday: '',
    sunday: '',
  },
}
