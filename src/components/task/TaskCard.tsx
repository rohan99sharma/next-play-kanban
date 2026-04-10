import { Draggable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { PriorityBadge } from './PriorityBadge'
import { DueDateBadge } from './DueDateBadge'
import { LabelChip } from '@/components/labels/LabelChip'
import { AvatarStack } from '@/components/team/AvatarStack'

interface TaskCardProps {
  task: Task
  index: number
  onClick: (task: Task) => void
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const labels = task.labels ?? []
  const assignees = task.assignees ?? []
  const visibleLabels = labels.slice(0, 2)
  const overflowLabels = labels.length - 2

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={cn(
            'group bg-white rounded-xl border border-gray-100 p-3.5 cursor-pointer',
            'shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-150',
            snapshot.isDragging && 'shadow-xl border-violet-200 rotate-1 opacity-95',
          )}
        >
          {/* Labels row */}
          {visibleLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {visibleLabels.map((label) => (
                <LabelChip key={label.id} label={label} />
              ))}
              {overflowLabels > 0 && (
                <span className="text-xs text-gray-400">+{overflowLabels}</span>
              )}
            </div>
          )}

          {/* Title */}
          <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-violet-700 transition-colors line-clamp-2">
            {task.title}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <DueDateBadge dueDate={task.due_date} status={task.status} />
            </div>
            <div className="flex items-center gap-2">
              {(task.comment_count ?? 0) > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H9l-3 3v-3H3a1 1 0 01-1-1V3z" />
                  </svg>
                  {task.comment_count}
                </span>
              )}
              <AvatarStack members={assignees} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
