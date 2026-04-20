'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import Button from '@/components/ui/Button'
import { galleryItems, galleryCategories } from '@/data/gallery'
import { cn } from '@/lib/utils'
import { Eye } from 'lucide-react'

export default function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState('All')
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current?.querySelectorAll('.gallery-item') ?? [],
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      )
    })
    return () => ctx.revert()
  }, [activeFilter])

  return (
    <div className="space-y-10">
      <div className="flex justify-center flex-wrap gap-3">
        {galleryCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200',
              activeFilter === category
                ? 'bg-primary-300 text-white shadow-soft'
                : 'bg-white border border-[#E8D5D5] text-muted hover:border-primary-300 hover:text-primary-300'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="gallery-item group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-hover transition-all duration-300"
            style={{ background: item.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-primary-300" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-semibold mb-1 font-display">{item.title}</h3>
              <span className="text-white/80 text-sm">{item.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button href="/inquire" variant="primary" size="lg">
          Book Your Event
        </Button>
      </div>
    </div>
  )
}
