import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { assistantService } from '../../services/assistantService'

const STARTERS = [
  'What order should I apply my morning skincare?',
  'Can I use vitamin C with the products in my routine?',
  'What ingredients are often used for breakouts or uneven tone?',
  'Show me a moisturizer for dry skin under $25.',
]

export default function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([])
  const transcriptRef = useRef(null)

  useEffect(() => {
    const transcript = transcriptRef.current
    if (transcript) transcript.scrollTo({ top: transcript.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const send = async (value = draft) => {
    const message = value.trim()
    if (!message || busy) return
    setMessages((current) => [...current, { role: 'user', text: message }])
    setDraft('')
    setBusy(true)
    try {
      const response = await assistantService.ask(message)
      setMessages((current) => [...current, { role: 'assistant', ...response }])
    } catch (error) {
      const apiMessage = error?.message?.includes('could not reach the backend')
        ? error.message
        : 'I can’t reach the ingredient and product library at the moment. Check that the GlowGuide API is running, then try again.'
      setMessages((current) => [...current, { role: 'assistant', answer: apiMessage, ingredients: [], recommendations: [], retryMessage: message }])
    } finally { setBusy(false) }
  }

  return <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
    {open && <section className="mb-3 flex h-[min(72vh,620px)] w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-3xl border border-beige-300 bg-cream-50 shadow-lifted" aria-label="GlowGuide skincare assistant">
      <header className="flex items-center justify-between bg-mocha-900 px-5 py-4 text-cream-50">
        <div><p className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-peach-300" /> GlowGuide Skincare Companion</p><p className="mt-1 text-xs text-cream-200/75">Ask about ingredients, routines, or product matches</p></div>
        <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-full p-2 transition-colors hover:bg-white/10"><X className="h-4 w-4" /></button>
      </header>
      <div ref={transcriptRef} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 && <div className="rounded-2xl bg-peach-50 p-4"><p className="text-sm leading-relaxed text-mocha-800">Ask in your own words. I can explain ingredients, help with product order, or find catalogue matches. Take the skin quiz for more personal recommendations.</p><div className="mt-4 space-y-2">{STARTERS.map((item) => <button key={item} type="button" onClick={() => send(item)} className="block w-full rounded-xl border border-beige-300 bg-white px-3 py-2 text-left text-xs leading-relaxed text-mocha-700 transition-colors hover:bg-sage-50">{item}</button>)}</div></div>}
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-8 rounded-2xl rounded-br-sm bg-sage-100 p-3 text-sm text-mocha-900' : 'mr-3 rounded-2xl rounded-bl-sm border border-beige-200 bg-white p-3 text-sm leading-relaxed text-mocha-800'}>
          {message.role === 'user' ? message.text : <><p className="whitespace-pre-line">{message.answer}</p>{message.retryMessage && <button type="button" onClick={() => send(message.retryMessage)} disabled={busy} className="mt-2 text-xs font-semibold text-plum-700 underline underline-offset-2 disabled:opacity-50">Try again</button>}{message.ingredients?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{message.ingredients.map((item) => <Link key={item.id} to={`/ingredients/${item.slug}`} onClick={() => setOpen(false)} className="rounded-full bg-peach-100 px-3 py-1 text-xs font-medium text-plum-700">{item.name}</Link>)}</div>}{message.recommendations?.length > 0 && <ul className="mt-3 space-y-2">{message.recommendations.slice(0, 4).map(({ product, reason }) => <li key={product.id} className="rounded-xl bg-cream-100 p-3"><Link to={`/products/${product.slug}`} onClick={() => setOpen(false)} className="font-medium text-mocha-900 underline decoration-beige-400 underline-offset-2">{product.name}</Link><p className="mt-1 text-xs">{reason}</p></li>)}</ul>}{message.disclaimer && <p className="mt-3 border-t border-beige-200 pt-2 text-[11px] text-mocha-500">{message.disclaimer}</p>}</>}
        </div>)}
        {busy && <p className="mr-3 rounded-2xl bg-white p-3 text-sm text-mocha-500">Looking through the library…</p>}
      </div>
      <form onSubmit={(event) => { event.preventDefault(); send() }} className="flex items-end gap-2 border-t border-beige-200 bg-white p-3">
        <textarea maxLength={600} rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() } }} placeholder="Ask a skincare question…" aria-label="Your skincare question" className="max-h-24 min-h-11 flex-1 resize-y rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-sage-500" />
        <button type="submit" disabled={busy || !draft.trim()} aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mocha-900 text-white transition-colors hover:bg-plum-700 disabled:opacity-45"><Send className="h-4 w-4" /></button>
      </form>
    </section>}
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close skincare assistant' : 'Ask the skincare assistant'} className="ml-auto flex items-center gap-2 rounded-full bg-mocha-900 px-4 py-3 text-sm font-medium text-white shadow-lifted transition-all hover:-translate-y-0.5 hover:bg-plum-700">
      {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}<span>{open ? 'Close' : 'Ask GlowGuide'}</span>
    </button>
  </div>
}
