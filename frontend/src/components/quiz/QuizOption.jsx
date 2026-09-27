import { Check } from 'lucide-react'

export default function QuizOption({ label, hint, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
        selected
          ? 'border-sage-500 bg-sage-50'
          : 'border-beige-300 bg-white hover:border-mocha-300'
      }`}
    >
      <span>
        <span className={`block text-sm font-medium ${selected ? 'text-sage-800' : 'text-mocha-800'}`}>{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-mocha-400">{hint}</span>}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-sage-500 bg-sage-500' : 'border-beige-300'
        }`}
      >
        {selected && <Check className="h-3 w-3 text-white" />}
      </span>
    </button>
  )
}
