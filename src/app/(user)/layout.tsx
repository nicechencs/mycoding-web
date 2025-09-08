'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AuthGuard>
  )
}
