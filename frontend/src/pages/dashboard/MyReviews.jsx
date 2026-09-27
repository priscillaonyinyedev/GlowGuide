import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import EmptyState from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import api from '../../services/api'

export default function MyReviews() {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api
      .get('/reviews/mine')
      .then((res) => {
        setReviews(res.data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <Seo title="My Reviews" path="/dashboard/reviews" />
      <h1 className="mb-6 font-serif text-3xl text-mocha-900">My Reviews</h1>

      {status === 'loading' && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {status === 'success' && reviews.length === 0 && (
        <EmptyState icon={Star} title="No reviews yet" description="Reviews you leave on products will appear here." />
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card-soft p-5">
            <div className="flex items-center justify-between">
              <Link to={`/products/${review.productSlug}`} className="font-serif text-lg text-mocha-900 hover:text-sage-700">
                {review.productName}
              </Link>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-mocha-700 text-mocha-700' : 'text-beige-300'}`} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-mocha-600">{review.text}</p>
            <p className="mt-2 text-xs text-mocha-400">Status: {review.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
