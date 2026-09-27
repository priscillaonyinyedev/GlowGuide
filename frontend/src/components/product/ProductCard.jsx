import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import RatingStars from '../ui/RatingStars'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice } from '../../utils/format'
import { titleCase } from '../../utils/format'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="card-soft group flex flex-col overflow-hidden"
    >
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-br from-cream-50 via-white to-peach-50">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={`${product.brandName} ${product.name}`}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = '/product-placeholder.svg'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-mocha-300">
            <span className="font-serif text-lg">GlowGuide</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-sage-600 text-sage-600' : 'text-mocha-500'}`} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-mocha-400">{product.brandName}</p>
          {product.demoData && <span className="rounded-full bg-beige-100 px-2 py-0.5 text-[10px] text-mocha-500">Sourced seed</span>}
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg leading-snug text-mocha-900 line-clamp-2">{product.name}</h3>
        </Link>

        <RatingStars rating={product.averageRating} count={product.reviewCount} />

        {product.suitableSkinTypes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.suitableSkinTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] font-medium text-sage-700"
              >
                {titleCase(type)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span>
            <span className="block text-[10px] uppercase tracking-wider text-mocha-400">Brand price reference</span>
            <span className="font-serif text-lg text-mocha-900">{formatPrice(product.price, product.currency)}</span>
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 rounded-full border border-mocha-800 py-2.5 text-center text-xs font-medium tracking-wide text-mocha-800 transition-colors hover:bg-mocha-800 hover:text-cream-50"
          >
            View
          </Link>
          <button
            onClick={() => addItem(product.id, 1)}
            className="flex-1 rounded-full bg-mocha-800 py-2.5 text-center text-xs font-medium tracking-wide text-cream-50 transition-colors hover:bg-mocha-900"
          >
            Add to Cart
          </button>
        </div>
        {product.officialUrl && (
          <a
            href={product.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-1 text-center text-xs font-medium text-plum-700 underline decoration-plum-300 underline-offset-4 hover:text-plum-900"
          >
            Shop at {product.brandName} ↗
          </a>
        )}
      </div>
    </motion.div>
  )
}
