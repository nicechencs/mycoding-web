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
      <div>
        <UserNavigation />
        <div className="container py-8">{children}</div>
      </div>
    </AuthGuard>
  )
}
