import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { userService } from '../../services/userService'

export default function Settings() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await userService.deleteAccount()
      toast.success('Account deleted')
      await logout()
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Could not delete account')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <Seo title="Settings" path="/dashboard/settings" />
      <h1 className="font-serif text-3xl text-mocha-900">Settings</h1>

      <div className="card-soft border border-red-100 p-6">
        <h2 className="mb-2 font-serif text-xl text-mocha-900">Delete account</h2>
        <p className="mb-4 text-sm text-mocha-500">
          This permanently deletes your GlowGuide account, saved products, routines, and quiz history. This
          action cannot be undone.
        </p>
        {!confirming ? (
          <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
            Delete My Account
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>
              Yes, permanently delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
