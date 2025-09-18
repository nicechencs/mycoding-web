'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: 'user' | 'admin'
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  fallback,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // 需要认证但未登录
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // 需要特定角色但角色不匹配
      if (requireRole && user?.role !== requireRole) {
        router.push('/settings')
        return
      }

      // 已登录但访问登录页面
      if (
        !requireAuth &&
        isAuthenticated &&
        typeof window !== 'undefined' &&
        window.location.pathname === '/login'
      ) {
        router.push('/settings')
        return
      }
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requireAuth,
    requireRole,
    router,
    redirectTo,
  ])

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 需要认证但未登录
  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  // 需要特定角色但角色不匹配
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">访问受限</h1>
          <p className="text-gray-600">您没有权限访问此页面</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
