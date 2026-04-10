import { useState } from 'react'
import type { TeamMember } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface TeamManagerProps {
  members: TeamMember[]
  onAdd: (name: string, email?: string) => Promise<TeamMember | null>
  onRemove: (id: string) => Promise<void>
}

export function TeamManager({ members, onAdd, onRemove }: TeamManagerProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    try {
      await onAdd(name.trim(), email.trim() || undefined)
      setName('')
      setEmail('')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Team Members</h3>
        {members.length === 0 ? (
          <p className="text-xs text-gray-400">No team members yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-1">
                <Avatar name={m.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{m.name}</p>
                  {m.email && <p className="text-xs text-gray-400">{m.email}</p>}
                </div>
                <button
                  onClick={() => onRemove(m.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${m.name}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500">Add member</p>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" size="sm" loading={adding} disabled={!name.trim()}>
          Add
        </Button>
      </form>
    </div>
  )
}
