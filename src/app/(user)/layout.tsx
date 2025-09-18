'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <div className="container py-8">{children}</div>
      </div>
    </AuthGuard>
  )
}
