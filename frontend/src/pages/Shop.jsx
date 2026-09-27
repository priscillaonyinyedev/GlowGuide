import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import Seo from '../components/ui/Seo'
import ProductCard from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { productService } from '../services/productService'
import { brandService, ingredientService } from '../services/catalogService'
import { useDebounce } from '../hooks/useDebounce'
import { PRODUCT_CATEGORIES, SKIN_TYPES, SKIN_CONCERNS } from '../utils/constants'

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
  { value: 'averageRating,desc', label: 'Highest Rated' },
  { value: 'createdAt,desc', label: 'Newest' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const debouncedKeyword = useDebounce(keyword, 400)

  const [brands, setBrands] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [status, setStatus] = useState('loading')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const productsRef = useRef(null)

  const category = searchParams.get('category') ?? ''
  const brandSlug = searchParams.get('brand') ?? ''
  const skinType = searchParams.get('skinType') ?? ''
  const concern = searchParams.get('concern') ?? ''
  const ingredient = searchParams.get('ingredient') ?? ''
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const minRating = searchParams.get('minRating') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '0', 10)
  const page = Number.isInteger(requestedPage) && requestedPage >= 0 ? requestedPage : 0

  useEffect(() => {
    brandService.list().then(setBrands).catch(() => setBrands([]))
    ingredientService.list({ size: 100 }).then((data) => setIngredients(data.content ?? data ?? [])).catch(() => setIngredients([]))
  }, [])

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (debouncedKeyword) next.set('q', debouncedKeyword)
      else next.delete('q')
      next.delete('page')
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword])

  useEffect(() => {
    let active = true
    setStatus('loading')

    const params = {
      q: searchParams.get('q') ?? undefined,
      category: category || undefined,
      brand: brandSlug || undefined,
      skinType: skinType || undefined,
      concern: concern || undefined,
      ingredient: ingredient || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      page,
      size: 12,
    }
    if (sort) {
      const [sortBy, direction] = sort.split(',')
      params.sortBy = sortBy
      params.direction = direction
    }

    productService
      .list(params)
      .then((data) => {
        if (!active) return
        setProducts(data.content ?? [])
        setTotalPages(data.totalPages ?? 0)
        setTotalProducts(data.totalElements ?? data.content?.length ?? 0)
        setStatus('success')
      })
      .catch(() => active && setStatus('error'))

    return () => {
      active = false
    }
  }, [searchParams, category, brandSlug, skinType, concern, ingredient, minPrice, maxPrice, minRating, sort, page])

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  const changePage = (nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextPage === 0) next.delete('page')
      else next.set('page', String(nextPage))
      return next
    })
    requestAnimationFrame(() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const clearFilters = () => {
    setKeyword('')
    setSearchParams({})
  }

  const activeFilterCount = useMemo(
    () => [category, brandSlug, skinType, concern, ingredient, minPrice, maxPrice, minRating].filter(Boolean).length,
    [category, brandSlug, skinType, concern, ingredient, minPrice, maxPrice, minRating]
  )

  return (
    <div className="container-editorial py-12">
      <Seo title="Shop" path="/shop" description="Browse GlowGuide's full skincare catalog — filter by skin type, concern, ingredient, and more." />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div ref={productsRef} className="scroll-mt-24">
          <h1 className="font-serif text-3xl text-mocha-900">Shop</h1>
          <p className="mt-1 text-sm text-mocha-500">{status === 'success' ? `${totalProducts} ${totalProducts === 1 ? 'product' : 'products'}${brands.length ? ` · ${brands.length} brands` : ''}` : 'Browse the full catalog'}</p>
          <p className="mt-1 text-xs text-mocha-400">Price references are in USD; brand sites show current local prices and availability.</p>
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products, brands, ingredients…"
          className="w-full rounded-full border border-beige-300 bg-white px-5 py-2.5 text-sm focus:border-sage-400 focus:outline-none sm:w-72"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center justify-between rounded-xl border border-beige-300 bg-white px-4 py-3 text-sm font-medium text-mocha-700 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && <span className="rounded-full bg-sage-500 px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>}
          </span>
        </button>

        <aside className={`${filtersOpen ? 'block' : 'hidden'} space-y-8 lg:block`}>
          <FilterGroup title="Category">
            {PRODUCT_CATEGORIES.map((c) => (
              <FilterOption key={c.value} label={c.label} active={category === c.value} onClick={() => updateParam('category', category === c.value ? '' : c.value)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Brand">
            {brands.slice(0, 12).map((b) => (
              <FilterOption key={b.slug} label={b.name} active={brandSlug === b.slug} onClick={() => updateParam('brand', brandSlug === b.slug ? '' : b.slug)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Skin Type">
            {SKIN_TYPES.map((s) => (
              <FilterOption key={s.value} label={s.label} active={skinType === s.value} onClick={() => updateParam('skinType', skinType === s.value ? '' : s.value)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Skin Concern">
            {SKIN_CONCERNS.map((c) => (
              <FilterOption key={c.value} label={c.label} active={concern === c.value} onClick={() => updateParam('concern', concern === c.value ? '' : c.value)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Ingredient">
            {ingredients.map((item) => (
              <FilterOption key={item.slug} label={item.name} active={ingredient === item.slug} onClick={() => updateParam('ingredient', ingredient === item.slug ? '' : item.slug)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Price range">
            <div className="grid grid-cols-2 gap-2 px-2">
              <label className="text-xs text-mocha-500">Min
                <input aria-label="Minimum price" type="number" min="0" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} className="mt-1 w-full rounded-lg border border-beige-300 bg-white px-2 py-1.5 text-sm" />
              </label>
              <label className="text-xs text-mocha-500">Max
                <input aria-label="Maximum price" type="number" min="0" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} className="mt-1 w-full rounded-lg border border-beige-300 bg-white px-2 py-1.5 text-sm" />
              </label>
            </div>
          </FilterGroup>

          <FilterGroup title="Minimum rating">
            <select aria-label="Minimum rating" value={minRating} onChange={(e) => updateParam('minRating', e.target.value)} className="mx-2 rounded-lg border border-beige-300 bg-white px-3 py-2 text-sm">
              <option value="">Any rating</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </FilterGroup>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-medium text-mocha-500 hover:text-mocha-700">
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
        </aside>

        <div>
          <div className="mb-6 flex justify-end">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-full border border-beige-300 bg-white px-4 py-2 text-sm text-mocha-700 focus:border-sage-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {status === 'loading' && <ProductGridSkeleton />}
          {status === 'error' && (
            <ErrorState
              message="The product catalogue could not connect to the GlowGuide backend. Start Spring Boot on port 8080, then retry."
              onRetry={() => window.location.reload()}
            />
          )}
          {status === 'success' && products.length === 0 && (
            <EmptyState title="No products match your filters" description="Try broadening your search or clearing a filter." />
          )}
          {status === 'success' && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Shop product pages" className="mt-10 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => changePage(page - 1)}
                    disabled={page === 0}
                    className="h-9 rounded-full px-4 text-sm font-medium text-mocha-600 transition-colors hover:bg-beige-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => changePage(i)}
                      aria-label={`Page ${i + 1}`}
                      aria-current={page === i ? 'page' : undefined}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                        page === i ? 'bg-mocha-800 text-cream-50' : 'text-mocha-600 hover:bg-beige-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => changePage(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="h-9 rounded-full px-4 text-sm font-medium text-mocha-600 transition-colors hover:bg-beige-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mocha-400">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

function FilterOption({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
        active ? 'bg-sage-100 text-sage-800' : 'text-mocha-600 hover:bg-beige-100'
      }`}
    >
      {label}
    </button>
  )
}
