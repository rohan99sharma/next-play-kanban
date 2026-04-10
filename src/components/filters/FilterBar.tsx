import { cn } from '@/lib/utils'
import type { Label, TeamMember } from '@/types'
import { TASK_PRIORITIES } from '@/types'
import { PRIORITY_LABELS as PRIORITY_LABEL_MAP } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { LabelChip } from '@/components/labels/LabelChip'
import { Button } from '@/components/ui/Button'
import type { UseSearchReturn } from '@/hooks/useSearch'

interface FilterBarProps {
  search: UseSearchReturn
  labels: Label[]
  teamMembers: TeamMember[]
}

export function FilterBar({ search, labels, teamMembers }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search input */}
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a4 4 0 100 8 4 4 0 000-8zM0 6a6 6 0 1110.89 3.477l4.817 4.816a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 010 6z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          className="h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-48"
        />
      </div>

      {/* Priority filter */}
      <div className="flex items-center gap-1">
        {TASK_PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => search.togglePriority(p)}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium border transition-colors',
              search.priorities.includes(p)
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            {PRIORITY_LABEL_MAP[p]}
          </button>
        ))}
      </div>

      {/* Label filter */}
      {labels.slice(0, 4).map((label) => (
        <button
          key={label.id}
          onClick={() => search.toggleLabel(label.id)}
          className={cn(
            'transition-opacity',
            !search.labelIds.includes(label.id) && 'opacity-50 hover:opacity-75'
          )}
        >
          <LabelChip label={label} />
        </button>
      ))}

      {/* Assignee filter */}
      {teamMembers.map((m) => (
        <button
          key={m.id}
          onClick={() => search.toggleAssignee(m.id)}
          className={cn(
            'transition-opacity',
            !search.assigneeIds.includes(m.id) && 'opacity-50 hover:opacity-75'
          )}
          title={m.name}
        >
          <Avatar name={m.name} size="xs" />
        </button>
      ))}

      {/* Clear */}
      {search.hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={search.clearAll}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
