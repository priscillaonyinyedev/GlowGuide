import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, CirclePlay, Music2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { newsletterService } from '../../services/userService'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/brands', label: 'Brands' },
  { to: '/quiz', label: 'Skin Quiz' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/routines', label: 'Routines' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const SUPPORT = [
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
]

const SOCIALS = [
  { href: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL, label: 'Instagram', icon: Camera },
  { href: import.meta.env.VITE_SOCIAL_TIKTOK_URL, label: 'TikTok', icon: Music2 },
  { href: import.meta.env.VITE_SOCIAL_YOUTUBE_URL, label: 'YouTube', icon: CirclePlay },
].filter((item) => item.href)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await newsletterService.subscribe(email.trim())
      toast.success("You're on the list!")
      setEmail('')
    } catch {
      toast.error('Could not subscribe right now. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-beige-300/60 bg-mocha-900 text-cream-100">
      <div className="container-editorial grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="font-serif text-2xl text-cream-50">GlowGuide</span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200/80">
            An educational skincare companion — understand your skin, explore ingredients, and build a
            routine that actually fits, before you shop.
          </p>
          {SOCIALS.length > 0 && <div className="mt-6 flex gap-4">{SOCIALS.map(({ href, label, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-cream-200/80 transition-colors hover:text-cream-50"><Icon className="h-5 w-5" /></a>)}</div>}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300">Explore</h3>
          <ul className="space-y-2.5">
            {NAV.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream-200/80 hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300">Support</h3>
          <ul className="space-y-2.5">
            {SUPPORT.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream-200/80 hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300">Stay in the glow</h3>
          <p className="mb-4 text-sm text-cream-200/80">Skincare education and new arrivals, monthly.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-full border border-cream-100/20 bg-mocha-800 px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-sage-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-600 disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream-100/10 py-6">
        <p className="container-editorial text-center text-xs text-cream-300/70">
          © {new Date().getFullYear()} GlowGuide. Educational content only — not a substitute for professional
          dermatological advice.
        </p>
      </div>
    </footer>
  )
}
