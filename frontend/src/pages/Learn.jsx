import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { articleService } from '../services/catalogService'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'SKINCARE_BASICS', label: 'Skincare Basics' },
  { value: 'INGREDIENTS', label: 'Ingredients' },
  { value: 'ROUTINES', label: 'Routines' },
  { value: 'SKIN_TYPES', label: 'Skin Types' },
  { value: 'PRODUCT_GUIDES', label: 'Product Guides' },
  { value: 'SKINCARE_TIPS', label: 'Skincare Tips' },
]

export default function Learn() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    articleService
      .list({ category: category || undefined, size: 24 })
      .then((data) => {
        setArticles(data.content ?? data ?? [])
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [category])

  return (
    <div className="container-editorial py-16">
      <Seo title="Learn" path="/learn" description="Educational skincare articles from GlowGuide — basics, ingredients, routines, and more." />

      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Learn</p>
        <h1 className="font-serif text-4xl text-mocha-900">Skincare, explained clearly</h1>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setSearchParams(c.value ? { category: c.value } : {})}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === c.value ? 'bg-mocha-800 text-cream-50' : 'bg-beige-100 text-mocha-600 hover:bg-beige-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-12">
        {status === 'loading' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {status === 'error' && <ErrorState message="Couldn't load articles right now." />}

        {status === 'success' && articles.length === 0 && (
          <EmptyState title="No articles yet in this category" description="Check back soon or explore another category." />
        )}

        {status === 'success' && articles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.slug} to={`/learn/${article.slug}`} className="card-soft overflow-hidden">
                <div className="aspect-[16/10] bg-beige-100">
                  {article.coverImageUrl && (
                    <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-sage-600">
                    {CATEGORIES.find((c) => c.value === article.category)?.label}
                  </p>
                  {article.demoData && <span className="mt-1 inline-block rounded-full bg-beige-100 px-2 py-0.5 text-[10px] text-mocha-500">Demo content</span>}
                  <h3 className="mt-2 font-serif text-lg text-mocha-900 line-clamp-2">{article.title}</h3>
                  <p className="mt-2 text-sm text-mocha-500 line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
