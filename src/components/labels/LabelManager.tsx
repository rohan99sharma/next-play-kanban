import { useState } from 'react'
import type { Label } from '@/types'
import { LabelChip } from './LabelChip'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
]

interface LabelManagerProps {
  labels: Label[]
  onCreate: (name: string, color: string) => Promise<Label | null>
  onDelete: (id: string) => Promise<void>
}

export function LabelManager({ labels, onCreate, onDelete }: LabelManagerProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [adding, setAdding] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    try {
      await onCreate(name.trim(), color)
      setName('')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Labels</h3>
        {labels.length === 0 ? (
          <p className="text-xs text-gray-400">No labels yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {labels.map((l) => (
              <div key={l.id} className="flex items-center gap-1">
                <LabelChip label={l} />
                <button
                  onClick={() => onDelete(l.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors ml-0.5"
                  aria-label={`Delete ${l.name}`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleCreate} className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500">Create label</p>
        <Input
          placeholder="Label name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Color:</span>
          <div className="flex gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? 'white' : 'transparent',
                  outline: color === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '1px',
                }}
              />
            ))}
          </div>
        </div>
        <Button type="submit" size="sm" loading={adding} disabled={!name.trim()}>
          Create
        </Button>
      </form>
    </div>
  )
}
