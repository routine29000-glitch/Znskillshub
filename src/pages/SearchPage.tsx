import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchSellers } from '@/hooks/useSellers'
import { useGPS } from '@/hooks/useGPS'
import { useSound } from '@/hooks/useSound'
import { SellerGrid } from '@/components/seller/SellerGrid'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { CATEGORIES_DETAIL } from '@/data/categories'
import { WILAYAS } from '@/data/wilayas'
import type { SearchFilters } from '@/types'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { value: 'rating',    label: '⭐ الأعلى تقييماً' },
  { value: 'deals',     label: '🤝 الأكثر صفقات' },
  { value: 'distance',  label: '📍 الأقرب إليّ' },
]

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const { play }  = useSound()
  const { locate, position, isLoading: gpsLoading } = useGPS()
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    query:        params.get('q')    ?? undefined,
    category_id:  params.get('cat')  ? Number(params.get('cat')) : undefined,
    wilaya:       params.get('wilaya') ?? undefined,
    sort_by:      'rating',
    verified_only: false,
    user_lat:     params.get('lat') ? Number(params.get('lat')) : undefined,
    user_lng:     params.get('lng') ? Number(params.get('lng')) : undefined,
  })

  const { data, isLoading, isFetching } = useSearchSellers(filters)

  const totalCount =
    (data?.promoted_same_wilaya.length ?? 0) +
    (data?.promoted_nearby.length ?? 0) +
    (data?.verified_closest.length ?? 0) +
    (data?.others.length ?? 0)

  const handleGPS = async () => {
    try {
      const gps = await locate()
      play('success')
      setFilters(f => ({ ...f, user_lat: gps.lat, user_lng: gps.lng, sort_by: 'distance' }))
      toast.success('✅ تم تحديد موقعك')
    } catch {
      toast.error('يرجى السماح بالوصول للموقع')
    }
  }

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(f => ({ ...f, [key]: value || undefined }))
  }

  const clearFilters = () => {
    setFilters({ sort_by: 'rating' })
    play('click')
  }

  const hasActiveFilters = !!(filters.query || filters.category_id || filters.wilaya || filters.verified_only)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            🔍 الحرفيون
            {filters.query && (
              <span className="text-primary"> — {filters.query}</span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLoading ? 'جارٍ البحث...' : `${totalCount} نتيجة`}
            {isFetching && !isLoading && <span className="text-primary mr-2">🔄 تحديث...</span>}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setShowFilters(v => !v); play('click') }}
        >
          {showFilters ? '✕ إخفاء' : '⚙️ فلاتر'}
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary mr-1" />}
        </Button>
      </div>

      {/* ── Filter panel ── */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="bg-surface border border-white/10 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search query */}
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 block">كلمة البحث</label>
            <input
              value={filters.query ?? ''}
              onChange={e => updateFilter('query', e.target.value)}
              placeholder="سباك، معلم..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary transition-all font-arabic"
            />
          </div>

          {/* Category */}
          <Select
            label="الفئة"
            placeholder="كل الفئات"
            value={filters.category_id ?? ''}
            onChange={e => updateFilter('category_id', e.target.value ? Number(e.target.value) : undefined)}
            options={CATEGORIES_DETAIL.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
          />

          {/* Wilaya */}
          <Select
            label="الولاية"
            placeholder="كل الولايات"
            value={filters.wilaya ?? ''}
            onChange={e => updateFilter('wilaya', e.target.value)}
            options={WILAYAS.map(w => ({ value: w, label: w }))}
          />

          {/* Sort */}
          <Select
            label="الترتيب"
            value={filters.sort_by ?? 'rating'}
            onChange={e => updateFilter('sort_by', e.target.value as SearchFilters['sort_by'])}
            options={SORT_OPTIONS}
          />

          {/* Verified toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer col-span-full sm:col-span-1">
            <div
              onClick={() => updateFilter('verified_only', !filters.verified_only)}
              className={`
                relative w-10 h-6 rounded-full transition-all
                ${filters.verified_only ? 'bg-primary' : 'bg-white/15'}
              `}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.verified_only ? 'right-1' : 'left-1'}`} />
            </div>
            <span className="text-sm text-gray-300 font-semibold">الموثقون فقط ✅</span>
          </label>

          {/* GPS button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGPS}
            loading={gpsLoading}
            className="col-span-full sm:col-span-1"
          >
            📍 {position ? 'تحديث الموقع' : 'الأقرب إليّ'}
          </Button>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-400 hover:text-red-300 font-bold transition-colors col-span-full text-right"
            >
              ✕ مسح الفلاتر
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Category chips (quick filter) ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => updateFilter('category_id', undefined)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all
            ${!filters.category_id ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
        >
          🌐 الكل
        </button>
        {CATEGORIES_DETAIL.map(c => (
          <button
            key={c.id}
            onClick={() => { updateFilter('category_id', c.id); play('click') }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap
              ${filters.category_id === c.id ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      <SellerGrid result={data} isLoading={isLoading} gps={position} />
    </div>
  )
}
