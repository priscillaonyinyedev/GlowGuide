import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/brands', label: 'Brands' },
  { to: '/learn', label: 'Learn' },
  { to: '/quiz', label: 'Skin Quiz' },
  { to: '/routines', label: 'Routines' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/about', label: 'About' },
]

const ACCOUNT_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/saved', label: 'Saved Products' },
  { to: '/dashboard/routines', label: 'My Routines' },
  { to: '/dashboard/quiz-results', label: 'Quiz Results' },
  { to: '/dashboard/settings', label: 'Settings' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const accountRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-beige-300/60 bg-cream-50/90 backdrop-blur-md">
      <div className="container-editorial flex h-20 items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-medium tracking-tight text-mocha-900">
          GlowGuide
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-mocha-900' : 'text-mocha-600 hover:text-mocha-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen((s) => !s)}
            className="rounded-full p-2 text-mocha-700 transition-colors hover:bg-beige-200"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/dashboard/saved"
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-mocha-700 transition-colors hover:bg-beige-200 sm:inline-flex"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-mocha-700 transition-colors hover:bg-beige-200"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sage-500 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((s) => !s)}
                className="flex items-center gap-1 rounded-full p-1.5 pr-2 text-mocha-700 transition-colors hover:bg-beige-200"
              >
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mocha-800 text-xs font-medium text-cream-50">
                    {user?.name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="card-soft absolute right-0 mt-2 w-56 overflow-hidden py-2"
                  >
                    <div className="border-b border-beige-200 px-4 py-2">
                      <p className="truncate text-sm font-medium text-mocha-900">{user?.name}</p>
                      <p className="truncate text-xs text-mocha-500">{user?.email}</p>
                    </div>
                    {ACCOUNT_LINKS.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2 text-sm text-mocha-700 hover:bg-beige-100"
                      >
                        {link.label}
                      </Link>
                    ))}
                    {user?.roles?.includes('ROLE_ADMIN') && <Link to="/admin" onClick={() => setAccountOpen(false)} className="block border-t border-beige-200 px-4 py-2 text-sm font-medium text-plum-700 hover:bg-beige-100">Admin dashboard</Link>}
                    <button
                      onClick={() => {
                        setAccountOpen(false)
                        logout()
                        navigate('/')
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-beige-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full p-2 text-mocha-700 transition-colors hover:bg-beige-200 sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-mocha-700 transition-colors hover:bg-beige-200 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-beige-300/60 bg-cream-50"
          >
            <form onSubmit={handleSearchSubmit} className="container-editorial flex items-center gap-3 py-4">
              <Search className="h-5 w-5 text-mocha-400" />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, ingredients…"
                className="w-full bg-transparent text-base text-mocha-900 placeholder:text-mocha-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-1.5 text-mocha-500 hover:bg-beige-200"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        accountLinks={user?.roles?.includes('ROLE_ADMIN') ? [...ACCOUNT_LINKS, { to: '/admin', label: 'Admin dashboard' }] : ACCOUNT_LINKS}
      />
    </header>
  )
}
