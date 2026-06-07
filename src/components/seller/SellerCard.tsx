import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Seller } from '@/types'
import { Badge, StarRating } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDZD } from '@/utils/formatters'
import { useSound } from '@/hooks/useSound'

interface SellerCardProps {
  seller: Seller
  distance?: number // km
  delay?: number
}

const CATEGORY_ICONS: Record<number, string> = {
  1: '📚', 2: '🔧', 3: '🚗', 4: '💇', 5: '💻',
  6: '🎪', 7: '🏠', 8: '🛒', 9: '🔩', 10: '🏥',
}

export function SellerCard({ seller, distance, delay = 0 }: SellerCardProps) {
  const navigate  = useNavigate()
  const { play }  = useSound()
  const [liked, setLiked] = useState(false)

  const handleContact = () => {
    play('click')
    navigate(`/seller/${seller.id}?tab=chat`)
  }

  const handleBook = () => {
    play('success')
    navigate(`/seller/${seller.id}`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(l => !l)
    play(liked ? 'click' : 'coin')
  }

  const categoryIcon = CATEGORY_ICONS[seller.category_id] ?? '🛠️'

  return (
    <motion.article
      className={`
        relative bg-surface border rounded-card overflow-hidden
        transition-colors duration-200 cursor-default group
        ${seller.promoted
          ? 'border-gold/40 shadow-glow-gold'
          : 'border-white/10 hover:border-primary/40'}
      `}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      whileHover={{ y: -5, boxShadow: seller.promoted ? undefined : '0 16px 40px rgba(108,99,255,0.18)' }}
    >
      {/* Promoted banner */}
      {seller.promoted && (
        <div className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-gray-900 text-xs font-black text-center py-1.5 tracking-wide">
          ⭐ حرفي مميز — أولوية في البحث
        </div>
      )}

      <div className="p-5">
        {/* ── Header row ── */}
        <div className="flex gap-3 mb-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center text-2xl">
              {seller.profile?.avatar_url
                ? <img src={seller.profile.avatar_url} alt={seller.full_name} className="w-full h-full rounded-2xl object-cover" />
                : categoryIcon}
            </div>
            {seller.verified && (
              <span className="absolute -bottom-1 -right-1 text-sm" title="حساب موثق">✅</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-black text-white text-base leading-tight truncate">
              {seller.full_name}
            </div>
            <div className="text-primary text-sm font-bold mt-0.5 truncate">
              {seller.subcategory ?? seller.category?.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <span>📍</span>
              <span>{seller.wilaya} — {seller.commune}</span>
              {distance !== undefined && (
                <span className="text-secondary font-bold">· {distance} كم</span>
              )}
            </div>
          </div>

          {/* Like btn */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className="self-start text-xl mt-0.5 flex-shrink-0"
          >
            {liked ? '❤️' : '🤍'}
          </motion.button>
        </div>

        {/* ── Rating ── */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={seller.rating_avg} count={seller.rating_count} />
        </div>

        {/* ── Badges ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {seller.verified && (
            <Badge variant="success">✅ موثق</Badge>
          )}
          {seller.promoted && (
            <Badge variant="gold">🔥 مميز</Badge>
          )}
          <Badge variant="primary">
            🤝 {seller.total_deals} صفقة
          </Badge>
          {seller.free_deals_remaining > 0 && (
            <Badge variant="warning">
              🎁 {seller.free_deals_remaining} مجانية
            </Badge>
          )}
        </div>

        {/* ── Description ── */}
        {seller.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
            {seller.description}
          </p>
        )}

        {/* ── Phone ── */}
        <div className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
          <span>📞</span>
          <a
            href={`tel:${seller.phone}`}
            className="hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {seller.phone}
          </a>
          {seller.whatsapp && (
            <a
              href={`https://wa.me/${seller.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-green-400 hover:text-green-300 text-base"
              onClick={e => e.stopPropagation()}
            >
              💬
            </a>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={handleContact}>
            💬 تواصل
          </Button>
          <Button size="sm" onClick={handleBook}>
            📅 احجز الآن
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
