interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-white/5 via-white/10 to-white/5
        bg-[length:200%_100%] animate-shimmer rounded-xl
        ${className}
      `}
    />
  )
}

export function SellerCardSkeleton() {
  return (
    <div className="bg-surface border border-white/10 rounded-card p-5 space-y-4">
      <div className="flex gap-3">
        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-surface border border-white/10 rounded-card p-5 flex flex-col items-center gap-2">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
    </div>
  )
}
