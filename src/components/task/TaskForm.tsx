import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskFormSchema, type TaskFormValues, type Task, TASK_PRIORITIES } from '@/types'
import { PRIORITY_LABELS } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { LabelPicker } from '@/components/labels/LabelPicker'
import { AssigneePicker } from '@/components/team/AssigneePicker'
import type { Label, TeamMember } from '@/types'

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>
  task?: Task
  labels: Label[]
  teamMembers: TeamMember[]
  onSubmit: (values: TaskFormValues) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function TaskForm({ defaultValues, labels, teamMembers, onSubmit, onCancel, submitLabel = 'Create task' }: TaskFormProps) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      priority: 'normal',
      label_ids: [],
      assignee_ids: [],
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        id="title"
        placeholder="Task title…"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        id="description"
        placeholder="Add a description…"
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            {...register('priority')}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>

        <Input
          label="Due date"
          id="due_date"
          type="date"
          {...register('due_date')}
        />
      </div>

      <Controller
        name="label_ids"
        control={control}
        render={({ field }) => (
          <LabelPicker
            labels={labels}
            selectedIds={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="assignee_ids"
        control={control}
        render={({ field }) => (
          <AssigneePicker
            members={teamMembers}
            selectedIds={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
