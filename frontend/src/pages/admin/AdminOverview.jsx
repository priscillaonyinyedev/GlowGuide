import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import ErrorState from '../../components/ui/ErrorState'

const LABELS = { products: 'Products', ingredients: 'Ingredients', users: 'Accounts', orders: 'Orders', reviews: 'Reviews' }

export default function AdminOverview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => { adminService.overview().then(setData).catch(() => setError(true)) }, [])
  if (error) return <ErrorState message="Admin overview unavailable. Check that the backend is running and your account has administrator access." />
  return <section>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">GlowGuide Pro</p>
    <h1 className="mt-2 font-serif text-4xl text-mocha-900">Admin overview</h1>
    <p className="mt-2 text-sm text-mocha-600">Live counts from the connected catalogue and account database.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(LABELS).map(([key, label]) => <article key={key} className="rounded-2xl border border-beige-300 bg-white p-6 shadow-sm">
        <p className="text-sm text-mocha-600">{label}</p><p className="mt-2 text-3xl font-semibold text-mocha-900">{data?.[key] ?? '—'}</p>
      </article>)}
    </div>
    <Link to="/admin/products" className="mt-8 inline-flex rounded-full bg-mocha-900 px-5 py-3 text-sm font-semibold text-white">Manage products</Link>
  </section>
}
