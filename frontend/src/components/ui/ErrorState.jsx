import { AlertCircle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-beige-100 px-6 py-16 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-mocha-400" />
      <p className="text-sm text-mocha-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  )
}
