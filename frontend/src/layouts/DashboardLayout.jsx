import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Heart,
  Sparkles,
  ClipboardList,
  Star,
  Package,
  Settings,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/saved', label: 'Saved Products', icon: Heart },
  { to: '/dashboard/routines', label: 'My Routines', icon: Sparkles },
  { to: '/dashboard/quiz-results', label: 'Quiz Results', icon: ClipboardList },
  { to: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { to: '/dashboard/orders', label: 'Orders', icon: Package },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <div className="container-editorial flex flex-1 flex-col gap-8 py-10 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-mocha-800 text-cream-50' : 'text-mocha-700 hover:bg-beige-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}
