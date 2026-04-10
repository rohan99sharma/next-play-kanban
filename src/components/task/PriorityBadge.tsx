import { cn } from '@/lib/utils'
import type { Priority } from '@/types'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const styles: Record<Priority, string> = {
  low: 'text-gray-500',
  normal: 'text-blue-500',
  high: 'text-orange-500',
}

const icons: Record<Priority, React.ReactNode> = {
  low: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 12L2 6h12L8 12z" clipRule="evenodd" />
    </svg>
  ),
  normal: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2" y="7" width="12" height="2" rx="1" />
    </svg>
  ),
  high: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 4l6 6H2L8 4z" clipRule="evenodd" />
    </svg>
  ),
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', styles[priority], className)}
      title={`Priority: ${priority}`}
    >
      {icons[priority]}
    </span>
  )
}
