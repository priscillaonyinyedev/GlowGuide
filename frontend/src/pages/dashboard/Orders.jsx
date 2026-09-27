import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import EmptyState from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { orderService } from '../../services/shoppingService'
import { formatPrice, titleCase } from '../../utils/format'

const STATUS_COLORS = {
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-sage-50 text-sage-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    orderService
      .myOrders()
      .then((data) => {
        setOrders(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <Seo title="Orders" path="/dashboard/orders" />
      <h1 className="mb-6 font-serif text-3xl text-mocha-900">Orders</h1>

      {status === 'loading' && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {status === 'success' && orders.length === 0 && (
        <EmptyState icon={Package} title="No orders yet" description="Your order history will appear here once you check out." />
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/dashboard/orders/${order.id}`} className="card-soft flex items-center justify-between p-5">
            <div>
              <p className="font-serif text-lg text-mocha-900">{order.orderNumber}</p>
              <p className="text-sm text-mocha-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} items</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-beige-100 text-mocha-600'}`}>
                {titleCase(order.status)}
              </span>
              <span className="font-serif text-mocha-900">{formatPrice(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
