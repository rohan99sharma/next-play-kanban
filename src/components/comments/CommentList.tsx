import type { Comment } from '@/types'
import { CommentItem } from './CommentItem'
import { CommentInput } from './CommentInput'
import { Spinner } from '@/components/ui/Spinner'

interface CommentListProps {
  comments: Comment[]
  loading: boolean
  onAdd: (body: string) => Promise<void>
}

export function CommentList({ comments, loading, onAdd }: CommentListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading ? (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}

      <CommentInput onSubmit={onAdd} />
    </div>
  )
}
