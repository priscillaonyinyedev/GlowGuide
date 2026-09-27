import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import { contactService } from '../services/userService'

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL

const FAQ = [
  {
    q: 'Is GlowGuide a medical service?',
    a: 'No. GlowGuide provides educational skincare content and personalized product discovery. It does not diagnose or treat skin conditions.',
  },
  {
    q: 'How does the recommendation engine work?',
    a: 'It scores products against your Skin Quiz answers — skin type, concerns, ingredients, budget, and preferences — and explains why each product was suggested.',
  },
  {
    q: 'Can I change my skin profile later?',
    a: 'Yes, retake the Skin Quiz anytime from your Dashboard, or edit your profile directly in Settings.',
  },
]

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await contactService.send(data)
      toast.success("Message sent — we'll be in touch soon.")
      reset()
    } catch (error) {
      toast.error(error.message || 'Could not deliver your message. Please try again.')
    }
  }

  return (
    <div className="container-editorial grid gap-16 py-16 lg:grid-cols-2">
      <Seo title="Contact" path="/contact" description="Get in touch with the GlowGuide team." />

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Contact</p>
        <h1 className="font-serif text-4xl text-mocha-900">We'd love to hear from you</h1>
        <p className="mt-4 max-w-md text-mocha-600">
          Questions about an order, a product, or GlowGuide in general? Send us a message and we'll respond
          as soon as we can.
        </p>

        <div className="mt-8 space-y-3 text-sm text-mocha-600">
          {SUPPORT_EMAIL && <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2"><Mail className="h-4 w-4 text-sage-600" />{SUPPORT_EMAIL}</a>}
          {!SUPPORT_EMAIL && <p>The contact form is the best way to reach us.</p>}
        </div>

        <h2 className="mt-12 font-serif text-2xl text-mocha-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 className="text-sm font-semibold text-mocha-800">{item.q}</h3>
              <p className="mt-1 text-sm text-mocha-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-soft space-y-5 p-8">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
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
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Subject</label>
          <input
            {...register('subject', { required: 'Subject is required' })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mocha-700">Message</label>
          <textarea
            rows={5}
            {...register('message', { required: 'Message is required' })}
            className="w-full rounded-xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm focus:border-sage-400 focus:outline-none"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  )
}
