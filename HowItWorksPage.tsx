import { motion } from 'framer-motion'
import { useUIStore } from '@/store/ui.store'
import { Button } from '@/components/ui/Button'
import { formatDZD } from '@/utils/commission'

const PENALTY_ROWS = [
  { offense: '1️⃣ المرة الأولى',  rate: 40,  example: '1000 → 1400 دج' },
  { offense: '2️⃣ المرة الثانية', rate: 60,  example: '1000 → 1600 دج' },
  { offense: '3️⃣ المرة الثالثة', rate: 80,  example: '1000 → 1800 دج' },
  { offense: '4️⃣ المرة الرابعة', rate: 100, example: '1000 → 2000 دج' },
  { offense: '5️⃣ المرة الخامسة', rate: null, example: '🚫 حظر دائم نهائي' },
]

const STEPS = [
  { icon: '🔍', title: 'ابحث عن الخدمة',  desc: 'اختر الفئة أو ابحث بالاسم، أو اضغط "أقرب حرفي إليك" لاستخدام GPS' },
  { icon: '👤', title: 'اختر الحرفي',       desc: 'قارن التقييمات والأسعار والمسافة والتحقق من التوثيق' },
  { icon: '📞', title: 'تواصل مباشرة',      desc: 'اتصل أو راسل الحرفي مباشرة واتفق على السعر والموعد' },
  { icon: '✅', title: 'أكمل الصفقة',       desc: 'أكمل الصفقة وأكدها في التطبيق لتسجيلها رسمياً' },
  { icon: '⭐', title: 'قيّم الخدمة',       desc: 'قيّم الحرفي بعد انتهاء العمل لمساعدة المستخدمين الآخرين' },
]

const DOCS_REQUIRED = [
  { icon: '📸', label: 'صورة سيلفي مع بطاقة التعريف', note: 'الوجه مكشوف + البطاقة مقروءة' },
  { icon: '🪪', label: 'بطاقة التعريف — الوجه الأمامي', note: 'جميع البيانات واضحة' },
  { icon: '🪪', label: 'بطاقة التعريف — الوجه الخلفي', note: 'الرقم التسلسلي مقروء' },
  { icon: '🎓', label: 'الشهادة أو الديبلوم المهني', note: 'يثبت الكفاءة في المهنة' },
  { icon: '📍', label: 'الموقع الجغرافي (GPS)', note: 'يتم جلبه تلقائياً من المتصفح' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="mb-14"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
    >
      <h2 className="text-xl sm:text-2xl font-black text-white mb-6">{title}</h2>
      {children}
    </motion.section>
  )
}

