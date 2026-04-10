import { AuthGate } from '@/components/auth/AuthGate'
import { BoardPage } from '@/pages/BoardPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthGate>
        {(userId) => <BoardPage userId={userId} />}
      </AuthGate>
    </div>
  )
}
