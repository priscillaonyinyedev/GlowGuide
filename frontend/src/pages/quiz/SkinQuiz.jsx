import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import QuizOption from '../../components/quiz/QuizOption'
import { quizService } from '../../services/quizService'
import {
  SKIN_TYPES,
  SKIN_CONCERNS,
  SENSITIVITY_LEVELS,
  BUDGET_RANGES,
  PRODUCT_CATEGORIES,
  ROUTINE_STEP_COUNTS,
} from '../../utils/constants'

const PREFERENCE_OPTIONS = [
  'Fragrance-free',
  'Cruelty-free',
  'Vegan',
  'Natural / Clean',
  'Science-backed actives',
  'K-beauty',
]

const INITIAL_ANSWERS = {
  skinType: '',
  concerns: [],
  sensitivity: '',
  currentRoutineProducts: [],
  productPreferences: [],
  routinePreferences: [],
  budget: '',
  avoidedIngredients: '',
  preferredRoutineSteps: null,
}

const STEPS = [
  { key: 'skinType', title: 'What is your skin type?' },
  { key: 'concerns', title: 'What are your main skin concerns?', subtitle: 'Select all that apply.' },
  { key: 'sensitivity', title: 'How sensitive is your skin?' },
  { key: 'currentRoutineProducts', title: 'What does your current routine include?', subtitle: 'Select all that apply.' },
  { key: 'productPreferences', title: 'What type of products do you prefer?', subtitle: 'Select all that apply.' },
  { key: 'routinePreferences', title: 'Which optional routine steps would you like?', subtitle: 'Choose toner or a targeted treatment if you want one. You can leave both unselected.' },
  { key: 'budget', title: 'What is your approximate skincare budget?', subtitle: 'Per product.' },
  { key: 'avoidedIngredients', title: 'Any ingredients you prefer to avoid?', subtitle: 'Optional — separate with commas.' },
  { key: 'preferredRoutineSteps', title: 'How many routine steps do you prefer?' },
]

function toggleInArray(array, value) {
  return array.includes(value) ? array.filter((v) => v !== value) : [...array, value]
}

export default function SkinQuiz() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [submitting, setSubmitting] = useState(false)

  const step = STEPS[stepIndex]
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100)

  const isStepValid = () => {
    const value = answers[step.key]
    if (step.key === 'avoidedIngredients') return true
    if (Array.isArray(value)) return true // optional multi-selects
    return value !== '' && value !== null
  }

  const goNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
      return
    }
    await submitQuiz()
  }

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const submitQuiz = async () => {
    setSubmitting(true)
    try {
      const payload = {
        ...answers,
        avoidedIngredients: answers.avoidedIngredients
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }
      const result = await quizService.submit(payload)
      toast.success('Quiz complete!')
      navigate(`/quiz/results/${result.id}`)
    } catch {
      toast.error('Could not submit your quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-editorial max-w-2xl py-16">
      <Seo title="Skin Quiz" path="/quiz" description="Take the GlowGuide Skin Quiz for a personalized routine and product recommendations." />

      <div className="mb-10">
        <div className="mb-2 flex justify-between text-xs font-medium text-mocha-500">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-beige-200">
          <motion.div
            className="h-full rounded-full bg-sage-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <h1 className="font-serif text-2xl text-mocha-900 sm:text-3xl">{step.title}</h1>
          {step.subtitle && <p className="mt-1.5 text-sm text-mocha-500">{step.subtitle}</p>}

          <div className="mt-8 space-y-3">
            {step.key === 'skinType' &&
              SKIN_TYPES.map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  selected={answers.skinType === opt.value}
                  onClick={() => setAnswers((a) => ({ ...a, skinType: opt.value }))}
                />
              ))}

            {step.key === 'concerns' &&
              SKIN_CONCERNS.map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  selected={answers.concerns.includes(opt.value)}
                  onClick={() => setAnswers((a) => ({ ...a, concerns: toggleInArray(a.concerns, opt.value) }))}
                />
              ))}

            {step.key === 'sensitivity' &&
              SENSITIVITY_LEVELS.map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  selected={answers.sensitivity === opt.value}
                  onClick={() => setAnswers((a) => ({ ...a, sensitivity: opt.value }))}
                />
              ))}

            {step.key === 'currentRoutineProducts' &&
              PRODUCT_CATEGORIES.map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  selected={answers.currentRoutineProducts.includes(opt.value)}
                  onClick={() =>
                    setAnswers((a) => ({
                      ...a,
                      currentRoutineProducts: toggleInArray(a.currentRoutineProducts, opt.value),
                    }))
                  }
                />
              ))}

            {step.key === 'productPreferences' &&
              PREFERENCE_OPTIONS.map((opt) => (
                <QuizOption
                  key={opt}
                  label={opt}
                  selected={answers.productPreferences.includes(opt)}
                  onClick={() =>
                    setAnswers((a) => ({
                      ...a,
                      productPreferences: toggleInArray(a.productPreferences, opt),
                    }))
                  }
                />
              ))}

            {step.key === 'routinePreferences' &&
              [
                { value: 'TONER', label: 'Include a toner step' },
                { value: 'TREATMENT', label: 'Include a targeted treatment step' },
              ].map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  selected={answers.routinePreferences.includes(opt.value)}
                  onClick={() => setAnswers((a) => ({
                    ...a,
                    routinePreferences: toggleInArray(a.routinePreferences, opt.value),
                  }))}
                />
              ))}

            {step.key === 'budget' &&
              BUDGET_RANGES.map((opt) => (
                <QuizOption
                  key={opt.value}
                  label={opt.label}
                  hint={opt.hint}
                  selected={answers.budget === opt.value}
                  onClick={() => setAnswers((a) => ({ ...a, budget: opt.value }))}
                />
              ))}

            {step.key === 'avoidedIngredients' && (
              <input
                type="text"
                placeholder="e.g. fragrance, essential oils, alcohol"
                value={answers.avoidedIngredients}
                onChange={(e) => setAnswers((a) => ({ ...a, avoidedIngredients: e.target.value }))}
                className="w-full rounded-2xl border border-beige-300 bg-white px-5 py-4 text-sm focus:border-sage-400 focus:outline-none"
              />
            )}

            {step.key === 'preferredRoutineSteps' &&
              ROUTINE_STEP_COUNTS.map((count) => (
                <QuizOption
                  key={count}
                  label={`${count} steps`}
                  selected={answers.preferredRoutineSteps === count}
                  onClick={() => setAnswers((a) => ({ ...a, preferredRoutineSteps: count }))}
                />
              ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={goNext} isLoading={submitting} disabled={!isStepValid()}>
          {stepIndex === STEPS.length - 1 ? 'See My Results' : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
