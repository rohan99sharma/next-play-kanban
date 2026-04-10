import { useState } from 'react'
import type { TeamMember } from '@/types'
import { Avatar } from '@/components/ui/Avatar'

interface AssigneePickerProps {
  members: TeamMember[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function AssigneePicker({ members, selectedIds, onChange }: AssigneePickerProps) {
  const [open, setOpen] = useState(false)

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id])
  }

  const selected = members.filter((m) => selectedIds.includes(m.id))

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Assignees</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full min-h-9 text-left rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 flex items-center gap-1.5 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {selected.length === 0 ? 'Assign to…' : (
            <div className="flex -space-x-1.5">
              {selected.map((m) => <Avatar key={m.id} name={m.name} size="xs" />)}
              <span className="ml-2 text-gray-700 text-sm">{selected.map((m) => m.name).join(', ')}</span>
            </div>
          )}
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-40 overflow-y-auto">
            {members.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-400">No team members yet. Add them from Settings.</p>
            )}
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => toggle(member.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-sm"
              >
                <Avatar name={member.name} size="xs" />
                <span className="flex-1 text-left text-gray-700">{member.name}</span>
                {selectedIds.includes(member.id) && (
                  <svg className="h-4 w-4 text-violet-500" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M13.707 4.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L6 10.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
            <button
              type="button"
              className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 border-t border-gray-100 mt-1"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
