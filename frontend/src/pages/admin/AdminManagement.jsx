import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/adminService'
import ErrorState from '../../components/ui/ErrorState'

const CONFIG = {
  ingredients: { title: 'Ingredients', note: 'Maintain the educational ingredient library.' },
  users: { title: 'Users', note: 'Manage accounts and administrator access.' },
  orders: { title: 'Orders', note: 'Review demo orders. Pending payment orders cannot be shipped.' },
  reviews: { title: 'Reviews', note: 'New customer reviews stay hidden until approved.' },
}

export default function AdminManagement({ section }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const EMPTY_INGREDIENT = { name: '', slug: '', whatItIs: '', whatItDoes: '', commonUses: '', suitableSkinTypes: '', targetedConcerns: '', usageInfo: '', irritationConsiderations: '', compatibleIngredientSlugs: '', cautionIngredientSlugs: '', imageUrl: '' }
  const [form, setForm] = useState(EMPTY_INGREDIENT)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [saving, setSaving] = useState(false)
  const config = CONFIG[section]
  const load = useCallback(async () => {
    try {
      let page
      if (section === 'ingredients') page = await adminService.ingredients.list({ page: 0, size: 100 })
      if (section === 'users') page = await adminService.users.list({ page: 0, size: 100, q: search || undefined })
      if (section === 'orders') page = await adminService.orders.list({ page: 0, size: 100 })
      if (section === 'reviews') page = await adminService.reviews.list({ page: 0, size: 100, status: status || undefined })
      setData(page)
      setError(false)
    } catch { setError(true) }
  }, [section, search, status])
  useEffect(() => { load() }, [load])

  const createIngredient = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const split = (value) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
      const payload = { ...form, slug: form.slug || null, commonUses: split(form.commonUses), suitableSkinTypes: split(form.suitableSkinTypes), targetedConcerns: split(form.targetedConcerns), compatibleIngredientSlugs: split(form.compatibleIngredientSlugs), cautionIngredientSlugs: split(form.cautionIngredientSlugs) }
      if (editingIngredient) await adminService.ingredients.update(editingIngredient, payload)
      else await adminService.ingredients.create(payload)
      setForm(EMPTY_INGREDIENT)
      setEditingIngredient(null)
      toast.success(editingIngredient ? 'Ingredient updated' : 'Ingredient added')
      await load()
    } catch (e) { toast.error(e.response?.data?.message || 'Could not add ingredient') }
    finally { setSaving(false) }
  }

  const act = async (operation, success) => {
    try { await operation(); toast.success(success); await load() }
    catch (e) { toast.error(e.response?.data?.message || 'Action could not be completed') }
  }
  const uploadIngredientImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const result = await adminService.uploadImage('ingredient', file)
      setForm((current) => ({ ...current, imageUrl: result.url }))
      toast.success('Image uploaded')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not upload image') }
    finally { event.target.value = '' }
  }

  if (error) return <ErrorState message={`${config.title} management is unavailable. Check the backend connection and administrator role.`} onRetry={load} />
  const rows = data?.content || []
  return <section>
    <p className="eyebrow">Administration</p>
    <h1 className="mt-2">{config.title}</h1>
    <p className="mt-2 text-sm text-mocha-600">{config.note}</p>

    {section === 'ingredients' && <form onSubmit={createIngredient} className="mt-6 grid gap-3 rounded-2xl border border-beige-300 bg-white p-5 md:grid-cols-2">
      <input required maxLength="120" placeholder="Ingredient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input maxLength="140" placeholder="URL slug (automatic if blank)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input required maxLength="800" placeholder="What it is" value={form.whatItIs} onChange={(e) => setForm({ ...form, whatItIs: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea required maxLength="1200" placeholder="What it does" value={form.whatItDoes} onChange={(e) => setForm({ ...form, whatItDoes: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea maxLength="1200" placeholder="Usage information" value={form.usageInfo} onChange={(e) => setForm({ ...form, usageInfo: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea maxLength="1200" placeholder="Irritation considerations" value={form.irritationConsiderations} onChange={(e) => setForm({ ...form, irritationConsiderations: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Common uses (comma separated)" value={form.commonUses} onChange={(e) => setForm({ ...form, commonUses: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Skin types: OILY, DRY, NORMAL…" value={form.suitableSkinTypes} onChange={(e) => setForm({ ...form, suitableSkinTypes: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Concerns: DEHYDRATION, ACNE_PRONE…" value={form.targetedConcerns} onChange={(e) => setForm({ ...form, targetedConcerns: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Compatible ingredient slugs" value={form.compatibleIngredientSlugs} onChange={(e) => setForm({ ...form, compatibleIngredientSlugs: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Caution ingredient slugs" value={form.cautionIngredientSlugs} onChange={(e) => setForm({ ...form, cautionIngredientSlugs: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <div className="space-y-2"><input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-xl border border-beige-300 px-3 py-2" /><label className="inline-flex cursor-pointer items-center rounded-full border border-beige-300 px-4 py-2 text-xs font-medium">Upload ingredient image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadIngredientImage} className="sr-only" /></label></div>
      <div className="flex gap-2"><button disabled={saving} className="rounded-full bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editingIngredient ? 'Save changes' : 'Add ingredient'}</button>{editingIngredient && <button type="button" onClick={() => { setEditingIngredient(null); setForm(EMPTY_INGREDIENT) }} className="rounded-full border border-beige-300 px-5 py-3 text-sm">Cancel</button>}</div>
    </form>}

    {section === 'users' && <div className="mt-6 flex gap-2"><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="w-full max-w-md rounded-full border border-beige-300 bg-white px-4 py-2" /></div>}
    {section === 'reviews' && <div className="mt-6"><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-beige-300 bg-white px-4 py-2"><option value="">All reviews</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="HIDDEN">Hidden</option></select></div>}

    <div className="mt-6 overflow-x-auto rounded-2xl border border-beige-300 bg-white">
      {section === 'ingredients' && <table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-cream-200 text-mocha-700"><tr><th className="p-4">Ingredient</th><th className="p-4">Description</th><th className="p-4">Skin types</th><th className="p-4">Action</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-beige-200"><td className="p-4 font-medium">{item.name}{item.demoData && <span className="ml-2 text-xs text-plum-500">Sample</span>}</td><td className="max-w-sm p-4">{item.whatItDoes}</td><td className="p-4">{(item.suitableSkinTypes || []).join(', ') || '—'}</td><td className="p-4"><div className="flex gap-3"><button className="text-sage-700 underline" onClick={() => { const join = (values) => (values || []).join(', '); setEditingIngredient(item.id); setForm({ name: item.name, slug: item.slug, whatItIs: item.whatItIs, whatItDoes: item.whatItDoes, commonUses: join(item.commonUses), suitableSkinTypes: join(item.suitableSkinTypes), targetedConcerns: join(item.targetedConcerns), usageInfo: item.usageInfo || '', irritationConsiderations: item.irritationConsiderations || '', compatibleIngredientSlugs: join(item.compatibleIngredientSlugs), cautionIngredientSlugs: join(item.cautionIngredientSlugs), imageUrl: item.imageUrl || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button><button className="text-red-700 underline" onClick={() => window.confirm(`Delete ${item.name}?`) && act(() => adminService.ingredients.remove(item.id), 'Ingredient deleted')}>Delete</button></div></td></tr>)}</tbody></table>}

      {section === 'users' && <table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-cream-200 text-mocha-700"><tr><th className="p-4">Account</th><th className="p-4">Email status</th><th className="p-4">Role</th><th className="p-4">Access</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-beige-200"><td className="p-4"><strong>{item.name}</strong><br /><span className="text-mocha-600">{item.email}</span></td><td className="p-4">{item.emailVerified ? 'Verified' : 'Unverified'}</td><td className="p-4">{(item.roles || []).map((r) => r.replace('ROLE_', '')).join(', ')}</td><td className="p-4"><button className="text-mocha-800 underline" onClick={() => act(() => adminService.users.setEnabled(item.id, !item.enabled), item.enabled ? 'Account disabled' : 'Account enabled')}>{item.enabled ? 'Disable' : 'Enable'}</button>{' · '}<button className="text-mocha-800 underline" onClick={() => { const next = item.roles?.includes('ROLE_ADMIN') ? ['ROLE_USER'] : ['ROLE_USER', 'ROLE_ADMIN']; if (window.confirm(`Update administrator access for ${item.email}?`)) act(() => adminService.users.updateRoles(item.id, next), 'Roles updated') }}>Toggle admin</button></td></tr>)}</tbody></table>}

      {section === 'orders' && <table className="w-full min-w-[740px] text-left text-sm"><thead className="bg-cream-200 text-mocha-700"><tr><th className="p-4">Order</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-beige-200"><td className="p-4 font-medium">{item.orderNumber}</td><td className="p-4">{(item.productNames || []).join(', ')}</td><td className="p-4">${Number(item.total).toFixed(2)}</td><td className="p-4"><select aria-label={`Status for ${item.orderNumber}`} value={item.status} onChange={(e) => act(() => adminService.orders.updateStatus(item.id, e.target.value), 'Order status updated')} className="rounded-lg border border-beige-300 px-2 py-1">{['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>}

      {section === 'reviews' && <table className="w-full min-w-[740px] text-left text-sm"><thead className="bg-cream-200 text-mocha-700"><tr><th className="p-4">Review</th><th className="p-4">Rating</th><th className="p-4">Status</th><th className="p-4">Moderation</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-beige-200"><td className="max-w-md p-4"><strong>{item.productName}</strong><br />{item.text}<br /><span className="text-xs text-mocha-600">by {item.userName}</span></td><td className="p-4">{item.rating}/5</td><td className="p-4">{item.status}</td><td className="p-4"><div className="flex gap-3">{item.status !== 'APPROVED' && <button className="text-sage-700 underline" onClick={() => act(() => adminService.reviews.moderate(item.id, 'APPROVED'), 'Review approved')}>Approve</button>}{item.status !== 'HIDDEN' && <button className="text-plum-500 underline" onClick={() => act(() => adminService.reviews.moderate(item.id, 'HIDDEN'), 'Review hidden')}>Hide</button>}<button className="text-red-700 underline" onClick={() => window.confirm('Permanently delete this review?') && act(() => adminService.reviews.remove(item.id), 'Review deleted')}>Delete</button></div></td></tr>)}</tbody></table>}
      {rows.length === 0 && <p className="p-6 text-mocha-600">Nothing to show yet.</p>}
    </div>
  </section>
}
