import type { ActivityLog } from '@/types'
import { ActivityItem } from './ActivityItem'
import { Spinner } from '@/components/ui/Spinner'

interface ActivityFeedProps {
  activity: ActivityLog[]
  loading: boolean
}

export function ActivityFeed({ activity, loading }: ActivityFeedProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</h3>
      {loading ? (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      ) : activity.length === 0 ? (
        <p className="text-xs text-gray-400">No activity yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {activity.map((entry) => <ActivityItem key={entry.id} entry={entry} />)}
        </div>
      )}
    </div>
  )
}