export default function HowItWorksPage() {
  const { openModal } = useUIStore()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Hero ── */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
          💡 كيف يعمل <span className="text-primary">Zn_SkillsHub</span>؟
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
          كل ما تحتاج معرفته عن المنصة — للزبائن وللحرفيين
        </p>
      </motion.div>

      {/* ── للزبون ── */}
      <Section title="🛒 للزبون — كيف تجد حرفياً؟">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-white/10 rounded-card p-5"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div className="font-black text-white mb-1.5">{step.title}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── للحرفي ── */}
      <Section title="🛠️ للحرفي — كيف تسجّل وتستفيد؟">
        <div className="bg-surface border border-white/10 rounded-2xl divide-y divide-white/5">
          {[
            { step: '1', title: 'أنشئ حساباً', desc: 'سجّل بريدك الإلكتروني واختر دور "حرفي"' },
            { step: '2', title: 'ارفع وثائق التوثيق', desc: 'صورة سيلفي، بطاقة تعريف (وجهان)، الشهادة المهنية، الموقع الجغرافي' },
            { step: '3', title: 'انتظر موافقة الإدارة', desc: 'يتم مراجعة وثائقك خلال 24 ساعة. ستتلقى إشعاراً فور التفعيل.' },
            { step: '4', title: 'ابدأ باستقبال الطلبات', desc: 'أول 10 صفقات مجانية تماماً بدون أي عمولة' },
            { step: '5', title: 'ادفع العمولة في الوقت المحدد', desc: 'بعد الصفقة 11: 5% عمولة. عند 500 دج+: مهلة 48 ساعة للدفع عبر CCP' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-4">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{s.title}</div>
                <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => openModal('register-seller')}>
            🚀 سجّل كحرفي مجاناً
          </Button>
        </div>
      </Section>

      {/* ── وثائق التسجيل ── */}
      <Section title="🪪 وثائق التسجيل الإلزامية (5 وثائق)">
        <div className="space-y-3">
          {DOCS_REQUIRED.map((doc, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 bg-surface border border-white/10 rounded-xl px-5 py-3.5"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <span className="text-2xl">{doc.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{doc.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{doc.note}</div>
              </div>
              <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-lg">مطلوب</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── نظام العمولات ── */}
      <Section title="💰 نظام العمولات">
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden mb-5">
          <div className="grid grid-cols-3 text-xs font-bold text-gray-400 px-5 py-3 border-b border-white/10 bg-white/3">
            <span>الشريحة</span>
            <span>العمولة</span>
            <span>الملاحظة</span>
          </div>
          {[
            { range: 'الصفقات 1-10',  pct: '0%',  note: '🎁 مجاناً تماماً', color: 'text-secondary' },
            { range: 'الصفقة 11+',    pct: '5%',  note: '💳 5% من قيمة الصفقة', color: 'text-white' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-5 py-4 border-b border-white/5 text-sm">
              <span className="text-white font-bold">{row.range}</span>
              <span className={`font-black text-xl ${row.color}`}>{row.pct}</span>
              <span className="text-gray-400 text-xs self-center">{row.note}</span>
            </div>
          ))}
        </div>

        {/* Tolerance & deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="font-black text-yellow-400 text-sm mb-1.5">⚡ حد التسامح</div>
            <p className="text-gray-300 text-xs leading-relaxed">
              المبالغ أقل من <strong className="text-white">500 دج</strong> لا يُطالب بها فوراً.
              تتراكم حتى تصل 500 دج فأكثر.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="font-black text-red-400 text-sm mb-1.5">⏰ مهلة الدفع</div>
            <p className="text-gray-300 text-xs leading-relaxed">
              عند بلوغ 500 دج+: مهلة <strong className="text-white">48 ساعة</strong> للسداد.
              تذكير كل 12 ساعة. التجاوز = حظر فوري.
            </p>
          </div>
        </div>
      </Section>

      {/* ── نظام الغرامات ── */}
      <Section title="⚠️ الغرامات التصاعدية عند التأخر">
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 text-xs font-bold text-gray-400 px-5 py-3 border-b border-white/10 bg-white/3">
            <span>المرة</span>
            <span>الغرامة</span>
            <span>مثال على 1000 دج</span>
          </div>
          {PENALTY_ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 px-5 py-3.5 border-b border-white/5 text-sm
                ${i === PENALTY_ROWS.length - 1 ? 'bg-red-500/5' : ''}`}
            >
              <span className="font-bold text-white">{row.offense}</span>
              <span className={`font-black ${row.rate === null ? 'text-red-500' : 'text-red-400'}`}>
                {row.rate !== null ? `+${row.rate}%` : '🚫'}
              </span>
              <span className="text-gray-400 text-xs self-center">{row.example}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          الحظر الدائم (المرة الخامسة) لا يمكن رفعه حتى بعد الدفع.
        </p>
      </Section>

      {/* ── نظام الدفع ── */}
      <Section title="💳 طرق دفع العمولة">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CCP */}
          <div className="bg-surface border-2 border-primary/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🏦</div>
              <div>
                <div className="font-black text-white">CCP — بريد الجزائر</div>
                <div className="text-xs text-secondary font-bold">✅ متاح الآن</div>
              </div>
            </div>
            <ol className="space-y-1.5 text-xs text-gray-400">
              <li>1. افتح بريدي موب أو اذهب لمكتب البريد</li>
              <li>2. حوّل المبلغ على رقم الحساب المعروض</li>
              <li>3. ارفع صورة الوصل في التطبيق</li>
              <li>4. انتظر تأكيد الإدارة (خلال 24 ساعة)</li>
            </ol>
          </div>

          {/* Edahabia */}
          <div className="bg-surface border border-white/10 rounded-xl p-5 opacity-60">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">💳</div>
              <div>
                <div className="font-black text-white">البطاقة الذهبية — Edahabia</div>
                <div className="text-xs text-yellow-400 font-bold">🕒 قريباً</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              سيتم تفعيل الدفع بالبطاقة الذهبية قريباً. تابعونا للتحديثات.
            </p>
          </div>
        </div>
      </Section>

      {/* ── الترويج ── */}
      <Section title="🔥 نظام الترويج المدفوع">
        <div className="bg-gradient-to-br from-gold/10 to-primary/5 border border-gold/20 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-3xl font-black text-gold">1,000 دج</div>
              <div className="text-gray-400 text-sm">لكل أسبوع (1-12 أسبوع)</div>
            </div>
            <Button variant="gold" size="sm" onClick={() => openModal('promotion')}>
              اشترِ الآن
            </Button>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              '🔝 تظهر أولاً في نتائج البحث ضمن نفس الولاية',
              '🔥 شارة مميزة على بطاقتك',
              '⭐ ظهور في قسم "مميزون" بالصفحة الرئيسية',
              '📍 أولوية في نتائج "أقرب حرفي إليك"',
              '🚀 زيادة ظهورك أمام الزبائن بشكل كبير',
            ].map((b, i) => (
              <li key={i} className="flex items-center gap-2">{b}</li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-gray-500">
            الترويج يُفعَّل بعد تأكيد الإدارة للوصل. لا يُجدَّد تلقائياً.
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-black text-white mb-4">جاهز تبدأ؟</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => openModal('register-seller')}>
            🛠️ سجّل كحرفي مجاناً
          </Button>
          <Button size="lg" variant="secondary" onClick={() => openModal('login')}>
            🔍 ابحث عن حرفي
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
