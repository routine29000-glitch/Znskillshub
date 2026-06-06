import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useGPS } from '@/hooks/useGPS'
import { useSound } from '@/hooks/useSound'
import { useUIStore } from '@/store/ui.store'
import { usePromotedSellers } from '@/hooks/useSellers'
import { SellerCard } from '@/components/seller/SellerCard'
import { SellerCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { CATEGORIES_DETAIL } from '@/data/categories'
import { haversineDistance } from '@/hooks/useGPS'
import { formatNumber } from '@/utils/formatters'
import toast from 'react-hot-toast'

// ── Typewriter hook ──────────────────────────────────────
const WORDS = ['سباك', 'كهربائي', 'معلم', 'مصور', 'حداد', 'نجار', 'طبيب', 'مبرمج', 'طباخ', 'محامي']

function useTypewriter(words: string[], speed = 110, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx]   = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let timer: ReturnType<typeof setTimeout>

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting) {
      timer = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

// ── CountUp component ────────────────────────────────────
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start    = Date.now()
    const tick = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease     = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setCount(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>
}

// ── Main component ───────────────────────────────────────
export default function HomePage() {
  const navigate       = useNavigate()
  const { openModal }  = useUIStore()
  const { play }       = useSound()
  const { locate, isLoading: gpsLoading, position } = useGPS()
  const typed          = useTypewriter(WORDS)
  const [search, setSearch] = useState('')

  const { data: promoted, isLoading: promotedLoading } = usePromotedSellers()

  const handleGPS = async () => {
    try {
      const gps = await locate()
      play('success')
      toast.success('تم تحديد موقعك! جاري البحث...')
      navigate(`/search?lat=${gps.lat}&lng=${gps.lng}`)
    } catch {
      toast.error('يرجى السماح بالوصول للموقع الجغرافي')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        </div>

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-sm font-bold px-5 py-2 rounded-full mb-7"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          🇩🇿 منصة الحرفيين المحليين الأولى في الجزائر
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ابحث عن{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative">
            {typed}
            <span className="animate-pulse text-primary">|</span>
          </span>
          <br />
          <span className="text-gray-300">في ولايتك الآن</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          أكثر من{' '}
          <strong className="text-white">24,000 حرفي موثق</strong>{' '}
          في 58 ولاية — من السباك إلى المبرمج
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-xl mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="relative flex gap-2 bg-white/5 border border-white/15 rounded-2xl p-2 focus-within:border-primary/50 transition-all">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="سباك، كهربائي، مدرس..."
              className="flex-1 bg-transparent pr-10 pl-3 py-2.5 text-white placeholder-gray-500 outline-none text-base font-arabic"
            />
            <Button type="submit" size="sm">بحث</Button>
          </div>
        </motion.form>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Button
            variant="gold"
            size="lg"
            onClick={handleGPS}
            loading={gpsLoading}
          >
            📍 {gpsLoading ? 'جارٍ التحديد...' : 'أقرب حرفي إليك'}
          </Button>
          <Button
            size="lg"
            onClick={() => { play('click'); navigate('/search') }}
          >
            🔍 تصفح الحرفيين
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => openModal('register-seller')}
          >
            🛠️ سجّل كحرفي مجاناً
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-12 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {['🔒 حرفيون موثقون بالوثائق', '⭐ تقييمات حقيقية', '📍 GPS دقيق', '🆓 أول 10 صفقات مجانية'].map(b => (
            <span key={b} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{b}</span>
          ))}
        </motion.div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-secondary py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {[
              { target: 24560, label: 'حرفي مسجل', suffix: '' },
              { target: 58,    label: 'ولاية مغطاة', suffix: '' },
              { target: 186420, label: 'صفقة مكتملة', suffix: '' },
              { target: 98,    label: 'نسبة الرضا', suffix: '%' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black mb-1">
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-sm opacity-85 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              🗂️ الفئات <span className="text-primary">المهنية</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">40 فئة — أكثر من 24,000 حرفي</p>
          </div>
          <Link to="/search" className="text-primary font-bold text-sm hover:underline">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {CATEGORIES_DETAIL.slice(0, 24).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.025 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/search?cat=${cat.id}`)}
              className="bg-surface border border-white/10 hover:border-opacity-60 rounded-card px-3 py-4 text-center cursor-pointer transition-colors group"
              style={{ '--tw-border-opacity': 1, borderColor: `${cat.color}30` } as React.CSSProperties}
            >
              <div
                className="text-3xl mb-2 group-hover:scale-110 transition-transform"
                style={{ filter: `drop-shadow(0 0 6px ${cat.color}60)` }}
              >
                {cat.icon}
              </div>
              <div className="text-xs font-bold text-white leading-tight">{cat.name}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button variant="secondary" onClick={() => navigate('/search')}>
            عرض جميع الفئات الـ 40 ←
          </Button>
        </div>
      </section>

      {/* ═══════ PROMOTED SELLERS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              🔥 الحرفيون <span className="text-gold">المميزون</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">حرفيون يحظون بأولوية الظهور</p>
          </div>
          <Link to="/search?promoted=true" className="text-primary font-bold text-sm hover:underline">
            عرض الكل ←
          </Link>
        </div>

        {promotedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SellerCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(promoted ?? []).map((seller, i) => (
              <SellerCard
                key={seller.id}
                seller={seller}
                distance={position ? haversineDistance(position.lat, position.lng, seller.gps_lat ?? 0, seller.gps_lng ?? 0) : undefined}
                delay={i * 0.08}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="bg-surface/50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              💡 كيف <span className="text-primary">يعمل</span>؟
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">4 خطوات بسيطة للوصول إلى أفضل الحرفيين</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔍', title: 'ابحث عن الخدمة',     desc: 'اختر الفئة أو ابحث بالاسم أو استخدم GPS للعثور على أقرب حرفي إليك' },
              { icon: '👤', title: 'اختر الحرفي',         desc: 'قارن التقييمات والأسعار والمسافة واختر الأنسب لك' },
              { icon: '📞', title: 'تواصل مباشرة',         desc: 'اتصل أو راسل الحرفي مباشرة واتفق على السعر والموعد' },
              { icon: '⭐', title: 'قيّم الخدمة',          desc: 'بعد انتهاء العمل قيّم الحرفي لمساعدة الآخرين' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative bg-surface border border-white/10 rounded-card p-6 text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-black text-lg flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="font-black text-white mb-2">{step.title}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROMO CTA ═══════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          className="relative bg-gradient-to-br from-gold/10 to-primary/10 border border-gold/20 rounded-2xl p-8 sm:p-12 text-center overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />

          <div className="text-5xl mb-4">🔥</div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            روّج لنشاطك وكن <span className="text-gold">الأول!</span>
          </h3>
          <div className="text-5xl font-black text-gold mb-2">
            1,000 <span className="text-xl text-gray-400 font-normal">دج / أسبوع</span>
          </div>

          <ul className="text-sm text-gray-300 space-y-2 mb-8 max-w-xs mx-auto text-right">
            {[
              '🔝 تظهر أولاً في نتائج البحث في ولايتك',
              '🔥 شارة مميزة على بطاقتك',
              '⭐ ظهور في قسم "مميزون" بالصفحة الرئيسية',
              '📍 أولوية في "أقرب حرفي إليك"',
            ].map(b => (
              <li key={b} className="flex items-center gap-2">{b}</li>
            ))}
          </ul>

          <Button size="lg" variant="gold" onClick={() => openModal('promotion')}>
            🚀 اشترِ الترويج الآن
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
