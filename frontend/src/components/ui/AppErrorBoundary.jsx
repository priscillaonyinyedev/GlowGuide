import { Component } from 'react'

/** Keeps a rendering exception from leaving the browser on a blank page. */
export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('GlowGuide could not render this page:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-cream-100 px-6 py-16">
          <section className="max-w-lg rounded-3xl border border-beige-300 bg-cream-50 p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-plum-700">GlowGuide</p>
            <h1 className="mt-3 font-serif text-3xl text-mocha-900">This page hit a snag</h1>
            <p className="mt-3 text-sm leading-relaxed text-mocha-600">
              Your account and saved information are still safe. Reload the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-plum-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-plum-900"
            >
              Reload GlowGuide
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
