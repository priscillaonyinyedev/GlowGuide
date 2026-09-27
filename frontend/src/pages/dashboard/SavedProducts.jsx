import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import EmptyState from '../../components/ui/EmptyState'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'
import ProductCard from '../../components/product/ProductCard'
import { wishlistService } from '../../services/shoppingService'

export default function SavedProducts() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    wishlistService
      .get()
      .then((data) => {
        setProducts(data.products ?? [])
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <Seo title="Saved Products" path="/dashboard/saved" />
      <h1 className="mb-6 font-serif text-3xl text-mocha-900">Saved Products</h1>

      {status === 'loading' && <ProductGridSkeleton count={4} />}
      {status === 'success' && products.length === 0 && (
        <EmptyState icon={Heart} title="No saved products yet" description="Tap the heart icon on any product to save it here." />
      )}
      {status === 'success' && products.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
