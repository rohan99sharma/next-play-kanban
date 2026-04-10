import { Droppable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'
import { TaskCard } from '@/components/task/TaskCard'
import { ColumnHeader } from './ColumnHeader'
import { EmptyState } from '@/components/ui/EmptyState'

interface ColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onTaskClick: (task: Task) => void
}

export function Column({ status, tasks, onAddTask, onTaskClick }: ColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] w-72 shrink-0">
      <ColumnHeader
        status={status}
        count={tasks.length}
        onAdd={() => onAddTask(status)}
      />

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 flex flex-col gap-2 rounded-xl p-2 min-h-[200px] transition-colors duration-150',
              snapshot.isDraggingOver ? 'bg-violet-50' : 'bg-gray-50/60',
            )}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <EmptyState
                title="No tasks"
                description="Drop a task here or click + to add one"
              />
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
