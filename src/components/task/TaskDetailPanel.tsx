import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Task, TaskFormValues, Label, TeamMember } from '@/types'
import { TaskForm } from './TaskForm'
import { CommentList } from '@/components/comments/CommentList'
import { ActivityFeed } from '@/components/activity/ActivityFeed'
import { useComments } from '@/hooks/useComments'
import { useActivity } from '@/hooks/useActivity'
import { DueDateBadge } from './DueDateBadge'
import { PriorityBadge } from './PriorityBadge'
import { STATUS_LABELS } from '@/lib/utils'

interface TaskDetailPanelProps {
  task: Task | null
  userId: string
  labels: Label[]
  teamMembers: TeamMember[]
  onClose: () => void
  onUpdate: (id: string, values: TaskFormValues) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

type PanelTab = 'edit' | 'comments' | 'activity'

export function TaskDetailPanel({ task, userId, labels, teamMembers, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
  const [tab, setTab] = useState<PanelTab>('edit')
  const [deleting, setDeleting] = useState(false)
  const { comments, loading: commentsLoading, addComment } = useComments(task?.id ?? null, userId)
  const { activity, loading: activityLoading } = useActivity(task?.id ?? null)

  if (!task) return null

  const handleUpdate = async (values: TaskFormValues) => {
    await onUpdate(task.id, values)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return
    setDeleting(true)
    try {
      await onDelete(task.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  const TABS: { id: PanelTab; label: string }[] = [
    { id: 'edit', label: 'Details' },
    { id: 'comments', label: `Comments${comments.length > 0 ? ` (${comments.length})` : ''}` },
    { id: 'activity', label: 'Activity' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg z-40 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 font-medium">{STATUS_LABELS[task.status]}</span>
              <PriorityBadge priority={task.priority} />
              <DueDateBadge dueDate={task.due_date} status={task.status} />
            </div>
            <h2 className="text-base font-semibold text-gray-900 line-clamp-2">{task.title}</h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a1 1 0 00-1 1v1H2a1 1 0 000 2h1v7a1 1 0 001 1h6a1 1 0 001-1V7h1a1 1 0 100-2h-2V4a1 1 0 00-1-1H5zm1 2h4v1H6V5zm-1 3h6v6H5V8z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close panel"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'px-1 py-3 mr-5 text-sm font-medium border-b-2 transition-colors -mb-px',
                tab === id
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'edit' && (
            <TaskForm
              task={task}
              defaultValues={{
                title: task.title,
                description: task.description ?? '',
                priority: task.priority,
                due_date: task.due_date ?? '',
                label_ids: task.labels?.map((l) => l.id) ?? [],
                assignee_ids: task.assignees?.map((a) => a.id) ?? [],
              }}
              labels={labels}
              teamMembers={teamMembers}
              onSubmit={handleUpdate}
              submitLabel="Save changes"
            />
          )}
          {tab === 'comments' && (
            <CommentList
              comments={comments}
              loading={commentsLoading}
              onAdd={addComment}
            />
          )}
          {tab === 'activity' && (
            <ActivityFeed activity={activity} loading={activityLoading} />
          )}
        </div>
      </div>
    </>
  )
}
