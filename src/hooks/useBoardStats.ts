import { useMemo } from 'react'
import { isPast, parseISO } from 'date-fns'
import type { Task } from '@/types'

export interface BoardStats {
  total: number
  done: number
  overdue: number
  inProgress: number
}

export function useBoardStats(tasks: Task[]): BoardStats {
  return useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const overdue = tasks.filter(
      (t) => t.due_date && t.status !== 'done' && isPast(parseISO(t.due_date))
    ).length
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length
    return { total, done, overdue, inProgress }
  }, [tasks])
}
