import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Seo from '../components/ui/Seo'
import ErrorState from '../components/ui/ErrorState'
import { brandService } from '../services/catalogService'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [status, setStatus] = useState('loading')
  const loadBrands = useCallback(() => {
    setStatus('loading')
    brandService.list()
      .then((data) => { setBrands(data); setStatus('success') })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => { loadBrands() }, [loadBrands])

  return (
    <main className="container-editorial py-12 sm:py-16">
      <Seo title="Skincare Brands" path="/brands" description="Explore skincare brands in the GlowGuide product catalogue." />
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-plum-700"><Sparkles className="h-4 w-4" /> The catalogue</p>
        <h1 className="mt-3 font-serif text-4xl text-mocha-900 sm:text-5xl">Brands we know by name</h1>
        <p className="mt-4 leading-relaxed text-mocha-600">Browse familiar skincare brands and explore the products currently listed for each. Product details link back to the brand for the latest formula and price information.</p>
        {status === 'success' && <p className="mx-auto mt-5 inline-flex rounded-full border border-beige-200 bg-white/80 px-4 py-2 text-xs font-medium tracking-wide text-mocha-600">{brands.length} curated brands · product shopping stays with each brand</p>}
      </div>

      {status === 'loading' && <p className="py-16 text-center text-sm text-mocha-500" role="status">Loading brands…</p>}
      {status === 'error' && <div className="mx-auto mt-12 max-w-xl"><ErrorState message="We couldn't load the brand directory. Check that the GlowGuide API is running, then try again." onRetry={loadBrands} /></div>}
      {status === 'success' && brands.length === 0 && <p className="py-16 text-center text-mocha-600">No brands have been added to the catalogue yet.</p>}
      {status === 'success' && brands.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link key={brand.id} to={`/shop?brand=${encodeURIComponent(brand.slug)}`} className="group overflow-hidden rounded-3xl border border-beige-300/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[var(--shadow-lifted)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream-100 via-white to-peach-50">
                {brand.featuredImageUrl ? (
                  <img src={brand.featuredImageUrl} alt={`${brand.name} featured product`} loading="lazy" className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]" />
                ) : brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} loading="lazy" className="h-full w-full object-contain p-10" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-plum-800"><span className="font-serif text-6xl">{brand.name.slice(0, 1)}</span></div>
                )}
                <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-plum-800 shadow-sm">{brand.featuredImageUrl ? 'Brand edit' : 'The catalogue'}</span>
                <ArrowUpRight className="absolute right-4 top-4 h-9 w-9 rounded-full bg-white/90 p-2 text-mocha-600 shadow-sm transition group-hover:text-plum-700" />
              </div>
              <div className="p-6">
                <h2 className="font-serif text-2xl text-mocha-900">{brand.name}</h2>
                {brand.countryOfOrigin && <p className="mt-1 text-xs uppercase tracking-wider text-mocha-400">{brand.countryOfOrigin}</p>}
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-mocha-600">{brand.description || 'Explore products from this brand in the GlowGuide catalogue.'}</p>
                <span className="mt-5 inline-flex text-sm font-medium text-plum-700">Browse products <span className="ml-1" aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
