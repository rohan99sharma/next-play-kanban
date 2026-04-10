import { useState } from 'react'
import { BoardStats } from '@/components/stats/BoardStats'
import { FilterBar } from '@/components/filters/FilterBar'
import { Modal } from '@/components/ui/Modal'
import { TeamManager } from '@/components/team/TeamManager'
import { LabelManager } from '@/components/labels/LabelManager'
import { Button } from '@/components/ui/Button'
import type { Label, TeamMember } from '@/types'
import type { UseSearchReturn } from '@/hooks/useSearch'
import type { BoardStats as Stats } from '@/hooks/useBoardStats'

interface HeaderProps {
  stats: Stats
  search: UseSearchReturn
  labels: Label[]
  teamMembers: TeamMember[]
  onCreateLabel: (name: string, color: string) => Promise<Label | null>
  onDeleteLabel: (id: string) => Promise<void>
  onAddMember: (name: string, email?: string) => Promise<TeamMember | null>
  onRemoveMember: (id: string) => Promise<void>
}

export function Header({ stats, search, labels, teamMembers, onCreateLabel, onDeleteLabel, onAddMember, onRemoveMember }: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="5" height="12" rx="1" />
              <rect x="9" y="2" width="5" height="7" rx="1" />
              <rect x="9" y="11" width="5" height="3" rx="1" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Next Play Board</h1>
            <BoardStats {...stats} />
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSettingsOpen(true)}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1112 0A6 6 0 012 8z" clipRule="evenodd" />
            <path d="M8 6a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Settings
        </Button>
      </div>

      <div className="px-6 pb-3">
        <FilterBar search={search} labels={labels} teamMembers={teamMembers} />
      </div>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Board Settings"
        className="max-w-md"
      >
        <div className="flex flex-col gap-6">
          <LabelManager labels={labels} onCreate={onCreateLabel} onDelete={onDeleteLabel} />
          <TeamManager members={teamMembers} onAdd={onAddMember} onRemove={onRemoveMember} />
        </div>
      </Modal>
    </div>
  )
}
