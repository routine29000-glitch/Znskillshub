import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import { Button } from '@/components/ui/Button'
import { CATEGORIES_DETAIL } from '@/data/categories'

export default function PricingPage() {
  const navigate     = useNavigate()
  const { openModal } = useUIStore()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          💰 الأسعار و<span className="text-primary">الفئات</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          كل الأسعار إرشادية — يحددها الحرفي بنفسه بناءً على خبرته وتكاليفه.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {/* Free plan */}
        <motion.div
          className="bg-surface border border-white/10 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -4 }}
        >
          <div className="text-4xl mb-3">🎁</div>
          <div className="text-xl font-black text-white mb-1">خطة البداية</div>
          <div className="text-4xl font-black text-secondary my-4">مجاناً</div>
          <div className="text-gray-400 text-sm mb-6">لأول 10 صفقات</div>
          <ul className="space-y-2.5 text-sm text-gray-300 text-right mb-6">
            {[
              '✅ 0% عمولة على أول 10 صفقات',
              '✅ ظهور في نتائج البحث',
              '✅ بطاقة حرفي قابلة للتخصيص',
              '✅ تواصل مباشر مع الزبائن',
              '✅ تقييمات وتعليقات',
            ].map(f => <li key={f}>{f}</li>)}
          </ul>
          <Button variant="secondary" className="w-full" onClick={() => openModal('register-seller')}>
            ابدأ مجاناً
          </Button>
        </motion.div>

        {/* Standard plan */}
        <motion.div
          className="bg-gradient-to-b from-primary/15 to-surface border-2 border-primary/40 rounded-2xl p-6 text-center relative shadow-glow"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full">
            الأكثر شيوعاً
          </div>
          <div className="text-4xl mb-3">🛠️</div>
          <div className="text-xl font-black text-white mb-1">خطة الاحتراف</div>
          <div className="text-4xl font-black text-primary my-4">5%</div>
          <div className="text-gray-400 text-sm mb-6">من قيمة كل صفقة (بعد الـ 10)</div>
          <ul className="space-y-2.5 text-sm text-gray-300 text-right mb-6">
            {[
              '✅ كل مزايا خطة البداية',
              '✅ عمولة فقط على الصفقات المكتملة',
              '✅ لا رسوم اشتراك شهرية',
              '✅ إشعارات فورية للصفقات',
              '✅ لوحة تحكم متكاملة',
            ].map(f => <li key={f}>{f}</li>)}
          </ul>
          <Button className="w-full" onClick={() => openModal('register-seller')}>
            سجّل الآن
          </Button>
        </motion.div>

        {/* Promo plan */}
        <motion.div
          className="bg-gradient-to-b from-gold/10 to-surface border-2 border-gold/30 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -4 }}
        >
          <div className="text-4xl mb-3">🔥</div>
          <div className="text-xl font-black text-white mb-1">خطة الترويج</div>
          <div className="text-4xl font-black text-gold my-4">
            1,000
            <span className="text-lg text-gray-400 font-normal"> دج/أسبوع</span>
          </div>
          <div className="text-gray-400 text-sm mb-6">من 1 إلى 12 أسبوع</div>
          <ul className="space-y-2.5 text-sm text-gray-300 text-right mb-6">
            {[
              '🔝 أولوية الظهور في ولايتك',
              '🔥 شارة "مميز" على بطاقتك',
              '⭐ ظهور في الصفحة الرئيسية',
              '📍 أول في "أقرب حرفي إليك"',
              '📈 زيادة مرات الظهور بشكل كبير',
            ].map(f => <li key={f}>{f}</li>)}
          </ul>
          <Button variant="gold" className="w-full" onClick={() => openModal('promotion')}>
            اشترِ الترويج
          </Button>
        </motion.div>
      </div>

      {/* Categories price guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white mb-2">
          📋 دليل الأسعار الإرشادية
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          الأسعار تقريبية — يحددها كل حرفي بنفسه بناءً على تكاليفه وخبرته
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES_DETAIL.map((cat, i) => (
            <motion.div
              key={cat.id}
              className="bg-surface border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-opacity-60 transition-colors"
              style={{ borderColor: `${cat.color}25` }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: (i % 6) * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(`/search?cat=${cat.id}`)}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
                style={{ background: `${cat.color}12` }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-black text-white text-sm">{cat.name}</span>
              </div>

              {/* Sections preview */}
              <div className="px-4 py-3 space-y-2">
                {cat.sections.slice(0, 2).map(section => (
                  <div key={section.name}>
                    <div className="text-xs font-bold text-gray-400 mb-1">{section.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {section.items.slice(0, 3).map(item => (
                        <span
                          key={item.name}
                          className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-lg"
                        >
                          {item.name}
                          {item.priceMin && (
                            <span className="text-secondary mr-1">
                              {item.priceMin.toLocaleString()}+
                            </span>
                          )}
                        </span>
                      ))}
                      {section.items.length > 3 && (
                        <span className="text-[10px] text-gray-600 px-2 py-0.5">
                          +{section.items.length - 3} أخرى
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {cat.sections.length > 2 && (
                  <div className="text-[10px] text-primary font-bold pt-1">
                    + {cat.sections.length - 2} أقسام أخرى — اضغط للاستعراض
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-black text-white mb-6">❓ أسئلة شائعة</h2>
        <div className="space-y-3">
          {[
            {
              q: 'هل التسجيل كحرفي مجاني؟',
              a: 'نعم، التسجيل مجاني تماماً. أول 10 صفقات أيضاً بدون أي عمولة.',
            },
            {
              q: 'متى تُحتسب العمولة؟',
              a: 'من الصفقة الحادية عشرة (11) فصاعداً، تُحتسب 5% من قيمة كل صفقة مكتملة.',
            },
            {
              q: 'كيف أدفع العمولة؟',
              a: 'عبر CCP بريد الجزائر — تحويل بريدي ثم رفع صورة الوصل. سيتم تفعيل Edahabia قريباً.',
            },
            {
              q: 'ماذا يحدث إذا لم أدفع في الوقت المحدد؟',
              a: 'عند تجاوز 500 دج غير مدفوعة: مهلة 48 ساعة، ثم حظر مؤقت مع غرامة تصاعدية (40% → 60% → 80% → 100%). الحظر الخامس دائم.',
            },
            {
              q: 'هل يمكنني التراجع عن الترويج؟',
              a: 'لا يمكن استرداد رسوم الترويج بعد تفعيله. يُنصح باختيار فترة قصيرة (أسبوع) للتجربة أولاً.',
            },
            {
              q: 'كيف يتم التحقق من هويتي؟',
              a: 'يراجع فريق الإدارة وثائقك يدوياً (سيلفي + بطاقة التعريف + الشهادة المهنية) خلال 24 ساعة.',
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group bg-surface border border-white/10 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-white text-sm select-none list-none">
                <span>{faq.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-black text-white mb-2">ابدأ اليوم — مجاناً</h3>
        <p className="text-gray-400 text-sm mb-6">أول 10 صفقات بدون عمولة. لا رسوم اشتراك.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => openModal('register-seller')}>
            🛠️ سجّل كحرفي مجاناً
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
            🔍 ابحث عن حرفي
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
