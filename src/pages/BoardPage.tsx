import { Toaster } from 'sonner'
import { useTasks } from '@/hooks/useTasks'
import { useLabels } from '@/hooks/useLabels'
import { useTeam } from '@/hooks/useTeam'
import { useSearch } from '@/hooks/useSearch'
import { useBoardStats } from '@/hooks/useBoardStats'
import { Board } from '@/components/board/Board'
import { BoardSkeleton } from '@/components/board/BoardSkeleton'
import { Header } from '@/components/layout/Header'

interface BoardPageProps {
  userId: string
}

export function BoardPage({ userId }: BoardPageProps) {
  const tasks = useTasks(userId)
  const { labels, createLabel, deleteLabel } = useLabels(userId)
  const { members, addMember, removeMember } = useTeam(userId)
  const search = useSearch()
  const stats = useBoardStats(tasks.tasks)

  if (tasks.loading) return <BoardSkeleton />

  if (tasks.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">Failed to load tasks</p>
          <p className="text-xs text-gray-500">{tasks.error}</p>
          <button
            onClick={tasks.refetch}
            className="mt-4 text-xs text-violet-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
        stats={stats}
        search={search}
        labels={labels}
        teamMembers={members}
        onCreateLabel={createLabel}
        onDeleteLabel={deleteLabel}
        onAddMember={addMember}
        onRemoveMember={removeMember}
      />
      <Board
        userId={userId}
        tasks={tasks}
        labels={labels}
        teamMembers={members}
        filters={search}
      />
      <Toaster position="bottom-right" />
    </>
  )
}
