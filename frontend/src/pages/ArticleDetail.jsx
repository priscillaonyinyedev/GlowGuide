import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import PageLoader from '../components/ui/PageLoader'
import ErrorState from '../components/ui/ErrorState'
import { articleService } from '../services/catalogService'

export default function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    articleService
      .getBySlug(slug)
      .then((data) => {
        if (active) {
          setArticle(data)
          setStatus('success')
        }
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [slug])

  if (status === 'loading') return <PageLoader />
  if (status === 'error' || !article) return <ErrorState message="This article couldn't be found." />

  return (
    <article className="container-editorial max-w-3xl py-16">
      <Seo
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        path={`/learn/${article.slug}`}
        image={article.coverImageUrl}
        type="article"
      />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">
        {article.category?.replaceAll('_', ' ')}
      </p>
      {article.demoData && <p className="mb-3 inline-block rounded-full bg-beige-100 px-2.5 py-1 text-[10px] font-medium text-mocha-500">Demo content</p>}
      <h1 className="font-serif text-4xl text-mocha-900">{article.title}</h1>
      <p className="mt-3 text-sm text-mocha-400">
        By {article.author} · {new Date(article.publishedAt).toLocaleDateString()}
      </p>

      {article.coverImageUrl && (
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-beige-100">
          <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="prose prose-mocha mt-8 max-w-none whitespace-pre-line text-mocha-700">{article.content}</div>
    </article>
  )
}
