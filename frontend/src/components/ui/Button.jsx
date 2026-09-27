import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-mocha-800 text-cream-50 hover:bg-mocha-900 active:bg-mocha-950',
  secondary: 'bg-transparent text-mocha-800 border border-mocha-800 hover:bg-mocha-800 hover:text-cream-50',
  sage: 'bg-sage-500 text-white hover:bg-sage-600 active:bg-sage-700',
  ghost: 'bg-transparent text-mocha-700 hover:bg-beige-200',
  danger: 'bg-transparent text-red-700 border border-red-200 hover:bg-red-50',
}

const SIZES = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-base px-8 py-4',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', isLoading = false, className = '', children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide
        transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

export default Button
