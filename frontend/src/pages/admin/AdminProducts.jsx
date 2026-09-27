import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/adminService'
import { brandService } from '../../services/catalogService'
import ErrorState from '../../components/ui/ErrorState'

const EMPTY = { name: '', slug: '', brandId: '', category: 'SERUM', price: '', currency: 'USD', description: '', officialUrl: '', stockQuantity: 0, featured: false, active: true, images: '', benefits: '', directions: '', ingredientSlugs: '', keyIngredientSlugs: '', suitableSkinTypes: '', targetedConcerns: '', tags: '', recommendedRoutineStep: '' }

export default function AdminProducts() {
  const [page, setPage] = useState(null)
  const [brands, setBrands] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const load = useCallback(() => adminService.products.list({ page: 0, size: 100 }).then(setPage).catch(() => setError(true)), [])
  useEffect(() => { load(); brandService.list().then(setBrands).catch(() => {}) }, [load])
  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const lines = (value) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
      const payload = { ...form, slug: form.slug || null, price: Number(form.price), stockQuantity: Number(form.stockQuantity), images: lines(form.images), benefits: lines(form.benefits), directions: lines(form.directions), ingredientSlugs: lines(form.ingredientSlugs), keyIngredientSlugs: lines(form.keyIngredientSlugs), suitableSkinTypes: lines(form.suitableSkinTypes), targetedConcerns: lines(form.targetedConcerns), tags: lines(form.tags) }
      if (editingId) await adminService.products.update(editingId, payload)
      else await adminService.products.create(payload)
      setForm(EMPTY)
      setEditingId(null)
      toast.success(editingId ? 'Product updated' : 'Product created')
      await load()
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save product') }
    finally { setSaving(false) }
  }
  const deactivate = async (id) => {
    try { await adminService.products.remove(id); toast.success('Product deactivated'); await load() }
    catch { toast.error('Could not deactivate product') }
  }
  const uploadProductImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const result = await adminService.uploadImage('product', file)
      setForm((current) => ({ ...current, images: [current.images, result.url].filter(Boolean).join(', ') }))
      toast.success('Image uploaded')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not upload image') }
    finally { event.target.value = '' }
  }
  const edit = (product) => {
    const lines = (items) => (items || []).join(', ')
    setEditingId(product.id)
    setForm({ name: product.name || '', slug: product.slug || '', brandId: product.brandId || '', category: product.category || 'SERUM', price: String(product.price ?? ''), currency: product.currency || 'USD', description: product.description || '', officialUrl: product.officialUrl || '', stockQuantity: product.stockQuantity || 0, featured: product.featured || false, active: product.active !== false, images: lines(product.images), benefits: lines(product.benefits), directions: lines(product.directions), ingredientSlugs: lines(product.ingredientSlugs), keyIngredientSlugs: lines(product.keyIngredientSlugs), suitableSkinTypes: lines(product.suitableSkinTypes), targetedConcerns: lines(product.targetedConcerns), tags: lines(product.tags), recommendedRoutineStep: product.recommendedRoutineStep || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (error) return <ErrorState message="Products unavailable. Confirm the backend is running and you are signed in as an administrator." />
  return <section>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">Catalogue</p>
    <h1 className="mt-2 font-serif text-4xl text-mocha-900">Products</h1>
    <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl border border-beige-300 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
      <input required maxLength="160" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <select required value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2"><option value="">Choose brand</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2">{['CLEANSER','TONER','SERUM','MOISTURIZER','SUNSCREEN','TREATMENT','MASK','EYE_CARE','LIP_CARE','BODY_CARE'].map((c) => <option key={c}>{c}</option>)}</select>
      <input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input required maxLength="3" minLength="3" placeholder="Currency (USD)" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input required type="number" min="0" placeholder="Stock quantity" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea required maxLength="5000" placeholder="Product description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-20 rounded-xl border border-beige-300 px-3 py-2 sm:col-span-2" />
      <input type="url" placeholder="Official brand product URL (optional)" value={form.officialUrl} onChange={(e) => setForm({ ...form, officialUrl: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2 sm:col-span-2" />
      <input placeholder="URL slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Recommended routine step" value={form.recommendedRoutineStep} onChange={(e) => setForm({ ...form, recommendedRoutineStep: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <div className="space-y-2"><textarea placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full rounded-xl border border-beige-300 px-3 py-2" /><label className="inline-flex cursor-pointer items-center rounded-full border border-beige-300 px-4 py-2 text-xs font-medium">Upload product image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadProductImage} className="sr-only" /></label></div>
      <textarea placeholder="Benefits (comma separated)" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <textarea placeholder="Directions (comma separated)" value={form.directions} onChange={(e) => setForm({ ...form, directions: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Ingredient slugs (comma separated)" value={form.ingredientSlugs} onChange={(e) => setForm({ ...form, ingredientSlugs: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Key ingredient slugs" value={form.keyIngredientSlugs} onChange={(e) => setForm({ ...form, keyIngredientSlugs: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Skin types: OILY, DRY, NORMAL…" value={form.suitableSkinTypes} onChange={(e) => setForm({ ...form, suitableSkinTypes: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Concerns: DEHYDRATION, ACNE_PRONE…" value={form.targetedConcerns} onChange={(e) => setForm({ ...form, targetedConcerns: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <input placeholder="Tags (fragrance-free, vegan…)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="rounded-xl border border-beige-300 px-3 py-2" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature this product</label>
      <div className="flex gap-2"><button disabled={saving || !brands.length} className="rounded-full bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY) }} className="rounded-full border border-beige-300 px-5 py-3 text-sm">Cancel</button>}</div>
    </form>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-beige-300 bg-white">
      <table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-cream-100 text-mocha-700"><tr><th className="p-4">Product</th><th className="p-4">Brand</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Action</th></tr></thead>
        <tbody>{(page?.content || []).map((p) => <tr key={p.id} className="border-t border-beige-200"><td className="p-4 font-medium">{p.name}{p.demoData && <span className="ml-2 text-xs text-plum-500">Seed</span>}</td><td className="p-4">{p.brandName}</td><td className="p-4">{p.currency} {Number(p.price).toFixed(2)}</td><td className="p-4">{p.stockQuantity}</td><td className="p-4"><div className="flex gap-3"><button onClick={() => edit(p)} className="text-sage-700 underline">Edit</button>{p.active && <button onClick={() => deactivate(p.id)} className="text-red-700 underline">Deactivate</button>}</div></td></tr>)}</tbody>
      </table>{!page?.content?.length && <p className="p-6 text-mocha-600">No products found.</p>}
    </div>
  </section>
}
