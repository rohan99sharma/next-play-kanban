import { Avatar } from '@/components/ui/Avatar'
import type { TeamMember } from '@/types'

interface AvatarStackProps {
  members: TeamMember[]
  max?: number
}

export function AvatarStack({ members, max = 3 }: AvatarStackProps) {
  if (members.length === 0) return null
  const visible = members.slice(0, max)
  const overflow = members.length - max

  return (
    <div className="flex -space-x-1.5">
      {visible.map((m) => (
        <Avatar key={m.id} name={m.name} avatarUrl={m.avatar_url} size="xs" />
      ))}
      {overflow > 0 && (
        <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white text-[10px] font-semibold text-gray-600">
          +{overflow}
        </div>
      )}
    </div>
  )
}
