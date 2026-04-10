import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Label } from '@/types'

interface UseLabelsReturn {
  labels: Label[]
  loading: boolean
  createLabel: (name: string, color: string) => Promise<Label | null>
  deleteLabel: (id: string) => Promise<void>
}

export function useLabels(userId: string | null): UseLabelsReturn {
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    setLabels(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const createLabel = useCallback(async (name: string, color: string): Promise<Label | null> => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('labels')
      .insert({ user_id: userId, name, color })
      .select()
      .single()
    if (error) throw error
    await load()
    return data as Label
  }, [userId, load])

  const deleteLabel = useCallback(async (id: string) => {
    await supabase.from('labels').delete().eq('id', id)
    setLabels((prev) => prev.filter((l) => l.id !== id))
  }, [])

  return { labels, loading, createLabel, deleteLabel }
}
