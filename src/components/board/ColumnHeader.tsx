import { cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/utils'
import type { TaskStatus } from '@/types'

interface ColumnHeaderProps {
  status: TaskStatus
  count: number
  onAdd: () => void
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  in_review: 'bg-amber-500',
  done: 'bg-emerald-500',
}

export function ColumnHeader({ status, count, onAdd }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <div className={cn('h-2 w-2 rounded-full', statusColors[status])} />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {STATUS_LABELS[status]}
        </span>
        <span className="text-xs text-gray-400 font-medium tabular-nums">{count}</span>
      </div>
      <button
        onClick={onAdd}
        className="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label={`Add task to ${STATUS_LABELS[status]}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z" />
        </svg>
      </button>
    </div>
  )
}
