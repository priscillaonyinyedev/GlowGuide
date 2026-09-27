import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    authService.emailStatus()
      .then(setEmailStatus)
      .catch(() => setEmailStatus(null))
  }, [])

  const onSubmit = async ({ email }) => {
    setSubmitError('')
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (error) {
      const message = error.message || 'We could not submit the reset request. Please try again.'
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <>
      <Seo title="Forgot Password" path="/forgot-password" />
      <h1 className="mb-1 font-serif text-2xl text-mocha-900">Reset your password</h1>
      <p className="mb-6 text-sm text-mocha-500">
        Enter your account email to request a secure reset link.
      </p>

      {emailStatus?.resetEmailConfigured === false && <p className="mb-5 rounded-xl border border-peach-200 bg-peach-50 px-4 py-3 text-sm text-mocha-700">
        The server has no email credentials configured, so it cannot send a reset link yet.
      </p>}
      {emailStatus === null && <p className="mb-5 rounded-xl border border-beige-200 bg-beige-50 px-4 py-3 text-sm text-mocha-600">
        We could not confirm the server's email setup. You can submit a request, and the page will report if the server is unreachable.
      </p>}

      {sent ? (
        <p className="rounded-lg bg-sage-50 px-4 py-3 text-sm text-sage-700">
          {emailStatus?.resetEmailConfigured === false
            ? 'Your request reached the server, but email is not configured, so no reset email was sent. Ask the site owner to configure SMTP before trying again.'
            : 'If an account exists for that email, a reset message was requested. Check your inbox and spam folder.'}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-mocha-500">
        <Link to="/login" className="font-medium text-sage-700 hover:text-sage-800">
          Back to login
        </Link>
      </p>
    </>
  )
}
