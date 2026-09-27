import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageLoader from '../../components/ui/PageLoader'
import { useAuth } from '../../context/AuthContext'

/** Landing point for Spring Security's Google OAuth2 redirect (see OAuth2AuthenticationSuccessHandler on the backend). */
export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams()
  const { applyToken } = useAuth()
  const navigate = useNavigate()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const token = new URLSearchParams(window.location.hash.slice(1)).get('token') || searchParams.get('token')
    if (!token) {
      toast.error('Google sign-in failed. Please try again.')
      navigate('/login', { replace: true })
      return
    }

    // Keep the short-lived bearer token out of the address bar and browser history.
    window.history.replaceState(null, '', window.location.pathname)

    applyToken(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => {
        toast.error('Google sign-in failed. Please try again.')
        navigate('/login', { replace: true })
      })
  }, [searchParams, applyToken, navigate])

  return <PageLoader />
}
