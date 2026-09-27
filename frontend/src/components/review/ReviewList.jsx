import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import { reviewService } from '../../services/shoppingService'
import { useAuth } from '../../context/AuthContext'

export default function ReviewList({ productId }) {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setStatus('loading')
    reviewService
      .forProduct(productId)
      .then((data) => {
        setReviews(data.content ?? data ?? [])
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [productId])

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const review = await reviewService.create(productId, { rating, text: text.trim() })
      toast.success(review.status === 'PENDING' ? 'Review submitted for approval' : 'Review submitted')
      setText('')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <form onSubmit={submit} className="card-soft mb-8 space-y-3 p-5">
          <p className="text-sm font-medium text-mocha-800">Leave a review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)}>
                <Star className={`h-6 w-6 ${i <= rating ? 'fill-mocha-700 text-mocha-700' : 'text-beige-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your experience with this product…"
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          <Button type="submit" size="sm" isLoading={submitting}>
            Submit Review
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-mocha-500">Sign in to leave a review.</p>
      )}

      {status === 'loading' && <p className="text-sm text-mocha-400">Loading reviews…</p>}
      {status === 'success' && reviews.length === 0 && (
        <p className="text-sm text-mocha-500">No reviews yet — be the first to share your thoughts.</p>
      )}

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-beige-200 pb-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-mocha-800">{review.userName}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-mocha-700 text-mocha-700' : 'text-beige-300'}`} />
                ))}
              </div>
            </div>
            <p className="mt-1.5 text-sm text-mocha-600">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
