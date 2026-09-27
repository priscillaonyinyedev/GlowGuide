import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageLoader from '../components/ui/PageLoader'
import ErrorState from '../components/ui/ErrorState'
import ProductCard from '../components/product/ProductCard'
import { ingredientService } from '../services/catalogService'
import { titleCase } from '../utils/format'

export default function IngredientDetail() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    ingredientService
      .getBySlug(slug)
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
  }, [slug])

  if (status === 'loading') return <PageLoader />
  if (status === 'error' || !data) return <ErrorState message="This ingredient couldn't be found." />

  const { ingredient, compatibleIngredients = [], cautionIngredients = [], products = [] } = data

  return (
    <div className="container-editorial max-w-4xl py-16">
      <Seo
        title={ingredient.name}
        path={`/ingredients/${ingredient.slug}`}
        description={ingredient.whatItDoes?.slice(0, 155)}
      />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Ingredient Profile</p>
      <h1 className="font-serif text-4xl text-mocha-900">{ingredient.name}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Section title="What it is">{ingredient.whatItIs}</Section>
          <Section title="What it does">{ingredient.whatItDoes}</Section>

          {ingredient.commonUses?.length > 0 && (
            <Section title="Common uses">
              <ul className="list-disc space-y-1 pl-5">
                {ingredient.commonUses.map((use) => (
                  <li key={use}>{use}</li>
                ))}
              </ul>
            </Section>
          )}

          {ingredient.usageInfo && <Section title="Usage information">{ingredient.usageInfo}</Section>}

          {ingredient.irritationConsiderations && (
            <div className="rounded-2xl bg-beige-100 p-5">
              <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-mocha-800">
                <AlertTriangle className="h-4 w-4 text-mocha-500" /> Irritation considerations
              </p>
              <p className="text-sm leading-relaxed text-mocha-600">{ingredient.irritationConsiderations}</p>
            </div>
          )}

          <p className="text-xs text-mocha-400">
            This content is educational and does not constitute medical advice. Patch test new products and
            consult a dermatologist for persistent skin concerns.
          </p>
        </div>

        <aside className="space-y-6">
          {ingredient.suitableSkinTypes?.length > 0 && (
            <div className="card-soft p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mocha-400">Suitable Skin Types</h3>
              <div className="flex flex-wrap gap-2">
                {ingredient.suitableSkinTypes.map((t) => (
                  <span key={t} className="rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
                    {titleCase(t)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ingredient.targetedConcerns?.length > 0 && (
            <div className="card-soft p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mocha-400">Targeted Concerns</h3>
              <div className="flex flex-wrap gap-2">
                {ingredient.targetedConcerns.map((c) => (
                  <span key={c} className="rounded-full bg-beige-100 px-3 py-1 text-xs font-medium text-mocha-700">
                    {titleCase(c)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {compatibleIngredients.length > 0 && (
            <div className="card-soft p-5">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-mocha-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-sage-500" /> Commonly Paired With
              </h3>
              <div className="flex flex-col gap-1">
                {compatibleIngredients.map((i) => (
                  <Link key={i.slug} to={`/ingredients/${i.slug}`} className="text-sm text-mocha-600 hover:text-sage-700">
                    {i.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {cautionIngredients.length > 0 && (
            <div className="card-soft p-5">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-mocha-400">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Use With Caution Alongside
              </h3>
              <div className="flex flex-col gap-1">
                {cautionIngredients.map((i) => (
                  <Link key={i.slug} to={`/ingredients/${i.slug}`} className="text-sm text-mocha-600 hover:text-sage-700">
                    {i.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {products.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl text-mocha-900">Products containing {ingredient.name}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-2 font-serif text-xl text-mocha-900">{title}</h2>
      <div className="text-sm leading-relaxed text-mocha-600">{children}</div>
    </div>
  )
}
