import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AssistantWidget from '../components/assistant/AssistantWidget'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  )
}
