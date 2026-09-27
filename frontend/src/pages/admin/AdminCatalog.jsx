import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/adminService'
import ErrorState from '../../components/ui/ErrorState'

const CATEGORIES = ['CLEANSER','TONER','SERUM','MOISTURIZER','SUNSCREEN','TREATMENT','MASK','EYE_CARE','LIP_CARE','BODY_CARE']
const EMPTY = { name: '', slug: '', description: '', logoUrl: '', countryOfOrigin: '', key: 'SERUM', imageUrl: '' }

export default function AdminCatalog({ section }) {
  const isBrand = section === 'brands'
  const title = isBrand ? 'Brands' : 'Categories'
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const load = useCallback(async () => {
    try { setItems(await (isBrand ? adminService.brands.list() : adminService.categories.list())); setError(false) }
    catch { setError(true) }
  }, [isBrand])
  useEffect(() => { load() }, [load])

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = isBrand
        ? { name: form.name, slug: form.slug || null, description: form.description, logoUrl: form.logoUrl, countryOfOrigin: form.countryOfOrigin }
        : { name: form.name, slug: form.slug || null, description: form.description, imageUrl: form.imageUrl, key: form.key }
      if (editing) await (isBrand ? adminService.brands.update(editing, payload) : adminService.categories.update(editing, payload))
      else await (isBrand ? adminService.brands.create(payload) : adminService.categories.create(payload))
      toast.success(editing ? `${title.slice(0, -1)} updated` : `${title.slice(0, -1)} added`)
      setEditing(null); setForm(EMPTY); await load()
    } catch (e) { toast.error(e.response?.data?.message || `Could not save ${title.toLowerCase()}`) }
    finally { setSaving(false) }
  }

  const edit = (item) => {
    setEditing(item.id)
    setForm({ ...EMPTY, ...item })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return
    try { await (isBrand ? adminService.brands.remove(item.id) : adminService.categories.remove(item.id)); toast.success(`${title.slice(0, -1)} deleted`); await load() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not delete this item') }
  }

  if (error) return <ErrorState message={`${title} could not load. Check the backend and administrator access.`} onRetry={load} />
  return <section>
    <p className="eyebrow">Catalogue</p><h1 className="mt-2">{title}</h1>
    <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border border-beige-300 bg-white p-5 md:grid-cols-2">
      <input required maxLength="140" placeholder={`${title.slice(0, -1)} name`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input maxLength="160" placeholder="URL slug (automatic if blank)" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea maxLength="1200" placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      {isBrand ? <><input maxLength="1000" placeholder="Logo URL" value={form.logoUrl || ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" /><input maxLength="100" placeholder="Country of origin" value={form.countryOfOrigin || ''} onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" /></> : <><select value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2">{CATEGORIES.map((key) => <option key={key}>{key}</option>)}</select><input maxLength="1000" placeholder="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" /></>}
      <div className="flex gap-2"><button disabled={saving} className="rounded-full bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : `Add ${title.slice(0, -1).toLowerCase()}`}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY) }} className="rounded-full border border-beige-300 px-5 py-3 text-sm">Cancel</button>}</div>
    </form>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-beige-300 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl">{item.name}</h2><p className="mt-1 text-xs text-mocha-600">/{item.slug}</p></div>{item.demoData && <span className="rounded-full bg-peach-100 px-2 py-1 text-xs text-plum-700">Sample</span>}</div><p className="mt-3 text-sm text-mocha-600">{item.description || 'No description provided.'}</p><div className="mt-4 flex gap-4 text-sm"><button onClick={() => edit(item)} className="text-sage-700 underline">Edit</button><button onClick={() => remove(item)} className="text-red-700 underline">Delete</button></div></article>)}</div>
  </section>
}
