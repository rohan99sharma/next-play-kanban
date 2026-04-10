import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface CommentInputProps {
  onSubmit: (body: string) => Promise<void>
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    try {
      await onSubmit(value.trim())
      setValue('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a comment…"
        rows={2}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading} disabled={!value.trim()}>
          Comment
        </Button>
      </div>
    </form>
  )
}
