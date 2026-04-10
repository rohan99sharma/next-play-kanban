import { z } from 'zod'

export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done'] as const
export const TASK_PRIORITIES = ['low', 'normal', 'high'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type Priority = (typeof TASK_PRIORITIES)[number]

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(TASK_PRIORITIES),
  due_date: z.string().optional(),
  label_ids: z.array(z.string()),
  assignee_ids: z.array(z.string()),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
  labels?: Label[]
  assignees?: TeamMember[]
  comment_count?: number
}

export interface Label {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface TeamMember {
  id: string
  owner_id: string
  name: string
  avatar_url: string | null
  email: string | null
  created_at: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  body: string
  created_at: string
}

export interface ActivityLog {
  id: string
  task_id: string
  user_id: string
  event_type: 'created' | 'status_changed' | 'priority_changed' | 'assigned' | 'due_date_set' | 'label_added'
  from_value: string | null
  to_value: string | null
  created_at: string
}

export type BoardColumns = Record<TaskStatus, Task[]>
