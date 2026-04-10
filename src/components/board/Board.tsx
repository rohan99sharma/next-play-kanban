import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import type { Task, TaskStatus, Label, TeamMember, TaskFormValues } from '@/types'
import { TASK_STATUSES } from '@/types'
import { Column } from './Column'
import { CreateTaskModal } from '@/components/task/CreateTaskModal'
import { TaskDetailPanel } from '@/components/task/TaskDetailPanel'
import type { UseTasksReturn } from '@/hooks/useTasks'
import { useBoard } from '@/hooks/useBoard'
import type { FilterState } from '@/hooks/useBoard'

interface BoardProps {
  userId: string
  tasks: UseTasksReturn
  labels: Label[]
  teamMembers: TeamMember[]
  filters: FilterState
}

export function Board({ userId, tasks, labels, teamMembers, filters }: BoardProps) {
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { columns, onDragEnd } = useBoard(
    { tasks: tasks.tasks, moveTask: tasks.moveTask },
    filters
  )

  const handleCreate = async (values: TaskFormValues & { status: TaskStatus }) => {
    await tasks.createTask({
      title: values.title,
      description: values.description,
      priority: values.priority,
      due_date: values.due_date || undefined,
      status: values.status,
      label_ids: values.label_ids,
      assignee_ids: values.assignee_ids,
    })
  }

  const handleUpdate = async (id: string, values: TaskFormValues) => {
    await tasks.updateTask(id, {
      title: values.title,
      description: values.description ?? null,
      priority: values.priority,
      due_date: values.due_date ?? null,
      label_ids: values.label_ids,
      assignee_ids: values.assignee_ids,
    })
    const updated = tasks.tasks.find((t) => t.id === id)
    if (updated) setSelectedTask(updated)
  }

  const handleDelete = async (id: string) => {
    await tasks.deleteTask(id)
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 px-6 pt-2 flex-1">
          {TASK_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={columns[status] ?? []}
              onAddTask={setCreateStatus}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
      </DragDropContext>

      {createStatus && (
        <CreateTaskModal
          open={true}
          onClose={() => setCreateStatus(null)}
          defaultStatus={createStatus}
          labels={labels}
          teamMembers={teamMembers}
          onSubmit={handleCreate}
        />
      )}

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          userId={userId}
          labels={labels}
          teamMembers={teamMembers}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
