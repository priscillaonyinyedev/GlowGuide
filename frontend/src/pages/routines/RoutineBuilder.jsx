import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUp, ArrowDown, X, Search, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import PageLoader from '../../components/ui/PageLoader'
import { routineService } from '../../services/routineService'
import { productService } from '../../services/productService'
import { recommendationService } from '../../services/quizService'
import { useDebounce } from '../../hooks/useDebounce'
import { routineProductsFor } from '../../utils/routinePlan'

const TYPES = ['MORNING', 'EVENING', 'CUSTOM']

export default function RoutineBuilder() {
  const { routineId } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = !!routineId
  const quizResultId = searchParams.get('quiz')
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [type, setType] = useState('MORNING')
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(isEditing || !!quizResultId)
  const [saving, setSaving] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 350)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (!isEditing) return
    routineService
      .get(routineId)
      .then((routine) => {
        setName(routine.name)
        setType(routine.type)
        setSteps(routine.steps ?? [])
      })
      .catch(() => toast.error('Could not load this routine'))
      .finally(() => setLoading(false))
  }, [routineId, isEditing])

  useEffect(() => {
    if (isEditing || !quizResultId) return
    const routineType = searchParams.get('type') === 'EVENING' ? 'EVENING' : 'MORNING'
    setType(routineType)
    setName(routineType === 'MORNING' ? 'My Morning Routine' : 'My Evening Routine')
    recommendationService.forQuizResult(quizResultId)
      .then((result) => {
        const selected = routineProductsFor(result.recommendations, result.quizResult, routineType)
        setSteps(selected.map((product, order) => ({
          order,
          productId: product.id,
          productName: product.name,
          productImageUrl: product.images?.[0],
          category: product.category,
        })))
        if (selected.length === 0) toast.error('No matching catalogue products were found. Add products from the shop to build this routine.')
      })
      .catch(() => toast.error('Could not load your quiz-based suggestions. You can still search the catalogue below.'))
      .finally(() => setLoading(false))
  }, [isEditing, quizResultId, searchParams])

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([])
      return
    }
    productService
      .list({ q: debouncedSearch, size: 6 })
      .then((data) => setSearchResults(data.content ?? []))
      .catch(() => setSearchResults([]))
  }, [debouncedSearch])

  const addProduct = (product) => {
    setSteps((prev) => [
      ...prev,
      {
        order: prev.length,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.images?.[0],
        category: product.category,
      },
    ])
    setSearchTerm('')
    setSearchResults([])
  }

  const removeStep = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })))
  }

  const moveStep = (index, direction) => {
    setSteps((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next.map((s, i) => ({ ...s, order: i }))
    })
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Give your routine a name')
      return
    }
    if (steps.length === 0) {
      toast.error('Add at least one product')
      return
    }
    setSaving(true)
    try {
      const payload = { name: name.trim(), type, steps }
      if (isEditing) {
        await routineService.update(routineId, payload)
        toast.success('Routine updated')
      } else {
        await routineService.create(payload)
        toast.success('Routine saved')
      }
      navigate('/routines')
    } catch (err) {
      toast.error(err.message || 'Could not save routine')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="container-editorial max-w-3xl py-12">
      <Seo title={isEditing ? 'Edit Routine' : 'Build a Routine'} path="/routines/new" />

      <h1 className="mb-8 font-serif text-3xl text-mocha-900">{isEditing ? 'Edit Routine' : 'Build a Routine'}</h1>

      <div className="card-soft space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Routine name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Morning Glow"
              className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Add a product</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products to add…"
              className="w-full rounded-xl border border-beige-300 bg-cream-50 py-2.5 pl-11 pr-4 text-sm focus:border-sage-400 focus:outline-none"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-beige-200 overflow-hidden rounded-xl border border-beige-200">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="flex w-full items-center gap-3 bg-white px-4 py-2.5 text-left hover:bg-beige-50"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-beige-100">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-mocha-800">{product.name}</p>
                    <p className="truncate text-xs text-mocha-400">{product.brandName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-mocha-700">Steps ({steps.length})</p>
          {steps.length === 0 ? (
            <p className="rounded-xl border border-dashed border-beige-300 px-4 py-8 text-center text-sm text-mocha-400">
              Search above to add your first product.
            </p>
          ) : (
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={`${step.productId}-${i}`} className="flex items-center gap-3 rounded-xl border border-beige-200 bg-white p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                    {i + 1}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-beige-100">
                    {step.productImageUrl && <img src={step.productImageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <p className="flex-1 truncate text-sm text-mocha-800">{step.productName}</p>
                  <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="text-mocha-400 hover:text-mocha-700 disabled:opacity-30">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="text-mocha-400 hover:text-mocha-700 disabled:opacity-30">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeStep(i)} className="text-mocha-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <Button onClick={handleSave} isLoading={saving} className="w-full">
          <Save className="h-4 w-4" /> Save Routine
        </Button>
      </div>
    </div>
  )
}
