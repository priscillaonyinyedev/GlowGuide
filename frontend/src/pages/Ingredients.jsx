import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Seo from '../components/ui/Seo'
import { Skeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { ingredientService } from '../services/catalogService'
import { useDebounce } from '../hooks/useDebounce'
import { SKIN_CONCERNS } from '../utils/constants'
import { titleCase } from '../utils/format'

export default function Ingredients() {
  const [keyword, setKeyword] = useState('')
  const [concern, setConcern] = useState('')
  const debouncedKeyword = useDebounce(keyword, 350)

  const [ingredients, setIngredients] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    ingredientService
      .list({ q: debouncedKeyword || undefined, concern: concern || undefined, size: 50 })
      .then((data) => {
        if (active) {
          setIngredients(data.content ?? data ?? [])
          setStatus('success')
        }
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [debouncedKeyword, concern])

  return (
    <div className="container-editorial py-16">
      <Seo
        title="Ingredient Library"
        path="/ingredients"
        description="Learn what skincare ingredients actually do — educational profiles for niacinamide, retinol, vitamin C, and more."
      />

      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Ingredient Library</p>
        <h1 className="font-serif text-4xl text-mocha-900">Know what's in your products</h1>
        <p className="mt-4 text-mocha-600">
          Educational, plain-language profiles for the ingredients that show up most in skincare — what they do,
          who they suit, and what to know before combining them.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search ingredients…"
            className="w-full rounded-full border border-beige-300 bg-white py-3 pl-11 pr-4 text-sm focus:border-sage-400 focus:outline-none"
          />
        </div>
        <select
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          className="rounded-full border border-beige-300 bg-white px-4 py-3 text-sm text-mocha-700 focus:border-sage-400 focus:outline-none"
        >
          <option value="">All concerns</option>
          {SKIN_CONCERNS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-12">
        {status === 'loading' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {status === 'error' && <ErrorState message="Couldn't load the ingredient library right now." />}

        {status === 'success' && ingredients.length === 0 && (
          <EmptyState title="No ingredients found" description="Try a different search term or concern filter." />
        )}

        {status === 'success' && ingredients.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ingredient) => (
              <Link key={ingredient.slug} to={`/ingredients/${ingredient.slug}`} className="card-soft p-6">
                <h3 className="font-serif text-lg text-mocha-900">{ingredient.name}</h3>
                {ingredient.demoData && <span className="mt-1 inline-block rounded-full bg-beige-100 px-2 py-0.5 text-[10px] text-mocha-500">Demo content</span>}
                <p className="mt-2 text-sm text-mocha-500 line-clamp-3">{ingredient.whatItDoes}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ingredient.targetedConcerns?.slice(0, 2).map((c) => (
                    <span key={c} className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] font-medium text-sage-700">
                      {titleCase(c)}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
