import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import PageLoader from '../components/ui/PageLoader'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/shoppingService'
import { formatPrice } from '../utils/format'

export default function Checkout() {
  const { cart, isLoading, refresh } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (isLoading) return <PageLoader />
  if (!cart || cart.items?.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  const onSubmit = async (data) => {
    setPlacing(true)
    try {
      const order = await orderService.checkout({
          shippingAddress: {
          fullName: data.fullName,
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone,
          },
        payment: { provider: 'demo' },
      })
      await refresh()
      toast.success('Order placed!')
      navigate(`/dashboard/orders/${order.id}`)
    } catch (err) {
      toast.error(err.message || 'Could not place your order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container-editorial py-12">
      <Seo title="Checkout" path="/checkout" />
      <h1 className="mb-8 font-serif text-3xl text-mocha-900">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="card-soft p-6">
            <h2 className="mb-4 font-serif text-xl text-mocha-900">Customer & Delivery Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName} span>
                <input {...register('fullName', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input {...register('phone', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="Address line 1" error={errors.line1} span>
                <input {...register('line1', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="Address line 2 (optional)">
                <input {...register('line2')} className={inputClass} />
              </Field>
              <Field label="City" error={errors.city}>
                <input {...register('city', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="State / Province" error={errors.state}>
                <input {...register('state', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="Postal code" error={errors.postalCode}>
                <input {...register('postalCode', { required: 'Required' })} className={inputClass} />
              </Field>
              <Field label="Country" error={errors.country}>
                <input {...register('country', { required: 'Required' })} className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="card-soft p-6">
            <h2 className="mb-1 flex items-center gap-2 font-serif text-xl text-mocha-900">
              <Lock className="h-4 w-4 text-sage-600" /> Payment
            </h2>
            <p className="mb-4 text-xs text-mocha-400">
              Demo checkout only. No payment is collected or charge made. A payment provider must be integrated before accepting real orders.
            </p>
            <label className="flex items-start gap-3 text-sm text-mocha-700">
              <input type="checkbox" {...register('demoAcknowledged', { required: true })} className="mt-1 accent-sage-600" />
              <span>I understand this creates an unpaid demo order and does not charge me.</span>
            </label>
            {errors.demoAcknowledged && <p className="mt-2 text-xs text-red-600">Please acknowledge the demo checkout.</p>}
          </section>
        </div>

        <div className="card-soft h-fit p-6">
          <h2 className="mb-4 font-serif text-xl text-mocha-900">Order Summary</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-mocha-600">
                <span className="truncate pr-2">
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 h-px bg-beige-200" />
          <div className="space-y-2 text-sm text-mocha-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(cart.shippingFee ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(cart.tax ?? 0)}</span>
            </div>
          </div>
          <div className="my-4 h-px bg-beige-200" />
          <div className="flex justify-between font-serif text-lg text-mocha-900">
            <span>Total</span>
            <span>{formatPrice(cart.total ?? cart.subtotal)}</span>
          </div>
          <Button type="submit" isLoading={placing} className="mt-6 w-full">
            Place Order
          </Button>
        </div>
      </form>
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none'

function Field({ label, error, span, children }) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium text-mocha-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  )
}
