import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'
import SiteHeader from '@/components/global/SiteHeader'
import SiteFooter from '@/components/global/SiteFooter'
import PageBackground from '@/components/effects/PageBackground'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pretty Party Sweets | Luxury Candy Tables & Dipped Treats',
    template: '%s | Pretty Party Sweets',
  },
  description:
    'Premium candy tables, custom cakes, and dipped treats for weddings, birthdays, and special events. Making your celebrations sweeter since 2020.',
  keywords: [
    'candy table',
    'custom cakes',
    'dipped treats',
    'wedding desserts',
    'birthday party',
    'event catering',
    'sweet table',
  ],
  authors: [{ name: 'Pretty Party Sweets' }],
  creator: 'Pretty Party Sweets',
  publisher: 'Pretty Party Sweets',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Pretty Party Sweets | Luxury Candy Tables & Dipped Treats',
    description:
      'Premium candy tables, custom cakes, and dipped treats for weddings, birthdays, and special events.',
    siteName: 'Pretty Party Sweets',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pretty Party Sweets | Luxury Candy Tables & Dipped Treats',
    description:
      'Premium candy tables, custom cakes, and dipped treats for weddings, birthdays, and special events.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ToastProvider>
          <PageBackground />
          <div className="app-root relative z-10">
            <SiteHeader />
            <main className="main-content">{children}</main>
            <SiteFooter />
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
