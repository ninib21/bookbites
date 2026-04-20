'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Package, Plus, Star, Trash2, Edit2, X, Check, DollarSign } from 'lucide-react'

type PackageItem = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  features: string
  image: string | null
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    price: '',
    features: '',
    image: '',
    isActive: true,
    isFeatured: false,
    sortOrder: '0',
  })

  useEffect(() => {
    fetchPackages()
  }, [filter])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' 
        ? '/api/admin/packages'
        : `/api/admin/packages?isActive=${filter === 'active'}`
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setPackages(data.packages)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPackage 
        ? `/api/admin/packages/${editingPackage.id}`
        : '/api/admin/packages'
      
      const response = await fetch(url, {
        method: editingPackage ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setShowForm(false)
        setEditingPackage(null)
        resetForm()
        fetchPackages()
      } else {
        alert(data.message || 'Failed to save package')
      }
    } catch (error) {
      console.error('Error saving package:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchPackages()
      } else {
        alert(data.message || 'Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleToggleFeatured = async (pkg: PackageItem) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !pkg.isFeatured }),
      })

      const data = await response.json()

      if (data.success) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const handleToggleActive = async (pkg: PackageItem) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      })

      const data = await response.json()

      if (data.success) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const startEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg)
    setFormData({
      slug: pkg.slug,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      features: JSON.parse(pkg.features || '[]').join('\n'),
      image: pkg.image || '',
      isActive: pkg.isActive,
      isFeatured: pkg.isFeatured,
      sortOrder: pkg.sortOrder.toString(),
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      description: '',
      price: '',
      features: '',
      image: '',
      isActive: true,
      isFeatured: false,
      sortOrder: '0',
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingPackage(null)
    resetForm()
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="packages-page">
      <div className="page-header">
        <h1>Package Manager</h1>
        <p>Create and manage your service packages</p>
      </div>

      {/* Filters and Add Button */}
      <div className="toolbar">
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </button>
        </div>
        <Button onClick={() => setShowForm(true)} variant="primary">
          <Plus size={18} />
          Add Package
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card padding="lg" className="form-card">
          <div className="form-header">
            <h2>{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
            <button className="close-btn" onClick={closeForm}>
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Package Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({ 
                      ...formData, 
                      name,
                      // Auto-generate slug if not editing
                      ...(!editingPackage && { slug: generateSlug(name) })
                    })
                  }}
                  required
                  placeholder="e.g., Celebration Package"
                />
              </div>
              <div className="form-group">
                <label>Slug * {editingPackage && '(read-only)'}</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  disabled={!!editingPackage}
                  placeholder="e.g., celebration-package"
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers, and hyphens only"
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Price *</label>
                <div className="price-input">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="299.99"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                placeholder="Describe what's included in this package..."
              />
            </div>
            <div className="form-group">
              <label>Features * (one per line)</label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                required
                rows={5}
                placeholder="- Custom candy table design&#10;- 50+ candy pieces&#10;- Decorative backdrop&#10;- Setup and breakdown"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/package-image.jpg"
              />
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Active (visible to clients)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <span>Featured on homepage</span>
              </label>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="primary">
                {editingPackage ? 'Update' : 'Add'} Package
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div className="loading">Loading packages...</div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <Card key={pkg.id} padding="none" className={`package-card ${!pkg.isActive ? 'inactive' : ''}`}>
              <div className="package-header">
                {pkg.image ? (
                  <img src={pkg.image} alt={pkg.name} />
                ) : (
                  <div className="placeholder-image">
                    <Package size={48} />
                  </div>
                )}
                {pkg.isFeatured && (
                  <div className="featured-badge">
                    <Star size={14} fill="currentColor" />
                    Featured
                  </div>
                )}
                {!pkg.isActive && <div className="inactive-overlay">Inactive</div>}
              </div>
              <div className="package-content">
                <h3>{pkg.name}</h3>
                <p className="slug">/{pkg.slug}</p>
                <p className="price">${pkg.price}</p>
                <ul className="features">
                  {JSON.parse(pkg.features || '[]').slice(0, 3).map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))}
                  {JSON.parse(pkg.features || '[]').length > 3 && (
                    <li className="more">+{JSON.parse(pkg.features || '[]').length - 3} more</li>
                  )}
                </ul>
                <div className="package-actions">
                  <button
                    className={`action-btn ${pkg.isFeatured ? 'active' : ''}`}
                    onClick={() => handleToggleFeatured(pkg)}
                    title={pkg.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star size={16} />
                  </button>
                  <button
                    className={`action-btn ${pkg.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleActive(pkg)}
                    title={pkg.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Check size={16} />
                  </button>
                  <button className="action-btn" onClick={() => startEdit(pkg)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(pkg.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && packages.length === 0 && (
        <div className="empty-state">
          <Package size={64} />
          <h2>No Packages Yet</h2>
          <p>Create your first package to offer services to clients.</p>
          <Button onClick={() => setShowForm(true)} variant="primary">
            Create First Package
          </Button>
        </div>
      )}

      <style jsx>{`
        .packages-page {
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

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .filters {
          display: flex;
          gap: 10px;
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

        .form-card {
          margin-bottom: 30px;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .form-header h2 {
          font-size: 24px;
          margin: 0;
          color: var(--text-primary);
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 5px;
        }

        .close-btn:hover {
          color: var(--text-primary);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 16px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .price-input {
          position: relative;
        }

        .price-input :global(svg) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .price-input input {
          padding-left: 40px;
        }

        .form-row {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 600;
          color: var(--text-primary);
        }

        .checkbox-label input {
          width: 20px;
          height: 20px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .package-card {
          overflow: hidden;
        }

        .package-card.inactive {
          opacity: 0.6;
        }

        .package-header {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: var(--bg-main);
        }

        .package-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .featured-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #ffc107;
          color: #856404;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .inactive-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .package-content {
          padding: 20px;
        }

        .package-content h3 {
          font-size: 20px;
          margin: 0 0 5px;
          color: var(--text-primary);
        }

        .slug {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 10px;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0 0 15px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }

        .features li {
          font-size: 14px;
          color: var(--text-secondary);
          padding: 4px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .features li:last-child {
          border-bottom: none;
        }

        .features li.more {
          color: var(--color-primary);
          font-weight: 600;
        }

        .package-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: 2px solid var(--border-color);
          background: white;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .action-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .action-btn.delete:hover {
          border-color: #dc3545;
          color: #dc3545;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-state :global(svg) {
          color: var(--color-primary);
          margin-bottom: 20px;
        }

        .empty-state h2 {
          font-size: 28px;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 25px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
