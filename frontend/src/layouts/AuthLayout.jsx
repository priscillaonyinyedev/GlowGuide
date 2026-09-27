import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-serif text-3xl text-mocha-900">
          GlowGuide
        </Link>
        <div className="card-soft p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
