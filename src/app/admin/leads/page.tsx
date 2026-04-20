'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLeads()
  }, [filter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/leads${filter !== 'all' ? `?status=${filter}` : ''}`)
      const data = await response.json()
      
      if (response.ok) {
        setLeads(data.leads)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = filter === 'all' ? leads : leads.filter(lead => lead.status === filter)

  return (
    <div className="leads-page">
      <div className="page-header">
        <h1>Leads</h1>
        <p>Manage inquiry submissions and potential customers</p>
      </div>

      <Card padding="lg">
        {/* Header with Export */}
        <div className="card-header">
          <h2>Leads List</h2>
          <button className="export-btn" onClick={() => window.open(`/api/admin/export/leads${filter !== 'all' ? `?status=${filter}` : ''}`, '_blank')}>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            New
          </button>
          <button
            className={`filter-btn ${filter === 'contacted' ? 'active' : ''}`}
            onClick={() => setFilter('contacted')}
          >
            Contacted
          </button>
          <button
            className={`filter-btn ${filter === 'converted' ? 'active' : ''}`}
            onClick={() => setFilter('converted')}
          >
            Converted
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : (
          <div className="table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="name-cell">
                        <div className="name">{lead.name}</div>
                        <div className="phone">{lead.phone}</div>
                      </div>
                    </td>
                    <td>{lead.email}</td>
                    <td>{lead.eventType}</td>
                    <td>{new Date(lead.eventDate).toLocaleDateString()}</td>
                    <td>{lead.packageInterest || '-'}</td>
                    <td>
                      <span className={`status-badge status-${lead.status}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">View</button>
                        <button className="action-btn secondary">Email</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="empty-state">
                <p>No leads found</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <style jsx>{`
        .leads-page {
          max-width: 1400px;
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

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 20px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header :global(h2) {
          font-size: 22px;
          margin: 0;
          color: var(--text-primary);
        }

        .export-btn {
          padding: 10px 20px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .export-btn:hover {
          background: var(--color-primary-dark);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .table-container {
          overflow-x: auto;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table thead {
          background: var(--bg-main);
        }

        .leads-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 2px solid var(--border-color);
        }

        .leads-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          color: var(--text-primary);
        }

        .name-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .name {
          font-weight: 600;
        }

        .phone {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-new {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-contacted {
          background: #fff3cd;
          color: #856404;
        }

        .status-converted {
          background: #d4edda;
          color: #155724;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .action-btn:hover {
          background: var(--color-primary-dark);
        }

        .action-btn.secondary {
          background: white;
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        }

        .action-btn.secondary:hover {
          background: var(--color-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}
