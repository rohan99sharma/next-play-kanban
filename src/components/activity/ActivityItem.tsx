import { formatDistanceToNow, parseISO } from 'date-fns'
import type { ActivityLog } from '@/types'
import { STATUS_LABELS, PRIORITY_LABELS } from '@/lib/utils'
import type { TaskStatus, Priority } from '@/types'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  entry: ActivityLog
}

function describeEvent(entry: ActivityLog): string {
  switch (entry.event_type) {
    case 'created':
      return `Task created in ${STATUS_LABELS[entry.to_value as TaskStatus] ?? entry.to_value}`
    case 'status_changed':
      return `Moved from ${STATUS_LABELS[entry.from_value as TaskStatus] ?? entry.from_value} to ${STATUS_LABELS[entry.to_value as TaskStatus] ?? entry.to_value}`
    case 'priority_changed':
      return `Priority changed from ${PRIORITY_LABELS[entry.from_value as Priority] ?? entry.from_value} to ${PRIORITY_LABELS[entry.to_value as Priority] ?? entry.to_value}`
    case 'assigned':
      return `Assigned to ${entry.to_value}`
    case 'due_date_set':
      return entry.to_value ? `Due date set to ${entry.to_value}` : 'Due date removed'
    case 'label_added':
      return `Label "${entry.to_value}" added`
    default:
      return entry.event_type
  }
}

const iconByType: Record<string, React.ReactNode> = {
  created: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z" />
    </svg>
  ),
  status_changed: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 2a4 4 0 110 8A4 4 0 018 4z" clipRule="evenodd" />
    </svg>
  ),
  default: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="3" />
    </svg>
  ),
}

export function ActivityItem({ entry }: ActivityItemProps) {
  const icon = iconByType[entry.event_type] ?? iconByType.default

  return (
    <div className="flex gap-3 items-start">
      <div className={cn(
        'h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        entry.event_type === 'created' ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs text-gray-600">{describeEvent(entry)}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDistanceToNow(parseISO(entry.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
