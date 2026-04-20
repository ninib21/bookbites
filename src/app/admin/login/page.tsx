'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Panel</h1>
          <p>Pretty Party Sweets</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@prettypartysweets.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>

        <p className="back-link">
          <a href="/">← Back to Website</a>
        </p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff0f6, #ffe4ef);
          padding: 20px;
        }

        .login-container {
          width: 100%;
          max-width: 450px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-header h1 {
          font-size: 36px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .login-header p {
          font-size: 18px;
          color: var(--color-primary);
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input {
          padding: 12px 16px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 16px;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .error-message {
          padding: 12px;
          background: #fff0f0;
          border: 1px solid #ff6b6b;
          border-radius: var(--radius-md);
          color: #d32f2f;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .back-link {
          text-align: center;
          margin-top: 30px;
        }

        .back-link a {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
        }

        .back-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
