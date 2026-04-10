import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ActivityLog } from '@/types'

interface UseActivityReturn {
  activity: ActivityLog[]
  loading: boolean
}

export function useActivity(taskId: string | null): UseActivityReturn {
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    setActivity(data ?? [])
    setLoading(false)
  }, [taskId])

  useEffect(() => { load() }, [load])

  return { activity, loading }
}
