'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ImagePlus, Star, Trash2, Edit2, X, Check } from 'lucide-react'

const categories = ['Candy Tables', 'Cakes', 'Dipped Treats', 'Cookies', 'Events']

type GalleryItem = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  category: string
  isFeatured: boolean
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: categories[0],
    isFeatured: false,
    sortOrder: 0,
  })

  useEffect(() => {
    fetchItems()
  }, [filter])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/gallery?category=${filter}`)
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingItem 
        ? `/api/admin/gallery/${editingItem.id}`
        : '/api/admin/gallery'
      
      const response = await fetch(url, {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setShowForm(false)
        setEditingItem(null)
        resetForm()
        fetchItems()
      } else {
        alert(data.message || 'Failed to save gallery item')
      }
    } catch (error) {
      console.error('Error saving gallery item:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchItems()
      } else {
        alert(data.message || 'Failed to delete gallery item')
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleToggleFeatured = async (item: GalleryItem) => {
    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      })

      const data = await response.json()

      if (data.success) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      })

      const data = await response.json()

      if (data.success) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const startEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: categories[0],
      isFeatured: false,
      sortOrder: 0,
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(null)
    resetForm()
  }

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Gallery Manager</h1>
        <p>Manage your portfolio images and showcase</p>
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
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowForm(true)} variant="primary">
          <ImagePlus size={18} />
          Add Image
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card padding="lg" className="form-card">
          <div className="form-header">
            <h2>{editingItem ? 'Edit Gallery Item' : 'Add New Image'}</h2>
            <button className="close-btn" onClick={closeForm}>
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter image title"
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image URL *</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <span>Featured on homepage</span>
              </label>
              <div className="form-group sort-order">
                <label>Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="primary">
                {editingItem ? 'Update' : 'Add'} Image
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="loading">Loading gallery items...</div>
      ) : (
        <div className="gallery-grid">
          {items.map((item) => (
            <Card key={item.id} padding="none" className={`gallery-card ${!item.isActive ? 'inactive' : ''}`}>
              <div className="gallery-image">
                <img src={item.imageUrl} alt={item.title} />
                {item.isFeatured && (
                  <div className="featured-badge">
                    <Star size={14} fill="currentColor" />
                    Featured
                  </div>
                )}
                {!item.isActive && <div className="inactive-overlay">Hidden</div>}
              </div>
              <div className="gallery-content">
                <h3>{item.title}</h3>
                <p className="category">{item.category}</p>
                {item.description && <p className="description">{item.description}</p>}
                <div className="gallery-actions">
                  <button
                    className={`action-btn ${item.isFeatured ? 'active' : ''}`}
                    onClick={() => handleToggleFeatured(item)}
                    title={item.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star size={16} />
                  </button>
                  <button
                    className={`action-btn ${item.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleActive(item)}
                    title={item.isActive ? 'Hide' : 'Show'}
                  >
                    <Check size={16} />
                  </button>
                  <button className="action-btn" onClick={() => startEdit(item)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(item.id)}
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

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <ImagePlus size={64} />
          <h2>No Images Yet</h2>
          <p>Start building your gallery by adding your first image.</p>
          <Button onClick={() => setShowForm(true)} variant="primary">
            Add Your First Image
          </Button>
        </div>
      )}

      <style jsx>{`
        .gallery-page {
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

        .form-row {
          display: flex;
          gap: 30px;
          align-items: center;
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

        .sort-order {
          width: 120px;
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

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .gallery-card {
          overflow: hidden;
        }

        .gallery-card.inactive {
          opacity: 0.6;
        }

        .gallery-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .gallery-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        .gallery-content {
          padding: 20px;
        }

        .gallery-content h3 {
          font-size: 18px;
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .category {
          font-size: 14px;
          color: var(--color-primary);
          font-weight: 600;
          margin: 0 0 10px;
        }

        .description {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 15px;
          line-height: 1.5;
        }

        .gallery-actions {
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

          .gallery-grid {
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
