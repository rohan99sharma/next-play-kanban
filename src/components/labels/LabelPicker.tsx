import { useState } from 'react'
import type { Label } from '@/types'
import { LabelChip } from './LabelChip'

interface LabelPickerProps {
  labels: Label[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function LabelPicker({ labels, selectedIds, onChange }: LabelPickerProps) {
  const [open, setOpen] = useState(false)

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id])
  }

  const selected = labels.filter((l) => selectedIds.includes(l.id))

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Labels</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full min-h-9 text-left rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 flex flex-wrap gap-1 items-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {selected.length === 0 ? 'Select labels…' : selected.map((l) => (
            <LabelChip key={l.id} label={l} onRemove={() => toggle(l.id)} />
          ))}
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-40 overflow-y-auto">
            {labels.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-400">No labels yet. Create them from Settings.</p>
            )}
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggle(label.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-sm"
              >
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="flex-1 text-left text-gray-700">{label.name}</span>
                {selectedIds.includes(label.id) && (
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
