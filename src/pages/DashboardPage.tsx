import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { getSellerDeals } from '@/services/deal.service'
import { getSellerPayments } from '@/services/payment.service'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getCommissionStatus, formatDZD, PAYMENT_DEADLINE_HOURS } from '@/utils/commission'
import { formatDate, formatDateTime, paymentStatusLabel } from '@/utils/formatters'
import { useSound } from '@/hooks/useSound'

function StatCard({ icon, label, value, sub, color = 'text-primary', urgent = false }: {
  icon: string; label: string; value: string | number; sub?: string
  color?: string; urgent?: boolean
}) {
  return (
    <motion.div
      className={`bg-surface border rounded-xl p-5 ${urgent ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10'}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-sm font-bold text-white mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const navigate    = useNavigate()
  const { play }    = useSound()
  const { seller, profile } = useAuthStore()
  const { openModal } = useUIStore()

  useEffect(() => {
    if (!profile) { navigate('/'); return }
    if (profile.role !== 'seller') navigate('/')
  }, [profile, navigate])

  const { data: deals }    = useQuery({ queryKey: ['deals', seller?.id],    queryFn: () => getSellerDeals(seller!.id),    enabled: !!seller })
  const { data: payments } = useQuery({ queryKey: ['payments', seller?.id], queryFn: () => getSellerPayments(seller!.id), enabled: !!seller })

  if (!seller) return null

  const cs = getCommissionStatus(seller)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            مرحباً، {seller.full_name} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {seller.status === 'active' ? '✅ حسابك نشط' :
             seller.status === 'pending' ? '⏳ بانتظار التوثيق' :
             seller.status === 'blocked' ? '🚫 حسابك موقوف' :
             '❌ محظور نهائياً'}
          </p>
        </div>
        <div className="flex gap-2">
          {seller.status === 'active' && !seller.promoted && (
            <Button size="sm" variant="gold" onClick={() => { play('click'); openModal('promotion') }}>
              🔥 روّج الآن
            </Button>
          )}
          {cs.unpaid >= 500 && (
            <Button size="sm" variant="danger" onClick={() => { play('click'); openModal('payment') }}>
              💰 سدّد العمولة
            </Button>
          )}
        </div>
      </div>

      {/* ── Urgent alert ── */}
      {(cs.isBlocked || cs.isOverdue || cs.hoursUntilDeadline !== null && cs.hoursUntilDeadline < 12) && (
        <motion.div
          className={`rounded-xl p-4 mb-6 border text-sm
            ${cs.isPermanentlyBanned
              ? 'bg-red-900/20 border-red-500/40 text-red-300'
              : cs.isBlocked
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {cs.isPermanentlyBanned ? (
            <p>🚫 <strong>تم حظر حسابك نهائياً</strong> — لا يمكن إعادة تفعيله حتى بعد الدفع.</p>
          ) : cs.isBlocked ? (
            <div className="space-y-2">
              <p>🚫 <strong>حسابك موقوف</strong> — لن يظهر في نتائج البحث حتى تسدد العمولة.</p>
              <p>المبلغ المطلوب: <strong>{formatDZD(cs.total)}</strong> (يشمل الغرامة)</p>
              <Button size="sm" variant="danger" onClick={() => openModal('payment')}>
                💰 سدّد الآن لإعادة التفعيل
              </Button>
            </div>
          ) : (
            <p>
              ⚠️ لديك عمولة مستحقة ({formatDZD(cs.unpaid)}).
              {cs.hoursUntilDeadline !== null && (
                <strong> متبقّ {cs.hoursUntilDeadline} ساعة قبل التعليق.</strong>
              )}
            </p>
          )}
        </motion.div>
      )}

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="🤝" label="إجمالي الصفقات"
          value={seller.total_deals}
          sub="صفقة مكتملة"
        />
        <StatCard
          icon="🎁" label="الصفقات المجانية"
          value={cs.dealsRemaining}
          sub="متبقية مجاناً"
          color="text-secondary"
        />
        <StatCard
          icon="💰" label="العمولة المستحقة"
          value={formatDZD(cs.unpaid)}
          sub={cs.unpaid >= 500 ? `⏰ ${cs.hoursUntilDeadline ?? PAYMENT_DEADLINE_HOURS}س للسداد` : 'أقل من حد المطالبة'}
          color={cs.unpaid >= 500 ? 'text-red-400' : 'text-gray-300'}
          urgent={cs.unpaid >= 500}
        />
        <StatCard
          icon="⭐" label="متوسط التقييم"
          value={seller.rating_avg.toFixed(1)}
          sub={`${seller.rating_count} تقييم`}
          color="text-gold"
        />
      </div>

      {/* ── Promotion status ── */}
      {seller.promoted && seller.promoted_until && (
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-gold font-black text-sm">🔥 الترويج نشط</div>
            <div className="text-gray-400 text-xs mt-0.5">
              ينتهي في: {formatDate(seller.promoted_until)}
            </div>
          </div>
          <Button size="sm" variant="gold" onClick={() => openModal('promotion')}>
            تجديد
          </Button>
        </div>
      )}

      {/* ── Commission system explanation ── */}
      {cs.isFree && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
          <div className="font-bold text-secondary text-sm mb-1">🎁 أنت في فترة المجانية!</div>
          <div className="text-xs text-gray-400">
            متبقّ لك {cs.dealsRemaining} صفقة مجانية قبل بدء احتساب العمولة (5% من قيمة كل صفقة).
          </div>
        </div>
      )}

      {/* ── Recent deals ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">🤝 آخر الصفقات</h2>
          <Link to="/dashboard/deals" className="text-primary text-sm font-bold hover:underline">
            عرض الكل ←
          </Link>
        </div>

        {!deals?.length ? (
          <div className="bg-surface border border-white/10 rounded-xl py-10 text-center text-gray-400 text-sm">
            لا توجد صفقات بعد. شارك رابط ملفك لتلقّي طلبات.
          </div>
        ) : (
          <div className="space-y-3">
            {deals.slice(0, 5).map(deal => (
              <div key={deal.id} className="bg-surface border border-white/10 rounded-xl px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">{deal.buyer?.full_name ?? 'زبون'}</div>
                  <div className="text-xs text-gray-500">{formatDate(deal.created_at)}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-secondary text-sm">{formatDZD(deal.agreed_price)}</div>
                  {deal.commission_amount > 0 && (
                    <div className="text-xs text-gray-500">عمولة: {formatDZD(deal.commission_amount)}</div>
                  )}
                </div>
                <Badge
                  variant={
                    deal.status === 'completed' ? 'success' :
                    deal.status === 'cancelled' ? 'error' : 'warning'
                  }
                >
                  {deal.status === 'completed' ? '✅ مكتملة' :
                   deal.status === 'confirmed'  ? '🔄 مؤكدة'  :
                   deal.status === 'cancelled'  ? '❌ ملغاة'  : '⏳ معلقة'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent payments ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">💳 آخر المدفوعات</h2>
          <Link to="/dashboard/payments" className="text-primary text-sm font-bold hover:underline">
            عرض الكل ←
          </Link>
        </div>

        {!payments?.length ? (
          <div className="bg-surface border border-white/10 rounded-xl py-10 text-center text-gray-400 text-sm">
            لا توجد مدفوعات بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {payments.slice(0, 5).map(p => {
              const ps = paymentStatusLabel(p.status)
              return (
                <div key={p.id} className="bg-surface border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white capitalize">{p.type}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(p.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white">{formatDZD(p.total_amount)}</div>
                    {p.penalty_amount > 0 && (
                      <div className="text-xs text-red-400">يشمل غرامة {formatDZD(p.penalty_amount)}</div>
                    )}
                  </div>
                  <span className={`text-xs font-bold ${ps.color}`}>{ps.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
