// Enum-like display data mirrored from the backend. Homepage statistics are
// configurable and omitted until real business values are supplied.
const configuredStats = [
  ['Members', import.meta.env.VITE_SITE_STAT_MEMBERS],
  ['Average rating', import.meta.env.VITE_SITE_STAT_RATING],
  ['Reviews', import.meta.env.VITE_SITE_STAT_REVIEWS],
]

export const SITE_STATS = configuredStats
  .filter(([, value]) => value?.trim())
  .map(([label, value]) => ({ label, value: value.trim() }))

export const SKIN_TYPES = [
  { value: 'OILY', label: 'Oily' },
  { value: 'DRY', label: 'Dry' },
  { value: 'COMBINATION', label: 'Combination' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'SENSITIVE', label: 'Sensitive' },
]

export const SKIN_CONCERNS = [
  { value: 'ACNE_PRONE', label: 'Acne-prone skin' },
  { value: 'DRYNESS', label: 'Dryness' },
  { value: 'UNEVEN_TONE', label: 'Uneven tone' },
  { value: 'DARK_SPOTS', label: 'Dark spots' },
  { value: 'TEXTURE', label: 'Texture' },
  { value: 'REDNESS', label: 'Redness' },
  { value: 'DULLNESS', label: 'Dullness' },
  { value: 'DEHYDRATION', label: 'Dehydration' },
]

export const SENSITIVITY_LEVELS = [
  { value: 'LOW', label: 'Rarely reacts to new products' },
  { value: 'MEDIUM', label: 'Occasionally reacts' },
  { value: 'HIGH', label: 'Reacts easily / very sensitive' },
]

export const BUDGET_RANGES = [
  { value: 'BUDGET', label: 'Budget-friendly', hint: 'Under $15 per product' },
  { value: 'MID_RANGE', label: 'Mid-range', hint: '$15–$35 per product' },
  { value: 'PREMIUM', label: 'Premium', hint: '$35–$70 per product' },
  { value: 'LUXURY', label: 'Luxury', hint: '$70+ per product' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'CLEANSER', label: 'Cleansers' },
  { value: 'TONER', label: 'Toners' },
  { value: 'SERUM', label: 'Serums' },
  { value: 'MOISTURIZER', label: 'Moisturizers' },
  { value: 'SUNSCREEN', label: 'Sunscreens' },
  { value: 'TREATMENT', label: 'Treatments' },
  { value: 'MASK', label: 'Masks' },
  { value: 'EYE_CARE', label: 'Eye Care' },
  { value: 'LIP_CARE', label: 'Lip Care' },
  { value: 'BODY_CARE', label: 'Body Care' },
]

export const ROUTINE_STEP_COUNTS = [3, 4, 5, 6, 7]

export function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}
