import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, Priority } from '@/types'

export interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  createTask: (data: CreateTaskData) => Promise<Task | null>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: TaskStatus, newPosition: number) => Promise<void>
  refetch: () => Promise<void>
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: Priority
  due_date?: string
  status: TaskStatus
  label_ids?: string[]
  assignee_ids?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string | null
  priority?: Priority
  due_date?: string | null
  status?: TaskStatus
  label_ids?: string[]
  assignee_ids?: string[]
}

async function fetchTasksWithRelations(userId: string): Promise<Task[]> {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      task_labels(label_id, labels(*)),
      task_assignments(team_member_id, team_members(*)),
      comments(count)
    `)
    .eq('user_id', userId)
    .order('position', { ascending: true })

  if (error) throw error

  return (tasks ?? []).map((t) => ({
    ...t,
    labels: t.task_labels?.map((tl: { labels: unknown }) => tl.labels).filter(Boolean) ?? [],
    assignees: t.task_assignments?.map((ta: { team_members: unknown }) => ta.team_members).filter(Boolean) ?? [],
    comment_count: t.comments?.[0]?.count ?? 0,
  }))
}

export function useTasks(userId: string | null): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    try {
      setError(null)
      const data = await fetchTasksWithRelations(userId)
      setTasks(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    load()

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      }, () => { load() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, load])

  const createTask = useCallback(async (data: CreateTaskData): Promise<Task | null> => {
    if (!userId) return null

    const colTasks = tasks.filter((t) => t.status === data.status)
    const maxPos = colTasks.length > 0 ? Math.max(...colTasks.map((t) => t.position)) : 0
    const position = maxPos + 1000

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({ ...data, user_id: userId, position, label_ids: undefined, assignee_ids: undefined })
      .select()
      .single()

    if (taskError) throw taskError

    if (data.label_ids && data.label_ids.length > 0) {
      await supabase.from('task_labels').insert(
        data.label_ids.map((lid) => ({ task_id: task.id, label_id: lid }))
      )
    }

    if (data.assignee_ids && data.assignee_ids.length > 0) {
      await supabase.from('task_assignments').insert(
        data.assignee_ids.map((mid) => ({ task_id: task.id, team_member_id: mid }))
      )
    }

    await supabase.from('activity_log').insert({
      task_id: task.id,
      user_id: userId,
      event_type: 'created',
      from_value: null,
      to_value: task.status,
    })

    await load()
    return task as Task
  }, [userId, tasks, load])

  const updateTask = useCallback(async (id: string, data: UpdateTaskData): Promise<void> => {
    if (!userId) return

    const { label_ids, assignee_ids, ...taskData } = data

    if (Object.keys(taskData).length > 0) {
      const { error: updateError } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .eq('user_id', userId)
      if (updateError) throw updateError
    }

    if (label_ids !== undefined) {
      await supabase.from('task_labels').delete().eq('task_id', id)
      if (label_ids.length > 0) {
        await supabase.from('task_labels').insert(
          label_ids.map((lid) => ({ task_id: id, label_id: lid }))
        )
      }
    }

    if (assignee_ids !== undefined) {
      await supabase.from('task_assignments').delete().eq('task_id', id)
      if (assignee_ids.length > 0) {
        await supabase.from('task_assignments').insert(
          assignee_ids.map((mid) => ({ task_id: id, team_member_id: mid }))
        )
      }
    }

    await load()
  }, [userId, load])

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    if (!userId) return
    const { error: delError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (delError) throw delError
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [userId])

  const moveTask = useCallback(async (id: string, newStatus: TaskStatus, newPosition: number): Promise<void> => {
    if (!userId) return

    const prev = tasks
    setTasks((current) =>
      current.map((t) =>
        t.id === id ? { ...t, status: newStatus, position: newPosition } : t
      )
    )

    try {
      await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', id)
        .eq('user_id', userId)

      const task = tasks.find((t) => t.id === id)
      if (task && task.status !== newStatus) {
        await supabase.from('activity_log').insert({
          task_id: id,
          user_id: userId,
          event_type: 'status_changed',
          from_value: task.status,
          to_value: newStatus,
        })
      }
    } catch (e) {
      setTasks(prev)
      throw e
    }
  }, [userId, tasks])

  return { tasks, loading, error, createTask, updateTask, deleteTask, moveTask, refetch: load }
}
