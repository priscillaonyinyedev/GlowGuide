import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, count, size = 'sm' }) {
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${dimension} ${
              i <= Math.round(rating) ? 'fill-mocha-700 text-mocha-700' : 'fill-beige-200 text-beige-200'
            }`}
          />
        ))}
      </div>
      {typeof count === 'number' && <span className="text-xs text-mocha-500">({count})</span>}
    </div>
  )
}
