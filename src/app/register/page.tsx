'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Building2, User, ArrowRight, Loader2, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password strength
  const getPasswordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = getPasswordStrength(password)
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-300', 'bg-green-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, email, password, name: name || undefined }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Registration failed.')
        setLoading(false)
        return
      }

      router.push('/dashboard/onboarding')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-cream to-white px-5 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl font-bold text-charcoal tracking-tight">
              Book<span className="text-primary-300">Bites</span>
            </span>
          </Link>
          <p className="text-muted mt-2">Create your business account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8D5D5]/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-charcoal mb-1.5">
                Business name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="Sweet Treats Bakery"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E8D5D5] bg-white text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
                Your name <span className="text-muted font-normal">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E8D5D5] bg-white text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@yourbusiness.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E8D5D5] bg-white text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E8D5D5] bg-white text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                />
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted">{strengthLabels[strength - 1] || 'Too short'}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-300 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-muted text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary-300">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-primary-300">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-300 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
