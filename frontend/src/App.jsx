import { lazy, Suspense, useLayoutEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import { AdminRoute, ProtectedRoute } from './components/layout/ProtectedRoute'
import PageLoader from './components/ui/PageLoader'
import AppErrorBoundary from './components/ui/AppErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Shop = lazy(() => import('./pages/Shop'))
const Brands = lazy(() => import('./pages/Brands'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Learn = lazy(() => import('./pages/Learn'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Ingredients = lazy(() => import('./pages/Ingredients'))
const IngredientDetail = lazy(() => import('./pages/IngredientDetail'))
const SkinQuiz = lazy(() => import('./pages/quiz/SkinQuiz'))
const QuizResults = lazy(() => import('./pages/quiz/QuizResults'))
const RoutineList = lazy(() => import('./pages/routines/RoutineList'))
const RoutineBuilder = lazy(() => import('./pages/routines/RoutineBuilder'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))
const OAuth2Redirect = lazy(() => import('./pages/auth/OAuth2Redirect'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))
const SavedProducts = lazy(() => import('./pages/dashboard/SavedProducts'))
const QuizResultsHistory = lazy(() => import('./pages/dashboard/QuizResultsHistory'))
const MyReviews = lazy(() => import('./pages/dashboard/MyReviews'))
const Orders = lazy(() => import('./pages/dashboard/Orders'))
const OrderDetail = lazy(() => import('./pages/dashboard/OrderDetail'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminManagement = lazy(() => import('./pages/admin/AdminManagement'))
const AdminCatalog = lazy(() => import('./pages/admin/AdminCatalog'))
const AdminInsights = lazy(() => import('./pages/admin/AdminInsights'))
const SupportPage = lazy(() => import('./pages/SupportPage'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<SupportPage section="faq" />} />
        <Route path="privacy" element={<SupportPage section="privacy" />} />
        <Route path="terms" element={<SupportPage section="terms" />} />
        <Route path="shipping" element={<SupportPage section="shipping" />} />
        <Route path="returns" element={<SupportPage section="returns" />} />
        <Route path="shop" element={<Shop />} />
        <Route path="brands" element={<Brands />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/:slug" element={<ArticleDetail />} />
        <Route path="ingredients" element={<Ingredients />} />
        <Route path="ingredients/:slug" element={<IngredientDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<ProtectedRoute />}>
          <Route path="quiz" element={<SkinQuiz />} />
          <Route path="quiz/results/:quizResultId" element={<QuizResults />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="routines" element={<RoutineList />} />
          <Route path="routines/new" element={<RoutineBuilder />} />
          <Route path="routines/:routineId/edit" element={<RoutineBuilder />} />
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="saved" element={<SavedProducts />} />
            <Route path="routines" element={<RoutineList />} />
            <Route path="quiz-results" element={<QuizResultsHistory />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="brands" element={<AdminCatalog section="brands" />} />
          <Route path="categories" element={<AdminCatalog section="categories" />} />
          <Route path="ingredients" element={<AdminManagement section="ingredients" />} />
          <Route path="users" element={<AdminManagement section="users" />} />
          <Route path="orders" element={<AdminManagement section="orders" />} />
          <Route path="reviews" element={<AdminManagement section="reviews" />} />
          <Route path="quiz-data" element={<AdminInsights section="quiz-data" />} />
          <Route path="analytics" element={<AdminInsights section="analytics" />} />
        </Route>
      </Route>

      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="oauth2/redirect" element={<OAuth2Redirect />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
                <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AppErrorBoundary>
  )
}
