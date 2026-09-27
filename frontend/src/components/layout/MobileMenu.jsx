import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function MobileMenu({ isOpen, onClose, navLinks, accountLinks }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-mocha-950/40 lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-cream-50 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-beige-300/60 px-6 py-5">
              <span className="font-serif text-xl text-mocha-900">GlowGuide</span>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-beige-200" aria-label="Close menu">
                <X className="h-5 w-5 text-mocha-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isAuthenticated && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-beige-100 p-4">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mocha-800 text-sm font-medium text-cream-50">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-mocha-900">{user?.name}</p>
                    <p className="truncate text-xs text-mocha-500">{user?.email}</p>
                  </div>
                </div>
              )}

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-mocha-400">Browse</p>
              <nav className="mb-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className="rounded-lg px-3 py-2.5 text-base text-mocha-800 hover:bg-beige-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {isAuthenticated ? (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-mocha-400">Account</p>
                  <nav className="flex flex-col gap-1">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className="rounded-lg px-3 py-2.5 text-base text-mocha-800 hover:bg-beige-100"
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isAdmin && !accountLinks.some((link) => link.to === '/admin') && <Link to="/admin" onClick={onClose} className="rounded-lg px-3 py-2.5 text-base font-medium text-plum-700 hover:bg-beige-100">Admin dashboard</Link>}
                    <button
                      onClick={() => {
                        onClose()
                        logout()
                        navigate('/')
                      }}
                      className="mt-2 rounded-lg px-3 py-2.5 text-left text-base text-red-600 hover:bg-beige-100"
                    >
                      Logout
                    </button>
                  </nav>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="rounded-full border border-mocha-800 px-6 py-3 text-center text-sm font-medium text-mocha-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="rounded-full bg-mocha-800 px-6 py-3 text-center text-sm font-medium text-cream-50"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
