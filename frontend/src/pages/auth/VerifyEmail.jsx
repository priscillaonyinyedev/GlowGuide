import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import { authService } from '../../services/authService'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="text-center">
      <Seo title="Verify Email" path="/verify-email" />

      {status === 'loading' && (
        <>
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-mocha-400" />
          <p className="text-sm text-mocha-600">Verifying your email…</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-sage-600" />
          <h1 className="font-serif text-2xl text-mocha-900">Email verified</h1>
          <p className="mt-2 text-sm text-mocha-500">Your account is fully activated.</p>
          <Link to="/dashboard" className="mt-6 inline-block text-sm font-medium text-sage-700">
            Go to Dashboard →
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="font-serif text-2xl text-mocha-900">Verification link invalid</h1>
          <p className="mt-2 text-sm text-mocha-500">This link may have expired. You can request a new one from your dashboard.</p>
          <Link to="/login" className="mt-6 inline-block text-sm font-medium text-sage-700">
            Back to login →
          </Link>
        </>
      )}
    </div>
  )
}
