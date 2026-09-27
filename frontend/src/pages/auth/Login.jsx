import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    setServerError('')
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Unable to log in')
      toast.error(err.message || 'Unable to log in')
    }
  }

  return (
    <>
      <Seo title="Log In" path="/login" />
      <h1 className="mb-1 font-serif text-2xl text-mocha-900">Welcome back</h1>
      <p className="mb-6 text-sm text-mocha-500">Log in to continue your skincare journey.</p>

      {serverError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{serverError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-mocha-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-sage-700 hover:text-sage-800">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mocha-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-sage-700 hover:text-sage-800">
          Sign up
        </Link>
      </p>
    </>
  )
}
