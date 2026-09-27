export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-beige-300 bg-cream-50 px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-mocha-300" />}
      <h3 className="font-serif text-xl text-mocha-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-mocha-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
