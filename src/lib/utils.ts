import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isPast, differenceInDays, parseISO } from 'date-fns'
import type { Priority, TaskStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return format(parseISO(dateStr), 'MMM d')
}

export type DueDateState = 'overdue' | 'due-soon' | 'ok'

export function getDueDateState(
  dueDateStr: string | null,
  status: TaskStatus,
): DueDateState | null {
  if (!dueDateStr || status === 'done') return null
  const date = parseISO(dueDateStr)
  if (isPast(date)) return 'overdue'
  if (differenceInDays(date, new Date()) <= 2) return 'due-soon'
  return 'ok'
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
