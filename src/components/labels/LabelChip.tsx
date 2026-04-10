import { cn } from '@/lib/utils'
import type { Label } from '@/types'

interface LabelChipProps {
  label: Label
  onRemove?: () => void
  className?: string
}

export function LabelChip({ label, onRemove, className }: LabelChipProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white', className)}
      style={{ backgroundColor: label.color }}
    >
      {label.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${label.name}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
