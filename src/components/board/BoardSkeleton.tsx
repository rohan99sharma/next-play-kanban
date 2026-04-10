import { TASK_STATUSES } from '@/types'

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-3 w-3 bg-gray-100 rounded-full" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-6">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="flex flex-col min-w-[280px] w-72 shrink-0">
          <div className="flex items-center gap-2 mb-3 px-1 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-gray-200" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-4 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-gray-50/60 p-2 min-h-[200px]">
            {[1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
