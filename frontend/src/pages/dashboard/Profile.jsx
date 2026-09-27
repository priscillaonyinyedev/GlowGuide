import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Seo from '../../components/ui/Seo'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { userService } from '../../services/userService'
import { SKIN_TYPES, SKIN_CONCERNS, BUDGET_RANGES, SENSITIVITY_LEVELS, ROUTINE_STEP_COUNTS } from '../../utils/constants'

function toggleInArray(array = [], value) {
  return array.includes(value) ? array.filter((v) => v !== value) : [...array, value]
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [concerns, setConcerns] = useState(user?.skinProfile?.concerns ?? [])

  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      profileImageUrl: user?.profileImageUrl ?? '',
      skinType: user?.skinProfile?.skinType ?? '',
      budget: user?.skinProfile?.budget ?? '',
      sensitivity: user?.skinProfile?.sensitivity ?? '',
      avoidedIngredients: (user?.skinProfile?.avoidedIngredients ?? []).join(', '),
      preferredRoutineSteps: user?.skinProfile?.preferredRoutineSteps ?? '',
    },
  })

  const onSubmitProfile = async (data) => {
    setSaving(true)
    try {
      const updated = await userService.updateProfile({ name: data.name, profileImageUrl: data.profileImageUrl })
      updateUser(updated)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  const onImageSelected = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await userService.uploadProfileImage(file)
      const updated = await userService.updateProfile({ name: user?.name, profileImageUrl: result.url })
      updateUser(updated)
      toast.success('Profile image updated')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not upload profile image') }
    finally { setUploading(false); event.target.value = '' }
  }

  const onSubmitSkinProfile = async (data) => {
    setSaving(true)
    try {
      const updated = await userService.updateSkinProfile({
        skinType: data.skinType || null,
        concerns,
        budget: data.budget || null,
        sensitivity: data.sensitivity || null,
        avoidedIngredients: data.avoidedIngredients.split(',').map((value) => value.trim()).filter(Boolean),
        preferredRoutineSteps: data.preferredRoutineSteps ? Number(data.preferredRoutineSteps) : null,
      })
      updateUser(updated)
      toast.success('Skin profile updated')
    } catch (err) {
      toast.error(err.message || 'Could not update skin profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <Seo title="Profile" path="/dashboard/profile" />

      <div className="card-soft p-6">
        <h2 className="mb-4 font-serif text-xl text-mocha-900">Profile</h2>
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Name</label>
            <input {...register('name')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Profile image URL</label>
            <input {...register('profileImageUrl')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none" />
            {user?.profileImageUrl && <img src={user.profileImageUrl} alt="Your profile" className="mt-3 h-16 w-16 rounded-full object-cover" />}
            <label className="mt-3 inline-flex cursor-pointer items-center rounded-full border border-beige-300 px-4 py-2 text-sm font-medium text-mocha-800 hover:bg-peach-50">{uploading ? 'Uploading…' : 'Upload profile image'}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={onImageSelected} className="sr-only" /></label>
            <p className="mt-1 text-xs text-mocha-500">JPG, PNG or WebP, up to 5 MB. Requires Cloudinary configuration.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Email</label>
            <input value={user?.email ?? ''} disabled className="w-full rounded-xl border border-beige-200 bg-beige-100 px-4 py-2.5 text-sm text-mocha-400" />
            <p className="mt-1 text-xs text-mocha-400">Contact support to change your email address.</p>
          </div>
          <Button type="submit" size="sm" isLoading={saving}>Save Profile</Button>
        </form>
      </div>

      <div className="card-soft p-6">
        <h2 className="mb-4 font-serif text-xl text-mocha-900">Skin Profile & Preferences</h2>
        <form onSubmit={handleSubmit(onSubmitSkinProfile)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Skin type</label>
            <select {...register('skinType')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none">
              <option value="">Not set</option>
              {SKIN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-mocha-700">Main concerns</p>
            <div className="flex flex-wrap gap-2">
              {SKIN_CONCERNS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setConcerns((prev) => toggleInArray(prev, c.value))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    concerns.includes(c.value) ? 'bg-sage-500 text-white' : 'bg-beige-100 text-mocha-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-mocha-700">Budget preference</label>
            <select {...register('budget')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none">
              <option value="">Not set</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          <div><label className="mb-1.5 block text-sm font-medium text-mocha-700">Skin sensitivity</label><select {...register('sensitivity')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm"><option value="">Not set</option>{SENSITIVITY_LEVELS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-mocha-700">Ingredients you avoid</label><input {...register('avoidedIngredients')} placeholder="e.g. fragrance, retinol" className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm" /><p className="mt-1 text-xs text-mocha-500">Separate items with commas.</p></div>
          <div><label className="mb-1.5 block text-sm font-medium text-mocha-700">Preferred routine length</label><select {...register('preferredRoutineSteps')} className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm"><option value="">Not set</option>{ROUTINE_STEP_COUNTS.map((count) => <option key={count} value={count}>{count} steps</option>)}</select></div>

          <Button type="submit" size="sm" isLoading={saving}>Save Skin Profile</Button>
        </form>
      </div>
    </div>
  )
}
