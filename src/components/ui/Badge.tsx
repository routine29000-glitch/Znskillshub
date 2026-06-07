import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold' | 'primary'
  size?: 'sm' | 'md'
}

const variants = {
  default:  'bg-white/10 text-gray-300',
  success:  'bg-green-500/15 text-green-400',
  warning:  'bg-yellow-500/15 text-yellow-400',
  error:    'bg-red-500/15 text-red-400',
  gold:     'bg-gold/15 text-gold border border-gold/30',
  primary:  'bg-primary/15 text-primary-light',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-gold text-sm">
        {'★'.repeat(full)}
        {half ? '⭐' : ''}
        {'☆'.repeat(empty)}
      </span>
      <span className="text-gold font-bold text-sm">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-gray-500 text-xs">({count})</span>
      )}
    </span>
  )
}
