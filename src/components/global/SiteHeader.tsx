'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { mainNav, siteInfo } from '@/data/nav'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-soft border-b border-[#E8D5D5]/50'
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      )}
    >
      <div className="max-w-container mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary-300 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-display font-bold text-lg">P</span>
          </div>
          <span className="font-display text-xl font-bold text-charcoal tracking-tight">
            {siteInfo.name.split(' ')[0]}{' '}
            <span className="text-primary-300">{siteInfo.name.split(' ').slice(1).join(' ')}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-primary-300 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary-300 after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button href="/inquire" variant="primary" size="sm">
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-charcoal hover:bg-cream transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-[65px] z-50 transition-all duration-300',
          menuOpen ? 'visible' : 'invisible'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-charcoal/20 backdrop-blur-sm transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-72 bg-white shadow-modal transition-transform duration-300',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <nav className="flex flex-col p-6 gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-charcoal font-medium rounded-lg hover:bg-cream hover:text-primary-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-[#E8D5D5]">
              <Button href="/inquire" variant="primary" fullWidth size="md">
                Book Now
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
