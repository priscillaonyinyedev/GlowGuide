import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async ({ name, email, password }) => {
    setServerError('')
    try {
      await signup(name, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Unable to create account')
      toast.error(err.message || 'Unable to create account')
    }
  }

  return (
    <>
      <Seo title="Sign Up" path="/signup" />
      <h1 className="mb-1 font-serif text-2xl text-mocha-900">Create your account</h1>
      <p className="mb-6 text-sm text-mocha-500">Start building a routine that fits your skin.</p>

      {serverError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Name</label>
          <input
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

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
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Password</label>
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
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mocha-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sage-700 hover:text-sage-800">
          Log in
        </Link>
      </p>
    </>
  )
}
