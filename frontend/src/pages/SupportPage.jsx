import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'

const CONTENT = {
  faq: {
    title: 'Frequently asked questions', intro: 'A few helpful answers about using GlowGuide.',
    sections: [
      ['Is GlowGuide medical advice?', 'No. GlowGuide is an educational skincare companion. It does not diagnose conditions or replace a dermatologist or other qualified clinician.'],
      ['How do recommendations work?', 'The quiz compares the skin type, concerns, sensitivities, budget, avoided ingredients and routine preferences you choose with product details in the catalogue. It explains the matches so you can decide for yourself.'],
      ['Can I use GlowGuide without an account?', 'You can browse products, ingredients and learning articles without an account. Saving quiz results, routines, wishlist items and orders requires signing in.'],
      ['Are catalogue products and reviews verified?', 'Development catalogue entries are visibly marked as sample data. Product and review data should be independently verified before a live store launch.'],
      ['Does checkout charge my card?', 'No. Checkout is currently a demo flow and does not accept or store card details or charge a payment method.'],
      ['How do I delete my account?', 'Sign in, open Dashboard → Settings, and use the account deletion control. Account data is removed from the application database.'],
    ],
  },
  privacy: {
    title: 'Privacy notice', intro: 'This development build stores only the information needed to provide account and personalization features.',
    sections: [
      ['Information you provide', 'Account details, skin profile and quiz answers, routines, wishlist items, cart contents, contact messages, newsletter email addresses, reviews and demo order delivery details may be stored in MongoDB when the backend is connected.'],
      ['How information is used', 'GlowGuide uses this information to sign you in, save your preferences, show personalized recommendations, respond to messages and display your saved content. Quiz information is used by the recommendation service; it is not a medical diagnosis.'],
      ['Sharing and payment data', 'The demo checkout does not collect card details or process payments. Google sign-in, email delivery and image hosting only operate when their server-side provider credentials are configured.'],
      ['Retention and account controls', 'You can update your profile or request account deletion through Settings. Contact and newsletter records may need separate retention controls before production launch.'],
      ['Before production use', 'This notice describes the current application design and is not a substitute for a jurisdiction-specific privacy review. The operator must add its legal identity, contact details, retention schedule and applicable rights process before launch.'],
    ],
  },
  terms: {
    title: 'Terms of use', intro: 'Please use GlowGuide as an educational discovery tool and check product information with its manufacturer.',
    sections: [
      ['Educational use', 'Ingredient descriptions and product matches are general educational information. They are not medical advice, diagnosis or treatment. Stop using a product and seek qualified care if you have a concerning reaction.'],
      ['Catalogue accuracy', 'Some catalogue records are development samples. Always verify current ingredients, usage directions, availability and price with the manufacturer or seller.'],
      ['Accounts and security', 'Keep your sign-in details secure and provide accurate account information. Administrators may suspend accounts that compromise service security.'],
      ['Orders and payment', 'This build creates unpaid demo orders only. It does not charge payment methods, promise product availability or dispatch goods.'],
      ['Production terms', 'The site operator should replace this development notice with reviewed terms that identify the responsible business, governing law and consumer rights before accepting real orders.'],
    ],
  },
  shipping: {
    title: 'Shipping information', intro: 'GlowGuide is currently running in demo mode.',
    sections: [
      ['No live fulfilment', 'The current checkout can create a demo order record but does not charge a payment method, send an order to a retailer or arrange delivery.'],
      ['When shopping is enabled', 'A live store should show the seller, delivery areas, carrier options, costs and estimated delivery dates before payment. No delivery estimate is available in this demo.'],
    ],
  },
  returns: {
    title: 'Returns and refunds', intro: 'No payment or live product fulfilment is enabled in this demo.',
    sections: [
      ['Demo orders', 'Demo orders are unpaid records and do not represent a purchase. No return or refund request can be processed through this build.'],
      ['Live store policy', 'Before taking real orders, the store operator must publish a clear returns, cancellation and refund policy that complies with the rules applicable to the seller and customer.'],
    ],
  },
}

export default function SupportPage({ section }) {
  const page = CONTENT[section] || CONTENT.faq
  return <main className="container-editorial py-14 sm:py-20">
    <Seo title={page.title} description={page.intro} path={`/${section}`} />
    <p className="eyebrow">GlowGuide Support</p>
    <h1 className="mt-3 max-w-3xl">{page.title}</h1>
    <p className="mt-4 text-lg text-mocha-600">{page.intro}</p>
    <div className="mt-10 grid gap-4">
      {page.sections.map(([heading, body]) => <section key={heading} className="rounded-2xl border border-beige-300/80 bg-cream-50/85 p-6 shadow-soft sm:p-8">
        <h2 className="text-xl sm:text-2xl">{heading}</h2><p className="mt-3 leading-relaxed text-mocha-700">{body}</p>
      </section>)}
    </div>
    <p className="mt-10 text-sm text-mocha-600">Still have a question? <Link className="link-underline" to="/contact">Contact the GlowGuide team.</Link></p>
  </main>
}
