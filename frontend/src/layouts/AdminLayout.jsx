import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  Users,
  ShoppingCart,
  Star,
  Tag,
  Grid3x3,
  ClipboardList,
  BarChart3,
} from 'lucide-react'

const LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/brands', label: 'Brands', icon: Tag },
  { to: '/admin/categories', label: 'Categories', icon: Grid3x3 },
  { to: '/admin/ingredients', label: 'Ingredients', icon: FlaskConical },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/quiz-data', label: 'Quiz data', icon: ClipboardList },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-cream-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-beige-300/60 bg-mocha-900 px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 px-2 font-serif text-xl text-cream-50">
          GlowGuide <span className="text-xs font-sans font-normal text-cream-300">Admin</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-cream-50 text-mocha-900' : 'text-cream-200/80 hover:bg-mocha-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="px-2 text-xs text-cream-300/70 hover:text-cream-100">
          ← Back to site
        </Link>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <nav className="flex gap-2 overflow-x-auto border-b border-beige-300 bg-white px-4 py-3 lg:hidden" aria-label="Admin navigation">
          {LINKS.map(({ to, label, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `shrink-0 rounded-full px-4 py-2 text-sm ${isActive ? 'bg-mocha-900 text-white' : 'bg-cream-100 text-mocha-800'}`}>{label}</NavLink>)}
        </nav>
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
