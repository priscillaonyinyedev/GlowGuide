import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { quizService } from '../../services/quizService'
import { titleCase } from '../../utils/format'

export default function QuizResultsHistory() {
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    quizService
      .myResults()
      .then((data) => {
        setResults(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <Seo title="Quiz Results" path="/dashboard/quiz-results" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-mocha-900">Quiz Results</h1>
        <Link to="/quiz">
          <Button size="sm">Retake Quiz</Button>
        </Link>
      </div>

      {status === 'loading' && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {status === 'success' && results.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No quiz results yet"
          description="Take the Skin Quiz to get a personalized skin profile and product matches."
          action={
            <Link to="/quiz">
              <Button size="sm">Take the Quiz</Button>
            </Link>
          }
        />
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <Link key={result.id} to={`/quiz/results/${result.id}`} className="card-soft flex items-center justify-between p-5">
            <div>
              <p className="font-serif text-lg text-mocha-900">{titleCase(result.skinType)} skin</p>
              <p className="text-sm text-mocha-500">{result.concerns?.map(titleCase).join(', ') || 'No concerns noted'}</p>
            </div>
            <p className="text-xs text-mocha-400">{new Date(result.createdAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
