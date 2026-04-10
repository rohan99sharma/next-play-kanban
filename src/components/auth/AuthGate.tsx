import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'

interface AuthGateProps {
  children: (userId: string) => React.ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Setting up your board…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-red-500">Authentication failed. Please refresh the page.</p>
      </div>
    )
  }

  return <>{children(user.id)}</>
}
