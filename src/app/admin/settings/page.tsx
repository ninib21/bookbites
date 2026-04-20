'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ManualPaymentSettingsForm from '@/components/admin/ManualPaymentSettingsForm'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Pretty Party Sweets',
    siteEmail: 'hello@prettypartysweets.com',
    sitePhone: '(123) 456-7890',
    notificationsEnabled: true,
    autoRespondEnabled: false,
  })

  const handleSave = () => {
    // TODO: Save to API
    alert('Settings saved!')
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your site and business settings</p>
      </div>

      <div className="settings-grid">
        <ManualPaymentSettingsForm />

        <Card padding="lg">
          <h2>Site Information</h2>
          <div className="form-group">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="tel"
              value={settings.sitePhone}
              onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
            />
          </div>
        </Card>

        <Card padding="lg">
          <h2>Notifications</h2>
          <div className="toggle-group">
            <label className="toggle-item">
              <div className="toggle-info">
                <div className="toggle-label">Email Notifications</div>
                <div className="toggle-description">Receive emails for new inquiries and bookings</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
              />
            </label>

            <label className="toggle-item">
              <div className="toggle-info">
                <div className="toggle-label">Auto-Respond</div>
                <div className="toggle-description">Send automatic confirmation emails to customers</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoRespondEnabled}
                onChange={(e) => setSettings({ ...settings, autoRespondEnabled: e.target.checked })}
              />
            </label>
          </div>
        </Card>

        <div className="actions">
          <Button onClick={handleSave} variant="primary" size="lg">
            Save Settings
          </Button>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 36px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .page-header p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-grid :global(h2) {
          font-size: 22px;
          margin: 0 0 20px;
          color: var(--text-primary);
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
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
          cursor: pointer;
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .toggle-description {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .toggle-item input[type="checkbox"] {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
      `}</style>
    </div>
  )
}
