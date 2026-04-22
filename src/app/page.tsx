'use client'

import Link from 'next/link'
import { Calendar, Cake, Users, ChefHat, DollarSign, CreditCard, BarChart3, Shield, ArrowRight, Check, Star, Zap } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Event Bookings',
    description: 'Weddings, baby showers, birthdays, corporate events. Clients book directly from your branded page.',
  },
  {
    icon: Cake,
    title: 'Custom Orders',
    description: 'Cakes, treats, candy tables. Manage custom orders with pickup dates, dietary notes, and item-level tracking.',
  },
  {
    icon: ChefHat,
    title: 'Catering Toggle',
    description: 'Turn catering on or off per business. Per-head pricing, staff scheduling, and delivery logistics built in.',
  },
  {
    icon: Users,
    title: 'Client CRM',
    description: 'Know your clients. Tags, lifetime value, order history, and communication logs all in one place.',
  },
  {
    icon: DollarSign,
    title: 'Flexible Payments',
    description: 'Manual tracking, Stripe cards, CashApp, or crypto. Deposits, balances, and payment proof workflows.',
  },
  {
    icon: BarChart3,
    title: 'Real Analytics',
    description: 'Revenue tracking, booking pipelines, popular services, and client growth. No more guessing.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Sign Up Free',
    description: 'Create your account in 60 seconds. No credit card required.',
  },
  {
    number: '02',
    title: 'Set Up Your Menu',
    description: 'Add your services, packages, and pricing. Customize your booking page with your brand colors.',
  },
  {
    number: '03',
    title: 'Start Booking',
    description: 'Share your booking page link. Clients book, you manage, payments flow in.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 bookings/month',
      'Up to 5 menu items',
      'Basic booking page',
      'Manual payment tracking',
      'Email support',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited bookings',
      'Unlimited menu items',
      'Custom domain support',
      'Stripe card payments',
      'Client CRM with tags',
      'Invoice system',
      'Priority support',
    ],
    cta: 'Start 14-Day Free Trial',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For multi-location businesses',
    features: [
      'Everything in Pro',
      'Multi-location support',
      'Advanced analytics',
      'API access',
      'White-label options',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 lg:py-40 px-5 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #FFFAF8 0%, #F8F2F0 30%, #F0E6E2 60%, #FBF3F6 100%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-300 mb-6">
            <Zap size={14} /> Built for food & dessert businesses
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6">
            Stop taking messy DMs.<br />
            <span className="text-primary-300">Start taking real bookings.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            The all-in-one booking and client management platform for food, dessert, and catering businesses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-300 text-white text-lg font-semibold rounded-xl hover:bg-primary-400 transition-colors shadow-lg shadow-primary-300/25"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-charcoal text-charcoal text-lg font-semibold rounded-xl hover:bg-charcoal hover:text-white transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="text-sm text-muted mt-4">No credit card required. Free plan available.</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-5 border-y border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted font-medium mb-4">TRUSTED BY FOOD & DESSERT BUSINESSES</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            {['Bakeries', 'Caterers', 'Candy Tables', 'Custom Cakes', 'Meal Prep', 'Food Trucks'].map((type) => (
              <span key={type} className="text-lg font-semibold">{type}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Everything you need to run your food business
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              From custom cake orders to full catering events. One platform, zero chaos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary-300" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-5 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-muted">Three steps. That&apos;s it.</p>
          </div>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-6 bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-primary-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-xl">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-lg mb-1">{step.title}</h3>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 transition-all ${
                  plan.highlight
                    ? 'border-primary-300 bg-white shadow-xl shadow-primary-300/10 relative'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-300 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-semibold text-charcoal text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-charcoal">{plan.price}</span>
                  <span className="text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                      <Check size={16} className="text-primary-300 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-primary-300 text-white hover:bg-primary-400'
                      : 'border-2 border-gray-200 text-charcoal hover:border-primary-300 hover:text-primary-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Ready to stop chasing DMs?
          </h2>
          <p className="text-lg text-muted mb-8">
            Join food and dessert businesses who manage bookings, orders, and clients all in one place.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-300 text-white text-lg font-semibold rounded-xl hover:bg-primary-400 transition-colors shadow-lg shadow-primary-300/25"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
