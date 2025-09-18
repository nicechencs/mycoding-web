'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { UserNavigation } from '@/components/features/user/user-navigation'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <UserNavigation />
        <div className="container py-8">{children}</div>
      </div>
    </AuthGuard>
  )
}
