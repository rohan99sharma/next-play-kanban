import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  avatarUrl?: string | null
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const sizes = { xs: 'h-5 w-5 text-[10px]', sm: 'h-6 w-6 text-xs', md: 'h-8 w-8 text-sm' }

const COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-teal-500',
]

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function Avatar({ name, avatarUrl, size = 'sm', className }: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white',
        getColor(name),
        sizes[size],
        className,
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
