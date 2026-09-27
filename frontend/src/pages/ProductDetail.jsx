import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import RatingStars from '../components/ui/RatingStars'
import PageLoader from '../components/ui/PageLoader'
import ErrorState from '../components/ui/ErrorState'
import ProductCard from '../components/product/ProductCard'
import ReviewList from '../components/review/ReviewList'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, titleCase } from '../utils/format'

const TABS = ['Description', 'Ingredients', 'Directions', 'Reviews']

export default function ProductDetail() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()

  useEffect(() => {
    let active = true
    setStatus('loading')
    productService
      .getBySlug(slug)
      .then((res) => {
        if (active) {
          setData(res)
          setStatus('success')
        }
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [slug])

  if (status === 'loading') return <PageLoader />
  if (status === 'error' || !data) return <ErrorState message="This product couldn't be found." />

  const { product, relatedIngredients = [], relatedProducts = [] } = data
  const wishlisted = isWishlisted(product.id)

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brandName },
    aggregateRating: product.reviewCount
      ? { '@type': 'AggregateRating', ratingValue: product.averageRating, reviewCount: product.reviewCount }
      : undefined,
    url: product.officialUrl,
  }

  return (
    <div className="container-editorial py-12">
      <Seo
        title={product.name}
        path={`/products/${product.slug}`}
        description={product.description?.slice(0, 155)}
        image={product.images?.[0]}
        type="product"
        structuredData={structuredData}
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-cream-50 via-white to-peach-50 p-5">
            {product.images?.[0] && (
              <img src={product.images[0]} alt={`${product.brandName} ${product.name}`} className="h-full w-full object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/product-placeholder.svg' }} />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-cream-50 via-white to-peach-50 p-2">
              <img src={img} alt={`${product.brandName} ${product.name} image ${i + 2}`} className="h-full w-full object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/product-placeholder.svg' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-600">{product.brandName}</p>
          {product.demoData && <span className="mt-2 inline-block rounded-full bg-beige-100 px-2.5 py-1 text-[10px] font-medium text-mocha-500">Development catalogue · verify current label and price</span>}
          <h1 className="mt-2 font-serif text-3xl text-mocha-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <RatingStars rating={product.averageRating} count={product.reviewCount} size="md" />
          </div>
          <p className="mt-4 font-serif text-2xl text-mocha-900">{formatPrice(product.price, product.currency)}</p>

          {product.suitableSkinTypes?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.suitableSkinTypes.map((t) => (
                <span key={t} className="rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
                  {titleCase(t)}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 leading-relaxed text-mocha-600">{product.description}</p>
          {product.officialUrl && (
            <a href={product.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center rounded-full bg-plum-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-900">
              Buy from {product.brandName} ↗
            </a>
          )}

          {product.recommendedRoutineStep && (
            <p className="mt-4 text-sm text-mocha-500">
              <span className="font-medium text-mocha-700">Routine step: </span>
              {product.recommendedRoutineStep}
            </p>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-beige-300">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-mocha-700">
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2.5 text-mocha-700">
                +
              </button>
            </div>
            <Button onClick={() => addItem(product.id, quantity)} className="flex-1">
              <ShoppingBag className="h-4 w-4" /> Save to Cart
            </Button>
            <button
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-beige-300 transition-colors hover:bg-beige-100"
            >
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-sage-600 text-sage-600' : 'text-mocha-500'}`} />
            </button>
          </div>

          {product.benefits?.length > 0 && (
            <div className="mt-10 rounded-2xl bg-sage-50 p-5">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-sage-800">
                <Sparkles className="h-4 w-4" /> Why GlowGuide recommends this
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-sage-700">
                {product.benefits.slice(0, 3).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-sage-600">
                Based on this product's documented ingredients and skin-type suitability — not a guarantee of results.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-beige-300">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab ? 'border-b-2 border-mocha-800 text-mocha-900' : 'text-mocha-400 hover:text-mocha-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'Description' && (
            <div className="prose max-w-none text-mocha-700">
              <p>{product.description}</p>
              {product.benefits?.length > 0 && (
                <>
                  <h3 className="font-serif text-lg text-mocha-900">Benefits</h3>
                  <ul>
                    {product.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {activeTab === 'Ingredients' && (
            <div>
              <p className="mb-4 text-sm text-mocha-500">Key and full ingredient list for this product.</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredientSlugs?.map((slug) => (
                  <Link
                    key={slug}
                    to={`/ingredients/${slug}`}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      product.keyIngredientSlugs?.includes(slug)
                        ? 'bg-sage-100 font-medium text-sage-800'
                        : 'bg-beige-100 text-mocha-600'
                    } hover:bg-sage-200`}
                  >
                    {titleCase(slug)}
                  </Link>
                ))}
              </div>
              {relatedIngredients.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {relatedIngredients.map((ing) => (
                    <Link key={ing.slug} to={`/ingredients/${ing.slug}`} className="card-soft p-4">
                      <p className="font-serif text-base text-mocha-900">{ing.name}</p>
                      <p className="mt-1 text-xs text-mocha-500 line-clamp-2">{ing.whatItDoes}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Directions' && (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-mocha-700">
              {product.directions?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}

          {activeTab === 'Reviews' && <ReviewList productId={product.id} />}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl text-mocha-900">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
