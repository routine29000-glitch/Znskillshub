import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = {
  'المنصة': [
    { label: 'كيف يعمل؟', to: '/how' },
    { label: 'الفئات المهنية', to: '/search' },
    { label: 'سجل كحرفي', to: '/register' },
    { label: 'الترويج المدفوع', to: '/pricing' },
  ],
  'الدعم': [
    { label: 'اتصل بنا', to: '/contact' },
    { label: 'الأسئلة الشائعة', to: '/faq' },
    { label: 'الإبلاغ عن مشكلة', to: '/report' },
  ],
  'قانوني': [
    { label: 'شروط الاستخدام', to: '/terms' },
    { label: 'سياسة الخصوصية', to: '/privacy' },
    { label: 'سياسة العمولات', to: '/commissions' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              ⚡ Zn_SkillsHub
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              منصة الحرفيين المحليين الأولى في الجزائر — نربطك بأفضل المهنيين الموثوقين في ولايتك.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-xl px-3 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>متوفر في 58 ولاية 🇩🇿</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-400 hover:text-primary text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { num: '+24,000', label: 'حرفي مسجل' },
            { num: '+186,000', label: 'صفقة مكتملة' },
            { num: '58', label: 'ولاية مغطاة' },
            { num: '98%', label: 'نسبة الرضا' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl px-4 py-3 text-center">
              <div className="text-primary font-black text-lg">{s.num}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Payment badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-gray-500 text-xs">طرق الدفع المقبولة:</span>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white">
            🏦 CCP بريد الجزائر
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500">
            💳 Edahabia
            <span className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded text-[10px]">قريباً</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs text-center sm:text-right">
            © {new Date().getFullYear()} Zn_SkillsHub — جميع الحقوق محفوظة 🇩🇿
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>مستضاف على Vercel</span>
            <span>·</span>
            <span>قاعدة بيانات Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
