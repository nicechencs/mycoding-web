'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-users'

export function ProfilePreviewModal({
  isOpen,
  onClose,
  userId,
  name,
  avatar,
  email,
}: {
  isOpen: boolean
  onClose: () => void
  userId?: string
  name?: string
  avatar?: string
  email?: string
}) {
  // 根据 userId 获取指定用户资料；未提供时不发起请求，仅展示传入信息
  const profile = useUserProfile(userId || '', { suspense: false })

  const joinedAt = useMemo(() => {
    const createdAt = (profile?.user as any)?.createdAt
    if (!createdAt) return ''
    try {
      const d = new Date(createdAt)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`
    } catch {
      return ''
    }
  }, [profile?.user])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg mx-4">
        <BaseCard>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {profile?.user?.avatar || avatar ? (
                <img
                  src={(profile?.user?.avatar as any) || (avatar as any)}
                  alt={(profile?.user?.name as any) || name || '用户头像'}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-blue-600">
                  {((profile?.user?.name as any) || name || '?')
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {(profile?.user?.name as any) || name || '用户'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="关闭"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {(profile?.user?.email || email) && (
                <p className="text-sm text-gray-600 break-all">
                  {(profile?.user?.email as any) || email}
                </p>
              )}
              {joinedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  加入时间：{joinedAt}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              {
                label: '文章',
                value: (profile as any)?.stats?.articlesCount ?? '—',
              },
              {
                label: '资源',
                value: (profile as any)?.stats?.resourcesCount ?? '—',
              },
              {
                label: '动态',
                value: (profile as any)?.stats?.vibesCount ?? '—',
              },
              {
                label: '获赞',
                value: (profile as any)?.stats?.totalLikes ?? '—',
              },
              {
                label: '粉丝',
                value: (profile as any)?.stats?.followersCount ?? '—',
              },
              {
                label: '关注',
                value: (profile as any)?.stats?.followingCount ?? '—',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {(profile as any)?.loading ? '—' : item.value}
                </div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
            {/* 当未指定userId（视为当前用户）时，展示访问个人中心按钮 */}
            {!userId && (
              <Button asChild>
                <Link href="/settings">访问个人中心</Link>
              </Button>
            )}
          </div>
        </BaseCard>
      </div>
    </div>
  )
}
