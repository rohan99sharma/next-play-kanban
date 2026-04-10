import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import type { TaskFormValues, TaskStatus, Label, TeamMember } from '@/types'
import { STATUS_LABELS } from '@/lib/utils'

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  defaultStatus: TaskStatus
  labels: Label[]
  teamMembers: TeamMember[]
  onSubmit: (values: TaskFormValues & { status: TaskStatus }) => Promise<void>
}

export function CreateTaskModal({ open, onClose, defaultStatus, labels, teamMembers, onSubmit }: CreateTaskModalProps) {
  const handleSubmit = async (values: TaskFormValues) => {
    await onSubmit({ ...values, status: defaultStatus })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`New task — ${STATUS_LABELS[defaultStatus]}`}
    >
      <TaskForm
        labels={labels}
        teamMembers={teamMembers}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Create task"
      />
    </Modal>
  )
}
