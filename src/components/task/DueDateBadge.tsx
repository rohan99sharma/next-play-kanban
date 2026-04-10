import { cn, formatDate, getDueDateState } from '@/lib/utils'
import type { TaskStatus } from '@/types'

interface DueDateBadgeProps {
  dueDate: string | null
  status: TaskStatus
  className?: string
}

export function DueDateBadge({ dueDate, status, className }: DueDateBadgeProps) {
  if (!dueDate) return null
  const state = getDueDateState(dueDate, status)
  if (!state) return null

  const styles = {
    overdue: 'text-red-600 bg-red-50',
    'due-soon': 'text-amber-600 bg-amber-50',
    ok: 'text-gray-500 bg-gray-50',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
        styles[state],
        className,
      )}
    >
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 1a1 1 0 00-1 1v1H3a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-1V2a1 1 0 10-2 0v1H6V2a1 1 0 00-1-1zM3 7h10v7H3V7z" />
      </svg>
      {formatDate(dueDate)}
    </span>
  )
}
