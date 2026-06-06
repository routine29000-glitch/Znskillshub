import { motion } from 'framer-motion'
import type { SearchResult, Seller } from '@/types'
import { SellerCard } from './SellerCard'
import { SellerCardSkeleton } from '@/components/ui/Skeleton'
import { haversineDistance, type GPSPosition } from '@/hooks/useGPS'

interface SellerGridProps {
  result?: SearchResult
  isLoading?: boolean
  gps?: GPSPosition | null
}

function SectionLabel({ emoji, title, count }: { emoji: string; title: string; count: number }) {
  if (count === 0) return null
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-sm font-bold text-gray-400 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
        {emoji} {title}
        <span className="text-primary">({count})</span>
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function Grid({ sellers, gps, startDelay = 0 }: { sellers: Seller[]; gps?: GPSPosition | null; startDelay?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {sellers.map((seller, i) => {
        const distance =
          gps && seller.gps_lat && seller.gps_lng
            ? haversineDistance(gps.lat, gps.lng, seller.gps_lat, seller.gps_lng)
            : undefined

        return (
          <SellerCard
            key={seller.id}
            seller={seller}
            distance={distance}
            delay={startDelay + i * 0.06}
          />
        )
      })}
    </div>
  )
}

export function SellerGrid({ result, isLoading, gps }: SellerGridProps) {
  /* ── Loading skeletons ── */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <SellerCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  /* ── Empty state ── */
  if (!result) return null

  const total =
    result.promoted_same_wilaya.length +
    result.promoted_nearby.length +
    result.verified_closest.length +
    result.others.length

  if (total === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-6xl mb-5">🔍</div>
        <h3 className="text-xl font-black text-white mb-2">لا توجد نتائج</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          لم نجد حرفيين مطابقين لبحثك. جرّب تغيير الفلاتر أو اختر ولاية أخرى.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Level 1 — Promoted same wilaya */}
      {result.promoted_same_wilaya.length > 0 && (
        <section>
          <SectionLabel emoji="🔥" title="مميزون في ولايتك" count={result.promoted_same_wilaya.length} />
          <Grid sellers={result.promoted_same_wilaya} gps={gps} />
        </section>
      )}

      {/* Level 2 — Promoted nearby */}
      {result.promoted_nearby.length > 0 && (
        <section>
          <SectionLabel emoji="⭐" title="مميزون في ولايات مجاورة" count={result.promoted_nearby.length} />
          <Grid sellers={result.promoted_nearby} gps={gps} startDelay={0.1} />
        </section>
      )}

      {/* Level 3 — Verified closest */}
      {result.verified_closest.length > 0 && (
        <section>
          <SectionLabel emoji="✅" title="موثقون (الأقرب إليك)" count={result.verified_closest.length} />
          <Grid sellers={result.verified_closest} gps={gps} startDelay={0.2} />
        </section>
      )}

      {/* Level 4 — Others */}
      {result.others.length > 0 && (
        <section>
          <SectionLabel emoji="👤" title="حرفيون آخرون" count={result.others.length} />
          <Grid sellers={result.others} gps={gps} startDelay={0.3} />
        </section>
      )}
    </div>
  )
}
