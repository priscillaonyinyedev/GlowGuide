const REQUIRED_STEPS = {
  MORNING: ['CLEANSER', 'SERUM', 'MOISTURIZER', 'SUNSCREEN'],
  EVENING: ['CLEANSER', 'MOISTURIZER'],
}

const OPTIONAL_STEPS = {
  MORNING: ['TONER'],
  EVENING: ['TONER'],
}

const CATEGORY_ORDER = {
  MORNING: ['CLEANSER', 'TONER', 'SERUM', 'MOISTURIZER', 'SUNSCREEN'],
  EVENING: ['CLEANSER', 'TONER', 'TREATMENT', 'SERUM', 'MOISTURIZER'],
}

export function routineProductsFor(recommendations = [], quizResult = {}, type = 'MORNING') {
  const routineType = type === 'EVENING' ? 'EVENING' : 'MORNING'
  const preference = (quizResult.routinePreferences ?? []).map((value) => value.toUpperCase())
  const required = REQUIRED_STEPS[routineType]
  const optional = OPTIONAL_STEPS[routineType].filter((category) => preference.includes(category))
  const activeCategory = routineType === 'EVENING'
    ? preference.includes('TREATMENT') && recommendations.some(({ product }) => product.category === 'TREATMENT')
      ? 'TREATMENT'
      : recommendations.some(({ product }) => product.category === 'SERUM') ? 'SERUM' : 'TREATMENT'
    : null
  const minimumSteps = required.length + optional.length + (activeCategory ? 1 : 0)
  const maxSteps = Math.max(minimumSteps, Number(quizResult.preferredRoutineSteps) || 4)
  const selectedCategories = [...required]
  if (activeCategory) selectedCategories.splice(selectedCategories.indexOf('MOISTURIZER'), 0, activeCategory)
  for (const category of optional) {
    if (selectedCategories.length >= maxSteps) break
    selectedCategories.push(category)
  }

  const byCategory = new Map()
  for (const { product } of recommendations) {
    if (routineType === 'MORNING' && product.recommendedRoutineStep === 'EVENING_TONER') continue
    if (selectedCategories.includes(product.category) && !byCategory.has(product.category)) {
      byCategory.set(product.category, product)
    }
  }

  if (routineType === 'EVENING' && byCategory.get('TONER')?.keyIngredientSlugs?.includes('glycolic-acid')) {
    byCategory.delete('TREATMENT')
    byCategory.delete('SERUM')
  }

  return CATEGORY_ORDER[routineType]
    .filter((category) => selectedCategories.includes(category) && byCategory.has(category))
    .map((category) => byCategory.get(category))
}
