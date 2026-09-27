import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Sun, Moon, Sparkles, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { Skeleton } from '../../components/ui/Skeleton'
import { routineService } from '../../services/routineService'

const TYPE_ICON = { MORNING: Sun, EVENING: Moon, CUSTOM: Sparkles }

export default function RoutineList() {
  const [routines, setRoutines] = useState([])
  const [status, setStatus] = useState('loading')

  const load = () => {
    setStatus('loading')
    routineService
      .list()
      .then((data) => {
        setRoutines(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    try {
      await routineService.remove(id)
      toast.success('Routine deleted')
      setRoutines((r) => r.filter((routine) => routine.id !== id))
    } catch {
      toast.error('Could not delete routine')
    }
  }

  return (
    <div className="container-editorial max-w-4xl py-12">
      <Seo title="My Routines" path="/routines" />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-mocha-900">My Routines</h1>
          <p className="mt-1 text-sm text-mocha-500">Build and manage your morning and evening skincare routines.</p>
        </div>
        <Link to="/routines/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Routine
          </Button>
        </Link>
      </div>

      {status === 'loading' && (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message="Couldn't load your routines." />}

      {status === 'success' && routines.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No routines yet"
          description="Build a morning or evening routine step by step, or start from your quiz results."
          action={
            <Link to="/routines/new">
              <Button size="sm">Build Your First Routine</Button>
            </Link>
          }
        />
      )}

      {status === 'success' && routines.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {routines.map((routine) => {
            const Icon = TYPE_ICON[routine.type] ?? Sparkles
            return (
              <div key={routine.id} className="card-soft p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-sage-700">
                    <Icon className="h-4 w-4" /> {routine.type}
                  </span>
                  <button onClick={() => handleDelete(routine.id)} className="text-mocha-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Link to={`/routines/${routine.id}/edit`}>
                  <h3 className="font-serif text-xl text-mocha-900">{routine.name}</h3>
                </Link>
                <p className="mt-1 text-sm text-mocha-500">{routine.steps?.length ?? 0} steps</p>
                <div className="mt-4 flex -space-x-2">
                  {routine.steps?.slice(0, 5).map((step, i) => (
                    <div key={i} className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-beige-100">
                      {step.productImageUrl && (
                        <img src={step.productImageUrl} alt={step.productName} className="h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
