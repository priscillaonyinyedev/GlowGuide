export function formatPrice(value, currency = 'USD') {
  if (value == null) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

export function titleCase(value) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
