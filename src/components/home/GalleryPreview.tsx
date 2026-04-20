'use client'

import Link from 'next/link'
import SectionShell from '@/components/global/SectionShell'

const galleryItems = [
  { id: 1, title: 'Birthday Candy Table', category: 'Birthday', gradient: 'from-primary-200 to-cream-dark' },
  { id: 2, title: 'Wedding Dessert Spread', category: 'Wedding', gradient: 'from-cream-dark to-mauve-light' },
  { id: 3, title: 'Baby Shower Treats', category: 'Baby Shower', gradient: 'from-primary-100 to-primary-200' },
  { id: 4, title: 'Chocolate Dipped Fruits', category: 'Dipped Treats', gradient: 'from-mauve-light to-cream' },
  { id: 5, title: 'Custom Cookie Display', category: 'Cookies', gradient: 'from-cream to-primary-200' },
  { id: 6, title: 'Luxury Macaron Tower', category: 'Macarons', gradient: 'from-primary-200 to-mauve-light' },
]

export default function GalleryPreview() {
  return (
    <SectionShell
      eyebrow="Our Work"
      title="Our Sweet Creations"
      description="Browse through our collection of beautiful dessert tables and treats"
      align="center"
      background="white"
      spacing="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square"
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
            >
              <span className="text-lg font-semibold text-primary-400">{item.category}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-6 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white text-lg font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-md bg-primary-300 text-white font-semibold shadow-soft hover:bg-primary-400 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          View Full Gallery
        </Link>
      </div>
    </SectionShell>
  )
}
