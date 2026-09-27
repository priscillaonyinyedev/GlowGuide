import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'GlowGuide'
const DEFAULT_IMAGE = '/og-image.svg'
const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')

/**
 * Reusable per-page SEO block: title, meta description, canonical URL, Open
 * Graph and Twitter card tags, plus optional JSON-LD structured data. Every
 * route that represents a distinct, indexable page should render this once.
 */
export default function Seo({ title, description, path = '', image = DEFAULT_IMAGE, type = 'website', structuredData }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Understand Your Skin. Glow for Life.`
  const canonical = `${SITE_URL}${path}`
  const absoluteImage = new URL(image, SITE_URL).toString()

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImage} />

      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  )
}
