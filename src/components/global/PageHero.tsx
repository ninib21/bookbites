'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  overlay?: boolean
  className?: string
  children?: React.ReactNode
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  overlay = true,
  className,
  children,
}: PageHeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      className={cn(
        'relative py-20 md:py-28 lg:py-32 overflow-hidden',
        backgroundImage && 'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* Gradient background */}
      {!backgroundImage && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #FFFAF8 0%, #F8F2F0 30%, #F0E6E2 60%, #FBF3F6 100%)',
          }}
        />
      )}

      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/70 via-primary-600/60 to-primary-400/50" />
      )}

      <div className="relative max-w-container mx-auto px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            ref={titleRef}
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight',
              backgroundImage ? 'text-white' : 'text-charcoal'
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              ref={subtitleRef}
              className={cn(
                'text-lg md:text-xl mb-6 leading-relaxed',
                backgroundImage ? 'text-white/90' : 'text-muted'
              )}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
