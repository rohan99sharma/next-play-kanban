import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  addComment: (body: string) => Promise<void>
}

export function useComments(taskId: string | null, userId: string | null): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    const { data, error: e } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    if (e) setError(e.message)
    else setComments(data ?? [])
    setLoading(false)
  }, [taskId])

  useEffect(() => {
    load()
  }, [load])

  const addComment = useCallback(async (body: string) => {
    if (!taskId || !userId || !body.trim()) return
    const { error: e } = await supabase
      .from('comments')
      .insert({ task_id: taskId, user_id: userId, body: body.trim() })
    if (e) throw e
    await load()
  }, [taskId, userId, load])

  return { comments, loading, error, addComment }
}
