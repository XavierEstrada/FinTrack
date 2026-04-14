export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  )
}

export function SkeletonRow() {
  return (
    <tr>
      <td className="px-5 py-3.5"><Skeleton className="h-4 w-20" /></td>
      <td className="px-5 py-3.5"><Skeleton className="h-4 w-40" /></td>
      <td className="px-5 py-3.5"><Skeleton className="h-4 w-24" /></td>
      <td className="px-5 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-5 py-3.5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="px-5 py-3.5"><div className="flex justify-end gap-1"><Skeleton className="h-7 w-7 rounded-md" /><Skeleton className="h-7 w-7 rounded-md" /><Skeleton className="h-7 w-7 rounded-md" /></div></td>
    </tr>
  )
}

export function SkeletonBudgetCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div><Skeleton className="h-4 w-24 mb-1.5" /><Skeleton className="h-3 w-16" /></div>
        </div>
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export function SkeletonListRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  )
}

export function SkeletonCardGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonBudgetCard key={i} />)}
    </div>
  )
}
