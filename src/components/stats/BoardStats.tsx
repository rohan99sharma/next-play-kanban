interface BoardStatsProps {
  total: number
  done: number
  overdue: number
  inProgress: number
}

export function BoardStats({ total, done, overdue, inProgress }: BoardStatsProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <span className="font-medium text-gray-700">{total} tasks</span>
      <span className="text-gray-300">·</span>
      <span className="text-emerald-600 font-medium">{done} done</span>
      <span className="text-gray-300">·</span>
      <span className="text-blue-600 font-medium">{inProgress} in progress</span>
      {overdue > 0 && (
        <>
          <span className="text-gray-300">·</span>
          <span className="text-red-600 font-medium">{overdue} overdue</span>
        </>
      )}
    </div>
  )
}
