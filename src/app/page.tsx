import HeroSection from '@/components/home/HeroSection'
import FeaturedServices from '@/components/home/FeaturedServices'
import GalleryPreview from '@/components/home/GalleryPreview'
import PackagePreview from '@/components/home/PackagePreview'
import Testimonials from '@/components/home/Testimonials'
import HomeFAQPreview from '@/components/home/HomeFAQPreview'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pretty Party Sweets',
    description: 'Luxury Candy Tables & Dipped Treats',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: '(555) 214-7789',
    email: 'hello@prettypartysweets.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Celebration',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    sameAs: [
      'https://facebook.com/prettypartysweets',
      'https://instagram.com/prettypartysweets',
    ],
    priceRange: '$$',
    openingHours: 'Mo-Sa 09:00-18:00',
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturedServices />
      <GalleryPreview />
      <PackagePreview />
      <Testimonials />
      <HomeFAQPreview />
    </div>
  )
}
