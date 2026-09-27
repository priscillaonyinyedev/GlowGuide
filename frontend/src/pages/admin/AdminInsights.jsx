import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import ErrorState from '../../components/ui/ErrorState'

function SummaryCard({ label, value }) {
  return <article className="rounded-2xl border border-beige-300 bg-white p-5 shadow-soft"><p className="text-sm text-mocha-600">{label}</p><p className="mt-2 text-3xl font-semibold text-mocha-900">{value ?? '—'}</p></article>
}

function Breakdown({ title, data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1])
  return <section className="rounded-2xl border border-beige-300 bg-white p-5"><h2 className="text-xl">{title}</h2>{entries.length ? <ul className="mt-4 space-y-3">{entries.map(([label, count]) => <li key={label} className="flex justify-between border-b border-beige-200 pb-2 text-sm"><span>{label.replaceAll('_', ' ').toLowerCase()}</span><strong>{count}</strong></li>)}</ul> : <p className="mt-4 text-sm text-mocha-600">No quiz data yet.</p>}</section>
}

export default function AdminInsights({ section }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const title = section === 'quiz-data' ? 'Quiz insights' : 'Analytics'
  useEffect(() => {
    const request = section === 'quiz-data' ? adminService.quizData() : adminService.analytics()
    request.then(setData).catch(() => setError(true))
  }, [section])
  if (error) return <ErrorState message={`${title} are unavailable. Check the backend connection and administrator access.`} />
  if (section === 'quiz-data') return <section>
    <p className="eyebrow">Administration</p><h1 className="mt-2">Quiz insights</h1><p className="mt-2 text-sm text-mocha-600">Aggregated responses only. Individual quiz answers and account details are not shown here.</p>
    <div className="mt-6"><SummaryCard label="Quiz submissions" value={data?.total} /></div>
    <div className="mt-5 grid gap-4 lg:grid-cols-2"><Breakdown title="Skin types" data={data?.skinTypes} /><Breakdown title="Concerns" data={data?.concerns} /><Breakdown title="Sensitivity" data={data?.sensitivities} /><Breakdown title="Budget range" data={data?.budgets} /></div>
  </section>
  return <section>
    <p className="eyebrow">Administration</p><h1 className="mt-2">Analytics</h1><p className="mt-2 text-sm text-mocha-600">Current database totals; sample catalogue content is counted separately.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard label="Users" value={data?.users} /><SummaryCard label="Products" value={data?.products} /><SummaryCard label="Sample products" value={data?.sampleProducts} /><SummaryCard label="Ingredients" value={data?.ingredients} /><SummaryCard label="Orders" value={data?.orders} /><SummaryCard label="Unpaid orders" value={data?.unpaidOrders} /><SummaryCard label="Reviews" value={data?.reviews} /><SummaryCard label="Pending reviews" value={data?.pendingReviews} /></div>
  </section>
}
