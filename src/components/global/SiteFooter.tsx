'use client'

import Link from 'next/link'
import { Instagram, Facebook, Music2, Palette } from 'lucide-react'
import { footerLinks, siteInfo } from '@/data/nav'
import { cn } from '@/lib/utils'

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/prettypartysweets', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/prettypartysweets', label: 'Facebook' },
  { icon: Palette, href: 'https://pinterest.com/prettypartysweets', label: 'Pinterest' },
  { icon: Music2, href: 'https://tiktok.com/@prettypartysweets', label: 'TikTok' },
]

export default function SiteFooter() {
  return (
    <footer className="relative mt-16">
      {/* Main footer content */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-[#E8D5D5]/50">
        <div className="max-w-container mx-auto px-5 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block group">
                <span className="font-display text-2xl font-bold text-charcoal tracking-tight">
                  Pretty Party{' '}
                  <span className="text-primary-300">SWEETS</span>
                </span>
              </Link>
              <p className="text-primary-300 font-medium mt-2 text-sm italic">
                Sweet treats, styled tables, unforgettable celebrations
              </p>
              <p className="text-muted text-sm leading-relaxed mt-4 max-w-sm">
                We design beautiful dessert moments for birthdays, baby showers, weddings and
                special celebrations with a boutique touch — polished, playful, and care.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-cream border border-[#E8D5D5] flex items-center justify-center text-muted hover:bg-primary-300 hover:text-white hover:border-primary-300 transition-all"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-primary-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-primary-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-4">
                Contact
              </h4>
              <div className="space-y-2.5 text-sm text-muted">
                <p>{siteInfo.email}</p>
                <p>{siteInfo.phone}</p>
                <p>{siteInfo.location}</p>
                <p>Mon–Sat, 9:00 AM–6 PM</p>
              </div>
              <button className="mt-5 px-5 py-2.5 rounded-md border-2 border-primary-300 text-primary-300 text-sm font-semibold hover:bg-cream transition-colors">
                Join the List
              </button>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[#E8D5D5]/50">
          <div className="max-w-container mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted text-xs">
              &copy; {new Date().getFullYear()} Pretty Party Sweets. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted">
              <Link href="/privacy" className="hover:text-primary-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
