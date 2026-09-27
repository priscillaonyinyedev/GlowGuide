import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import ProductCard from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { productService } from '../services/productService'
import { SITE_STATS } from '../utils/constants'

const COMPANION_STEPS = [
  {
    label: 'Discover',
    title: 'Start with your skin',
    description: 'Share your skin type, concerns, sensitivities, budget, and the routine you prefer.',
    to: '/quiz',
    action: 'Take the skin quiz',
  },
  {
    label: 'Understand',
    title: 'Learn what your skin needs',
    description: 'Explore ingredient guides and practical skincare education in plain language.',
    to: '/learn',
    action: 'Explore the library',
  },
  {
    label: 'Analyze',
    title: 'See why products match',
    description: 'Recommendations are ranked from your answers, with clear reasons behind each match.',
    to: '/quiz',
    action: 'Get your matches',
  },
  {
    label: 'Build',
    title: 'Make a routine you can follow',
    description: 'Turn your morning and evening recommendations into step-by-step routines.',
    to: '/routines',
    action: 'Build your routine',
  },
  {
    label: 'Save & track',
    title: 'Keep your skincare organized',
    description: 'Save products and routines, revisit quiz results, and keep track of your activity.',
    to: '/dashboard',
    action: 'Open your dashboard',
  },
  {
    label: 'Shop direct',
    title: 'Buy from the brand',
    description: 'Compare product details here, then follow the brand link to check current price and availability.',
    to: '/shop',
    action: 'Explore products',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    productService
      .featured()
      .then((data) => {
        if (active) {
          setFeatured(data)
          setStatus('success')
        }
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Seo
        path="/"
        description="GlowGuide helps you understand your skin, learn about ingredients, and discover a personalized skincare routine."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-white to-peach-50">
        <div className="container-editorial grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">
              Personalized skincare, explained
            </p>
            <h1 className="font-serif text-4xl leading-[1.1] text-mocha-900 sm:text-5xl lg:text-6xl">
              Understand Your Skin.
              <br />
              Glow for Life.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-mocha-600 sm:text-lg">
              GlowGuide helps you understand your skin, learn what your ingredients actually do, and
              discover a personalized routine and products suited to you — not a trend.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/quiz">
                <Button size="lg" className="w-full sm:w-auto">
                  Take the Skin Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Products
                </Button>
              </Link>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {SITE_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wider text-mocha-400">{stat.label}</dt>
                  <dd className="font-serif text-2xl text-mocha-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-beige-200 shadow-[var(--shadow-lifted)] lg:aspect-[5/6]"
          >
            <img
              src="https://images.unsplash.com/photo-1693004925174-d9e06209d0ee?auto=format&fit=crop&w=1600&q=85"
              alt="A woman gently applying face cream as part of her skincare routine"
              className="h-full w-full object-cover object-[center_35%]"
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/product-placeholder.svg'
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mocha-950/45 via-transparent to-mocha-950/10" />
            <div className="absolute left-5 top-5 rounded-full border border-white/55 bg-cream-50/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-plum-800 shadow-sm backdrop-blur-sm sm:left-7 sm:top-7">
              A calmer kind of skincare
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <div className="max-w-[12rem] rounded-2xl border border-white/55 bg-cream-50/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-plum-700">Real products, real brands</p>
                <p className="mt-1 font-serif text-sm text-mocha-900">Beauty of Joseon · Relief Sun</p>
              </div>
              <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-2 shadow-lg sm:h-28 sm:w-24">
                <img
                  src="https://beautyofjoseon.com/cdn/shop/files/09_0805_Relief_sun_EU_UK_f73e0d53-3f10-4939-b886-734f50e4d51c.jpg?v=1787222768&width=500"
                  alt="Beauty of Joseon Relief Sun product"
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              </div>
            </div>
            <a href="https://unsplash.com/photos/a-woman-putting-cream-on-her-face-NdcuSGxKbwE" target="_blank" rel="noreferrer" className="absolute right-2 top-2 text-[10px] text-white/90 underline decoration-white/50 underline-offset-2">Photo by Leighann Blackwood</a>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-beige-300/60 bg-beige-100/60 py-20">
        <div className="container-editorial">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-700">Your skincare companion</p>
            <h2 className="mt-3 font-serif text-3xl text-mocha-900 sm:text-4xl">A thoughtful path from questions to routine</h2>
            <p className="mt-3 text-sm leading-relaxed text-mocha-600 sm:text-base">
              Understand first. Get recommendations you can review. Shop directly with the brand when you are ready.
            </p>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANION_STEPS.map(({ label, title, description, to, action }, index) => (
              <li key={label} className="card-soft flex h-full flex-col p-6 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-700">
                  <span className="mr-2 text-mocha-400">0{index + 1}</span>{label}
                </p>
                <h3 className="mt-4 font-serif text-xl text-mocha-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mocha-600">{description}</p>
                <Link to={to} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-plum-700 underline decoration-plum-300 underline-offset-4 hover:text-plum-900">
                  {action}<ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20">
        <div className="container-editorial">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-mocha-900">Explore products from real brands</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mocha-500">GlowGuide helps you compare products for your routine. When you are ready, follow a brand link to check its current price and buy directly.</p>
            </div>
            <Link to="/shop" className="hidden text-sm font-medium text-sage-700 hover:text-sage-800 sm:block">
              View all →
            </Link>
          </div>

          {status === 'loading' && <ProductGridSkeleton />}
          {status === 'error' && (
            <ErrorState
              message="The product catalogue could not connect to the GlowGuide backend. Start Spring Boot on port 8080, then retry."
              onRetry={() => window.location.reload()}
            />
          )}
          {status === 'success' && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mocha-900 py-20 text-cream-50">
        <div className="container-editorial flex flex-col items-center text-center">
          <h2 className="max-w-xl font-serif text-3xl sm:text-4xl">
            Not sure where to start? Let your skin lead the way.
          </h2>
          <p className="mt-4 max-w-md text-cream-200/80">
            Two minutes of questions. A clear, honest read on your skin — and products to match.
          </p>
          <Link to="/quiz" className="mt-8">
            <Button variant="sage" size="lg">
              Take the Skin Quiz
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
