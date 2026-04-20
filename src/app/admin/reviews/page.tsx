'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    // TODO: Create API endpoint
    // Mock data for now
    setReviews([
      {
        id: '1',
        customerName: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely amazing! The candy table was the highlight of our event.',
        imageUrl: null,
        isApproved: false,
        isFeatured: false,
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: '2',
        customerName: 'Mike Chen',
        rating: 4,
        comment: 'Great service and delicious treats. Would definitely recommend!',
        imageUrl: null,
        isApproved: true,
        isFeatured: true,
        createdAt: new Date(Date.now() - 172800000),
      },
    ])
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    // TODO: API call to approve
    setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r))
  }

  const handleReject = async (id: string) => {
    // TODO: API call to reject/delete
    setReviews(reviews.filter(r => r.id !== id))
  }

  const handleFeature = async (id: string) => {
    // TODO: API call to toggle featured
    setReviews(reviews.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : filter === 'approved' 
    ? reviews.filter(r => r.isApproved)
    : reviews.filter(r => !r.isApproved)

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1>Review Moderation</h1>
        <p>Manage customer reviews and testimonials</p>
      </div>

      <Card padding="lg">
        {/* Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h3>{review.customerName}</h3>
                    <div className="rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="review-badges">
                    {review.isApproved && <span className="badge approved">Approved</span>}
                    {review.isFeatured && <span className="badge featured">Featured</span>}
                    <span className="badge date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="review-comment">{review.comment}</p>

                <div className="review-actions">
                  {!review.isApproved && (
                    <>
                      <Button
                        onClick={() => handleApprove(review.id)}
                        variant="primary"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(review.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleFeature(review.id)}
                    variant="ghost"
                    size="sm"
                  >
                    {review.isFeatured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="empty-state">
                <p>No reviews found</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <style jsx>{`
        .reviews-page {
          max-width: 1200px;
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

        .loading {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-card {
          padding: 25px;
          background: var(--bg-main);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--border-color);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .reviewer-info h3 {
          font-size: 18px;
          margin: 0 0 5px;
          color: var(--text-primary);
        }

        .rating {
          color: #ffc107;
          font-size: 20px;
        }

        .review-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .badge.featured {
          background: #fff3cd;
          color: #856404;
        }

        .badge.date {
          background: white;
          color: var(--text-secondary);
        }

        .review-comment {
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-primary);
          margin: 0 0 20px;
        }

        .review-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
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
