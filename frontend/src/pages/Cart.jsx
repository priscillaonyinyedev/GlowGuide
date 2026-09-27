import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageLoader from '../components/ui/PageLoader'
import ErrorState from '../components/ui/ErrorState'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { cart, isLoading, error, refresh, updateItem, removeItem } = useCart()

  if (isLoading) return <PageLoader />
  if (error) return <div className="container-editorial py-16"><Seo title="Your Cart" path="/cart" /><ErrorState message={error} onRetry={refresh} /></div>

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="container-editorial py-16">
        <Seo title="Your Cart" path="/cart" />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the shop to find products suited to your skin."
          action={
            <Link to="/shop">
              <Button size="sm">Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-editorial py-12">
      <Seo title="Your Cart" path="/cart" />
      <h1 className="mb-8 font-serif text-3xl text-mocha-900">Your Cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card-soft flex items-center gap-4 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-beige-100">
                {item.productImageUrl && (
                  <img src={item.productImageUrl} alt={item.productName} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/product-placeholder.svg' }} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-mocha-400">{item.brandName}</p>
                <Link to={`/products/${item.productSlug}`} className="truncate font-serif text-base text-mocha-900 hover:text-sage-700">
                  {item.productName}
                </Link>
                {item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs font-medium text-plum-700 underline underline-offset-4">Buy from {item.brandName} ↗</a>}
                <p className="mt-1 text-sm text-mocha-500">{formatPrice(item.unitPrice)}</p>
              </div>
              <div className="flex items-center rounded-full border border-beige-300">
                <button
                  onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                  className="p-2 text-mocha-600"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateItem(item.productId, item.quantity + 1)} className="p-2 text-mocha-600">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="w-20 text-right font-serif text-mocha-900">{formatPrice(item.lineTotal)}</p>
              <button onClick={() => removeItem(item.productId)} className="text-mocha-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <Link to="/shop" className="inline-block text-sm font-medium text-sage-700 hover:text-sage-800">
            ← Continue shopping
          </Link>
        </div>

        <div className="card-soft h-fit p-6">
          <h2 className="mb-4 font-serif text-xl text-mocha-900">Price reference</h2>
          <p className="mb-4 text-sm leading-relaxed text-mocha-500">GlowGuide doesn’t sell or ship these products. Prices are references only and may change by country or retailer. Use each brand link to check availability and purchase.</p>
          <div className="space-y-2 text-sm text-mocha-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Set by brand</span>
            </div>
          </div>
          <div className="my-4 h-px bg-beige-200" />
          <div className="flex justify-between font-serif text-lg text-mocha-900">
            <span>Product estimate</span>
            <span>{formatPrice(cart.total ?? cart.subtotal)}</span>
          </div>
          <Link to="/shop" className="mt-6 block text-center text-sm font-medium text-sage-700 hover:text-sage-800">Continue exploring products</Link>
        </div>
      </div>
    </div>
  )
}
