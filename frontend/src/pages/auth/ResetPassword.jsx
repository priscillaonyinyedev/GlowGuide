import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async ({ password }) => {
    setServerError('')
    try {
      await authService.resetPassword(token, password)
      toast.success('Password updated. Please log in.')
      navigate('/login', { replace: true })
    } catch (err) {
      setServerError(err.message || 'This reset link is invalid or has expired.')
    }
  }

  if (!token) {
    return (
      <>
        <Seo title="Reset Password" path="/reset-password" />
        <p className="text-sm text-mocha-600">This password reset link is missing a token.</p>
        <Link to="/forgot-password" className="mt-4 inline-block text-sm font-medium text-sage-700">
          Request a new link
        </Link>
      </>
    )
  }

  return (
    <>
      <Seo title="Reset Password" path="/reset-password" />
      <h1 className="mb-1 font-serif text-2xl text-mocha-900">Choose a new password</h1>
      <p className="mb-6 text-sm text-mocha-500">Make it at least 8 characters, with a mix of letters and numbers.</p>

      {serverError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">New Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Include an uppercase letter, lowercase letter, and a number',
              },
            })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Reset Password
        </Button>
      </form>
    </>
  )
}
