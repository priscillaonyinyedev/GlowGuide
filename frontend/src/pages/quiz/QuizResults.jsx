import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'
import { recommendationService } from '../../services/quizService'
import { formatPrice, titleCase } from '../../utils/format'
import RatingStars from '../../components/ui/RatingStars'
import { routineProductsFor } from '../../utils/routinePlan'

export default function QuizResults() {
  const { quizResultId } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    recommendationService
      .forQuizResult(quizResultId)
      .then((res) => {
        if (active) {
          setData(res)
          setStatus('success')
        }
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [quizResultId])

  return (
    <div className="container-editorial max-w-4xl py-16">
      <Seo title="Your Skin Quiz Results" path={`/quiz/results/${quizResultId}`} />

      <div className="mb-10 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-sage-500" />
        <h1 className="font-serif text-3xl text-mocha-900 sm:text-4xl">Your personalized results</h1>
        <p className="mt-2 text-sm text-mocha-500">
          Based on your answers, here's what we understand about your skin — and what we'd suggest.
        </p>
      </div>

      {status === 'loading' && <ProductGridSkeleton count={4} />}
      {status === 'error' && <ErrorState message="Couldn't load your results right now." />}

      {status === 'success' && data && (
        <>
          <div className="card-soft mb-10 grid gap-6 p-8 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-mocha-400">Skin Type</p>
              <p className="mt-1 font-serif text-xl text-mocha-900">{titleCase(data.quizResult?.skinType)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-mocha-400">Main Concerns</p>
              <p className="mt-1 text-sm text-mocha-700">
                {data.quizResult?.concerns?.map(titleCase).join(', ') || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-mocha-400">Sensitivity</p>
              <p className="mt-1 text-sm text-mocha-700">{titleCase(data.quizResult?.sensitivity)}</p>
            </div>
          </div>

          <section className="mb-10 rounded-3xl border border-beige-200 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-mocha-900">A routine shape for your answers</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mocha-600">
              These steps use the highest-scoring products from the catalogue for your quiz profile. A step is shown only when a matching product is available.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                { label: 'Morning', categories: ['CLEANSER', 'TONER', 'SERUM', 'MOISTURIZER', 'SUNSCREEN'] },
                { label: 'Evening', categories: ['CLEANSER', 'TONER', 'TREATMENT', 'SERUM', 'MOISTURIZER'] },
              ].map(({ label }) => {
                const chosen = routineProductsFor(data.recommendations, data.quizResult, label.toUpperCase())
                return (
                  <div key={label} className="rounded-2xl bg-cream-50 p-5">
                    <h3 className="font-medium text-mocha-900">{label}</h3>
                    {chosen.length ? (
                      <ol className="mt-3 space-y-2 text-sm text-mocha-700">
                        {chosen.map((product) => <li key={product.id} className="flex gap-2"><span className="text-plum-700">•</span><Link className="underline decoration-beige-400 underline-offset-2" to={`/products/${product.slug}`}>{product.name}</Link><span className="text-mocha-400">({product.category.toLowerCase().replaceAll('_', ' ')})</span></li>)}
                      </ol>
                    ) : <p className="mt-3 text-sm text-mocha-500">No matching steps are in the catalogue yet.</p>}
                    <Link className="mt-4 inline-flex text-sm font-medium text-plum-700 underline underline-offset-4" to={`/routines/new?quiz=${data.quizResult.id}&type=${label.toUpperCase()}`}>
                      Build this routine
                    </Link>
                  </div>
                )
              })}
            </div>
          </section>

          <h2 className="mb-6 font-serif text-2xl text-mocha-900">Recommended for you</h2>
          <div className="space-y-5">
            {data.recommendations?.length ? (
              data.recommendations.map((rec) => (
                <div key={rec.product.id} className="card-soft flex flex-col gap-5 p-5 sm:flex-row">
                  <Link
                    to={`/products/${rec.product.slug}`}
                    className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-beige-100 sm:w-40"
                  >
                    {rec.product.images?.[0] && (
                      <img src={rec.product.images[0]} alt={rec.product.name} className="h-full w-full object-cover" />
                    )}
                  </Link>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-mocha-400">{rec.product.brandName}</p>
                    <Link to={`/products/${rec.product.slug}`}>
                      <h3 className="font-serif text-lg text-mocha-900">{rec.product.name}</h3>
                    </Link>
                    <RatingStars rating={rec.product.averageRating} count={rec.product.reviewCount} />
                    <p className="mt-2 text-sm leading-relaxed text-mocha-600">{rec.reason}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif text-mocha-900">{formatPrice(rec.product.price)}</span>
                      <span className="rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
                        Match score: {rec.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-mocha-500">No strong matches yet — try adjusting your quiz answers.</p>
            )}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-mocha-400">
              Recommendations are educational and based on documented product characteristics — not a medical
              diagnosis or treatment plan.
            </p>
            <div className="flex gap-3">
              <Link to="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
