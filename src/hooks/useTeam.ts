import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/types'

interface UseTeamReturn {
  members: TeamMember[]
  loading: boolean
  addMember: (name: string, email?: string) => Promise<TeamMember | null>
  removeMember: (id: string) => Promise<void>
}

export function useTeam(userId: string | null): UseTeamReturn {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_id', userId)
      .order('name')
    setMembers(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const addMember = useCallback(async (name: string, email?: string): Promise<TeamMember | null> => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('team_members')
      .insert({ owner_id: userId, name, email: email ?? null })
      .select()
      .single()
    if (error) throw error
    await load()
    return data as TeamMember
  }, [userId, load])

  const removeMember = useCallback(async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id)
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { members, loading, addMember, removeMember }
}
