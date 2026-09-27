import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Seo from '../../components/ui/Seo'
import PageLoader from '../../components/ui/PageLoader'
import ErrorState from '../../components/ui/ErrorState'
import { orderService } from '../../services/shoppingService'
import { formatPrice, titleCase } from '../../utils/format'

export default function OrderDetail() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    orderService
      .get(orderId)
      .then((data) => {
        setOrder(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [orderId])

  if (status === 'loading') return <PageLoader />
  if (status === 'error' || !order) return <ErrorState message="Could not find this order." />

  return (
    <div className="max-w-2xl">
      <Seo title={`Order ${order.orderNumber}`} path={`/dashboard/orders/${order.id}`} />
      <h1 className="mb-1 font-serif text-3xl text-mocha-900">Order {order.orderNumber}</h1>
      <p className="mb-6 text-sm text-mocha-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="card-soft mb-6 p-6">
        <h2 className="mb-4 font-serif text-lg text-mocha-900">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-mocha-600">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatPrice(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="my-4 h-px bg-beige-200" />
        <div className="flex justify-between font-serif text-lg text-mocha-900">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-soft p-6">
          <h2 className="mb-2 font-serif text-lg text-mocha-900">Delivery</h2>
          <p className="text-sm text-mocha-600">
            {order.shippingAddress?.fullName}<br />
            {order.shippingAddress?.line1}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.country}
          </p>
        </div>
        <div className="card-soft p-6">
          <h2 className="mb-2 font-serif text-lg text-mocha-900">Status</h2>
          <p className="text-sm text-mocha-600">Order: {titleCase(order.status)}</p>
          <p className="text-sm text-mocha-600">Payment: {titleCase(order.payment?.status)}</p>
        </div>
      </div>
    </div>
  )
}
