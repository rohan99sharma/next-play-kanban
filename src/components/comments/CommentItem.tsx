import { formatDistanceToNow, parseISO } from 'date-fns'
import type { Comment } from '@/types'
import { Avatar } from '@/components/ui/Avatar'

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3">
      <Avatar name="You" size="sm" className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-700">You</span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.body}</p>
      </div>
    </div>
  )
}
