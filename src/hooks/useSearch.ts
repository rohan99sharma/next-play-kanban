import { useState, useCallback } from 'react'
import type { FilterState } from './useBoard'

export interface UseSearchReturn extends FilterState {
  setQuery: (q: string) => void
  togglePriority: (p: string) => void
  toggleAssignee: (id: string) => void
  toggleLabel: (id: string) => void
  clearAll: () => void
  hasActiveFilters: boolean
}

const INITIAL: FilterState = {
  query: '',
  priorities: [],
  assigneeIds: [],
  labelIds: [],
}

export function useSearch(): UseSearchReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL)

  const setQuery = useCallback((q: string) => setFilters((f) => ({ ...f, query: q })), [])

  const toggle = <K extends keyof FilterState>(key: K, value: string) => {
    setFilters((f) => {
      const arr = f[key] as string[]
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const togglePriority = useCallback((p: string) => toggle('priorities', p), [])
  const toggleAssignee = useCallback((id: string) => toggle('assigneeIds', id), [])
  const toggleLabel = useCallback((id: string) => toggle('labelIds', id), [])
  const clearAll = useCallback(() => setFilters(INITIAL), [])

  const hasActiveFilters =
    filters.query !== '' ||
    filters.priorities.length > 0 ||
    filters.assigneeIds.length > 0 ||
    filters.labelIds.length > 0

  return { ...filters, setQuery, togglePriority, toggleAssignee, toggleLabel, clearAll, hasActiveFilters }
}
