import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/Button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">driz</h1>
      <p className="text-gray-500">TanStack Start + better-auth + Prisma</p>

      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
