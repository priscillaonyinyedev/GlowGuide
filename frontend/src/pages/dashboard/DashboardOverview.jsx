import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, ClipboardList, ArrowRight } from 'lucide-react'
import Seo from '../../components/ui/Seo'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { routineService } from '../../services/routineService'
import { wishlistService } from '../../services/shoppingService'
import { quizService } from '../../services/quizService'
import { titleCase } from '../../utils/format'

export default function DashboardOverview() {
  const { user } = useAuth()
  const [routines, setRoutines] = useState(null)
  const [wishlistCount, setWishlistCount] = useState(null)
  const [latestQuiz, setLatestQuiz] = useState(null)

  useEffect(() => {
    routineService.list().then(setRoutines).catch(() => setRoutines([]))
    wishlistService.get().then((w) => setWishlistCount(w.productIds?.length ?? 0)).catch(() => setWishlistCount(0))
    quizService.latestResult().then(setLatestQuiz).catch(() => setLatestQuiz(null))
  }, [])

  const morningRoutine = routines?.find((r) => r.type === 'MORNING')

  return (
    <div>
      <Seo title="Dashboard" path="/dashboard" />
      <h1 className="font-serif text-3xl text-mocha-900">Welcome back, {user?.name?.split(' ')[0]} 🌸</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Sparkles}
          title="Your Skin Profile"
          value={user?.skinProfile?.skinType ? titleCase(user.skinProfile.skinType) : 'Not set yet'}
          to="/quiz"
          cta={user?.skinProfile?.skinType ? 'Retake quiz' : 'Take the quiz'}
        />
        <StatCard
          icon={ClipboardList}
          title="Main Concerns"
          value={
            user?.skinProfile?.concerns?.length
              ? user.skinProfile.concerns.map(titleCase).join(', ')
              : latestQuiz?.concerns?.length
              ? latestQuiz.concerns.map(titleCase).join(', ')
              : '—'
          }
          to="/dashboard/quiz-results"
          cta="View quiz results"
        />
        <StatCard
          icon={Sparkles}
          title="Your Morning Routine"
          value={morningRoutine ? `${morningRoutine.steps?.length ?? 0} Steps` : 'Not started'}
          to="/dashboard/routines"
          cta="Manage routines"
        />
        <StatCard
          icon={Heart}
          title="Saved Products"
          value={wishlistCount == null ? <Skeleton className="h-6 w-10" /> : wishlistCount}
          to="/dashboard/saved"
          cta="View wishlist"
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, to, cta }) {
  return (
    <div className="card-soft p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100">
        <Icon className="h-5 w-5 text-sage-600" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-mocha-400">{title}</p>
      <p className="mt-1 font-serif text-xl text-mocha-900">{value}</p>
      <Link to={to} className="mt-3 flex items-center gap-1 text-xs font-medium text-sage-700 hover:text-sage-800">
        {cta} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
