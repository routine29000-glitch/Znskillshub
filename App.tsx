import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterSellerModal } from '@/components/seller/RegisterSellerModal'
import { PaymentModal } from '@/components/admin/PaymentModal'
import { initAuthListener } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import NotFoundPage from '@/pages/NotFoundPage'

// Lazy-loaded pages
const HomePage            = lazy(() => import('@/pages/HomePage'))
const SearchPage          = lazy(() => import('@/pages/SearchPage'))
const SellerProfilePage   = lazy(() => import('@/pages/SellerProfilePage'))
const DashboardPage       = lazy(() => import('@/pages/DashboardPage'))
const AdminPage           = lazy(() => import('@/pages/AdminPage'))
const HowItWorksPage      = lazy(() => import('@/pages/HowItWorksPage'))
const PricingPage         = lazy(() => import('@/pages/PricingPage'))
const MessagesPage        = lazy(() => import('@/pages/MessagesPage'))
const NotificationsPage   = lazy(() => import('@/pages/NotificationsPage'))

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
})

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-500 text-sm">جارٍ التحميل...</div>
      </div>
    </div>
  )
}

// Global modals (rendered outside routes so they persist across navigation)
function GlobalModals() {
  return (
    <>
      <LoginModal />
      <RegisterSellerModal />
      <PaymentModal />
    </>
  )
}

// Inner app — needs access to stores
function InnerApp() {
  const { theme } = useUIStore()

  // Apply theme class on mount
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Full layout pages */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <Suspense fallback={<PageLoader />}><HomePage /></Suspense>
            } />
            <Route path="/search" element={
              <Suspense fallback={<PageLoader />}><SearchPage /></Suspense>
            } />
            <Route path="/seller/:id" element={
              <Suspense fallback={<PageLoader />}><SellerProfilePage /></Suspense>
            } />
            <Route path="/how" element={
              <Suspense fallback={<PageLoader />}><HowItWorksPage /></Suspense>
            } />
            <Route path="/pricing" element={
              <Suspense fallback={<PageLoader />}><PricingPage /></Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>
            } />
            <Route path="/notifications" element={
              <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Full-screen pages (no footer) */}
          <Route element={<Layout showFooter={false} />}>
            <Route path="/messages" element={
              <Suspense fallback={<PageLoader />}><MessagesPage /></Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>

      <GlobalModals />

      {/* Toast notifications */}
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1E293B',
            color:      '#F1F5F9',
            border:     '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            fontFamily: 'Tajawal, sans-serif',
            fontSize:   '14px',
            direction:  'rtl',
          },
          success: {
            iconTheme: { primary: '#00D9A5', secondary: '#0F172A' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#0F172A' },
          },
        }}
      />
    </>
  )
}

export default function App() {
  // Start Supabase auth listener once
  useEffect(() => {
    initAuthListener()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  )
}
