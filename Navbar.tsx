import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { useAuth } from '@/hooks/useAuth'
import { getUnreadNotificationCount } from '@/services/notification.service'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { path: '/',          label: '🏠 الرئيسية' },
  { path: '/search',    label: '🔍 الحرفيون' },
  { path: '/how',       label: '💡 كيف يعمل' },
  { path: '/pricing',   label: '💰 الأسعار'   },
]

export function Navbar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { profile, seller } = useAuthStore()
  const { theme, toggleTheme, isMuted, toggleMuted, openModal } = useUIStore()
  const { logout } = useAuth()
  const [search, setSearch]         = useState('')
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread]         = useState(0)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  /* ── Scroll shadow ── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* ── Unread notifications ── */
  useEffect(() => {
    if (!profile) return
    getUnreadNotificationCount(profile.id)
      .then(setUnread)
      .catch(() => null)
  }, [profile])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header
      className={`
        sticky top-0 z-40 transition-all duration-300
        ${scrolled
          ? 'bg-background/95 dark:bg-background/95 backdrop-blur-xl shadow-lg border-b border-white/5'
          : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex-shrink-0">
          <motion.div
            className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            ⚡ Zn_SkillsHub
          </motion.div>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-1 mr-4">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`
                px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
                ${location.pathname === path
                  ? 'bg-primary/15 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Search ── */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <div className="relative w-full">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="سباك، كهربائي، معلم..."
              className="
                w-full bg-white/5 border border-white/10 rounded-xl
                pr-10 pl-4 py-2 text-sm text-white placeholder-gray-500
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all font-arabic
              "
            />
          </div>
        </form>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 mr-auto">

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.88, rotate: 20 }}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            title="تبديل المظهر"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={toggleMuted}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            title="كتم الصوت"
          >
            {isMuted ? '🔇' : '🔊'}
          </motion.button>

          {profile ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="relative">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                >
                  🔔
                  {unread > 0 && (
                    <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-black flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* User menu */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <span className="text-lg">
                    {profile.role === 'admin' ? '⚙️' : profile.role === 'seller' ? '🛠️' : '👤'}
                  </span>
                  <span className="hidden sm:block max-w-[100px] truncate">{profile.full_name}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute left-0 top-full mt-2 w-52 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {profile.role === 'seller' && seller && (
                        <>
                          <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">
                            📊 لوحة التحكم
                          </Link>
                          <Link to="/dashboard/deals" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">
                            🤝 صفقاتي
                          </Link>
                          <Link to="/dashboard/payments" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">
                            💰 المدفوعات
                          </Link>
                          <div className="border-t border-white/10" />
                        </>
                      )}
                      {profile.role === 'admin' && (
                        <>
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-yellow-400 transition-all">
                            ⚙️ لوحة الإدارة
                          </Link>
                          <div className="border-t border-white/10" />
                        </>
                      )}
                      <Link to="/messages" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">
                        💬 الرسائل
                      </Link>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">
                        👤 ملفي الشخصي
                      </Link>
                      <div className="border-t border-white/10" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-all"
                      >
                        🚪 تسجيل الخروج
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => openModal('login')}>
                دخول
              </Button>
              <Button size="sm" onClick={() => openModal('register-seller')}>
                + سجل حرفياً
              </Button>
            </>
          )}

          {/* Mobile burger */}
          <button
            className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/98 border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-3">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث عن حرفي..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary font-arabic"
                />
              </form>
              {NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                    ${location.pathname === path ? 'bg-primary/15 text-primary' : 'text-gray-400'}
                  `}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
