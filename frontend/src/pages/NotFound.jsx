import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Seo title="Page Not Found" path="/404" />
      <p className="font-serif text-6xl text-mocha-300">404</p>
      <h1 className="mt-4 font-serif text-2xl text-mocha-900">We couldn't find that page</h1>
      <p className="mt-2 text-sm text-mocha-500">The page you're looking for may have moved or no longer exists.</p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
