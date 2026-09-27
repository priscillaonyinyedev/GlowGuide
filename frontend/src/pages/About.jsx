import Seo from '../components/ui/Seo'

export default function About() {
  return (
    <div className="container-editorial max-w-3xl py-16">
      <Seo
        title="About"
        path="/about"
        description="GlowGuide's mission is to make skincare easier to understand through education, personalization, and thoughtful product discovery."
      />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">About GlowGuide</p>
      <h1 className="font-serif text-4xl text-mocha-900">A skincare companion, not another store</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-mocha-700">
        <p>
          GlowGuide is a skincare platform built around a simple idea: people make better skincare decisions
          when they understand their own skin and the ingredients they're putting on it — not when they're
          chasing whatever is trending.
        </p>
        <p>
          We built GlowGuide because the skincare aisle, and the internet at large, is loud. Marketing claims
          are everywhere, ingredient lists are dense and hard to parse, and it's genuinely difficult to know
          what a product will do for <em>your</em> skin versus skin in general. GlowGuide exists to close that
          gap: a Skin Quiz to build a clear profile, an Ingredient Library to demystify what's actually in your
          products, and a transparent, scored recommendation engine that explains its reasoning instead of
          just guessing.
        </p>
        <h2 className="pt-4 font-serif text-2xl text-mocha-900">Our mission</h2>
        <p>
          To make skincare easier to understand through education, personalization, and thoughtful product
          discovery — helping people make informed skincare decisions rather than blindly follow trends.
        </p>
        <h2 className="pt-4 font-serif text-2xl text-mocha-900">What GlowGuide is not</h2>
        <p>
          GlowGuide is an educational and discovery platform, not a medical service. Content on ingredients
          and routines is informational and does not diagnose, treat, or cure any skin condition. For
          persistent or serious skin concerns, we always recommend speaking with a licensed dermatologist.
        </p>
      </div>
    </div>
  )
}
