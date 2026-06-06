import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSellerById } from '@/hooks/useSellers'
import { useQuery } from '@tanstack/react-query'
import { getSellerRatings } from '@/services/deal.service'
import { Button } from '@/components/ui/Button'
import { Badge, StarRating } from '@/components/ui/Badge'
import { SellerCardSkeleton } from '@/components/ui/Skeleton'
import { formatDate, sellerStatusLabel } from '@/utils/formatters'
import { CATEGORIES_MAP } from '@/data/categories'

type Tab = 'about' | 'ratings' | 'chat'

export default function SellerProfilePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('about')

  const { data: seller, isLoading } = useSellerById(id)
  const { data: ratings } = useQuery({
    queryKey: ['ratings', id],
    queryFn:  () => getSellerRatings(id!),
    enabled:  !!id && tab === 'ratings',
  })

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SellerCardSkeleton />
    </div>
  )

  if (!seller) return (
    <div className="text-center py-24 text-gray-400">
      <div className="text-5xl mb-4">😕</div>
      <p>لم يتم العثور على الحرفي</p>
      <Button variant="secondary" onClick={() => navigate('/search')} className="mt-4">
        العودة للبحث
      </Button>
    </div>
  )

  const cat     = CATEGORIES_MAP[seller.category_id]
  const status  = sellerStatusLabel(seller.status)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Profile card ── */}
      <motion.div
        className={`bg-surface border rounded-2xl overflow-hidden mb-6
          ${seller.promoted ? 'border-gold/40 shadow-glow-gold' : 'border-white/10'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {seller.promoted && (
          <div className="bg-gradient-to-r from-gold to-yellow-400 text-gray-900 text-xs font-black text-center py-2 tracking-wide">
            ⭐ حرفي مميز — يظهر أولاً في نتائج البحث
          </div>
        )}

        <div className="p-6">
          <div className="flex gap-5 mb-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center text-4xl flex-shrink-0">
              {cat?.icon ?? '🛠️'}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-black text-white">{seller.full_name}</h1>
                  <div className="text-primary font-bold text-sm mt-0.5">
                    {seller.subcategory ?? cat?.name}
                  </div>
                </div>
                <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1.5">
                <span>📍</span>
                <span>{seller.wilaya} — {seller.commune}</span>
              </div>
              <div className="mt-2">
                <StarRating rating={seller.rating_avg} count={seller.rating_count} />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {seller.verified && <Badge variant="success">✅ موثق رسمياً</Badge>}
            {seller.promoted && <Badge variant="gold">🔥 مميز</Badge>}
            <Badge variant="primary">🤝 {seller.total_deals} صفقة</Badge>
            {seller.free_deals_remaining > 0 && (
              <Badge variant="warning">🎁 {seller.free_deals_remaining} صفقة مجانية</Badge>
            )}
          </div>

          {/* Description */}
          {seller.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              {seller.description}
            </p>
          )}

          {/* Contact buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${seller.phone}`}>
              <Button variant="secondary" className="w-full">
                📞 اتصل الآن
              </Button>
            </a>
            {seller.whatsapp ? (
              <a
                href={`https://wa.me/${seller.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="gold" className="w-full">
                  💬 واتساب
                </Button>
              </a>
            ) : (
              <Button onClick={() => setTab('chat')}>
                💬 مراسلة
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-white/10 mb-6">
        {([['about', '📋 عن الحرفي'], ['ratings', '⭐ التقييمات'], ['chat', '💬 المراسلة']] as const).map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all
              ${tab === t ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {tab === 'about' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-surface border border-white/10 rounded-xl divide-y divide-white/5">
            {[
              { label: 'الفئة المهنية', value: cat?.name ?? '—' },
              { label: 'التخصص',        value: seller.subcategory ?? '—' },
              { label: 'الولاية',        value: `${seller.wilaya} — ${seller.commune}` },
              { label: 'الهاتف',         value: seller.phone },
              { label: 'عدد الصفقات',   value: `${seller.total_deals} صفقة` },
              { label: 'عضو منذ',        value: formatDate(seller.created_at) },
            ].map(row => (
              <div key={row.label} className="flex justify-between px-5 py-3 text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className="text-white font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === 'ratings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {!ratings?.length ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">⭐</div>
              <p>لا توجد تقييمات بعد</p>
            </div>
          ) : (
            ratings.map(r => (
              <div key={r.id} className="bg-surface border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-black text-white">
                    {r.buyer?.full_name?.[0] ?? '؟'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{r.buyer?.full_name ?? 'مجهول'}</div>
                    <div className="text-xs text-gray-500">{formatDate(r.created_at)}</div>
                  </div>
                  <div className="mr-auto text-gold text-sm">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                </div>
                {r.comment && <p className="text-gray-300 text-sm">{r.comment}</p>}
              </div>
            ))
          )}
        </motion.div>
      )}

      {tab === 'chat' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400 mb-4">سجّل الدخول لإرسال رسالة للحرفي</p>
          <Button onClick={() => navigate('/login')}>تسجيل الدخول</Button>
        </motion.div>
      )}
    </div>
  )
}
