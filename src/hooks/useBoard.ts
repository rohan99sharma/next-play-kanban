import { useMemo } from 'react'
import type { DropResult } from '@hello-pangea/dnd'
import type { BoardColumns, Task, TaskStatus } from '@/types'
import { TASK_STATUSES } from '@/types'
import type { UseTasksReturn } from './useTasks'

export interface FilterState {
  query: string
  priorities: string[]
  assigneeIds: string[]
  labelIds: string[]
}

interface UseBoardReturn {
  columns: BoardColumns
  onDragEnd: (result: DropResult) => void
}

function applyFilters(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter((task) => {
    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (!task.title.toLowerCase().includes(q) &&
          !(task.description ?? '').toLowerCase().includes(q)) {
        return false
      }
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false
    if (filters.assigneeIds.length > 0) {
      const ids = task.assignees?.map((a) => a.id) ?? []
      if (!filters.assigneeIds.some((id) => ids.includes(id))) return false
    }
    if (filters.labelIds.length > 0) {
      const ids = task.labels?.map((l) => l.id) ?? []
      if (!filters.labelIds.some((id) => ids.includes(id))) return false
    }
    return true
  })
}

export function useBoard(
  { tasks, moveTask }: Pick<UseTasksReturn, 'tasks' | 'moveTask'>,
  filters: FilterState,
): UseBoardReturn {
  const columns = useMemo<BoardColumns>(() => {
    const filtered = applyFilters(tasks, filters)
    const cols = {} as BoardColumns
    for (const status of TASK_STATUSES) {
      cols[status] = filtered
        .filter((t) => t.status === status)
        .sort((a, b) => a.position - b.position)
    }
    return cols
  }, [tasks, filters])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as TaskStatus
    const destTasks = columns[newStatus]

    const before = destTasks[destination.index - 1]
    const after = destTasks[destination.index]

    let newPosition: number
    if (!before && !after) {
      newPosition = 1000
    } else if (!before) {
      newPosition = (after?.position ?? 1000) / 2
    } else if (!after) {
      newPosition = (before?.position ?? 0) + 1000
    } else {
      newPosition = (before.position + after.position) / 2
    }

    moveTask(draggableId, newStatus, newPosition)
  }

  return { columns, onDragEnd }
}
