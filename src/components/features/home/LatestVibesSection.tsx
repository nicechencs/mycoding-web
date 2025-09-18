'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLatestVibes } from '@/hooks/use-vibes'
import { Avatar } from '@/components/ui/avatar'
import { ProfilePreviewModal } from '@/components/features/user/profile-preview'
import { ListSkeleton } from '@/components/ui/LoadingSuspense'
import ErrorView from '@/components/ui/ErrorView'

export default function LatestVibesSection() {
  const { vibes, loading, error, mutate } = useLatestVibes(3)
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [profileUserId, setProfileUserId] = useState<string | undefined>(
    undefined
  )

  const handleCardClick = (vibeId: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    router.push(`/vibes/${vibeId}`)
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
              <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
            </div>
            <Link
              href="/vibes"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <div className="space-y-6">
            <ListSkeleton items={3} className="space-y-6" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
              <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
            </div>
          </div>
          <ErrorView message="获取最新动态失败，请稍后重试" onRetry={() => mutate()} />
        </div>
      </section>
    )
  }

  if (!vibes || vibes.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
              <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">暂无最新动态</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
            <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
          </div>
          <Link
            href="/vibes"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="space-y-6">
          {vibes.map(vibe => (
            <div
              key={vibe.id}
              className="rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer bg-white"
              onClick={e => handleCardClick(vibe.id, e)}
              role="link"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCardClick(vibe.id, (e as unknown) as React.MouseEvent)
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  role="button"
                  aria-label="查看作者资料"
                  onClick={e => {
                    e.stopPropagation()
                    setProfileUserId(vibe.author.id)
                    setShowProfile(true)
                  }}
                  className="focus:outline-none rounded-full"
                >
                  <Avatar size="md" theme="primary">
                    {vibe.author.name.charAt(0)}
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      className="font-medium text-gray-900 hover:text-blue-600"
                      onClick={e => {
                        e.stopPropagation()
                        setProfileUserId(vibe.author.id)
                        setShowProfile(true)
                      }}
                    >
                      {vibe.author.name}
                    </button>
                    <span className="text-sm text-gray-500">
                      {vibe.createdAt.toLocaleDateString('zh-CN')}{' '}
                      {vibe.createdAt.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{vibe.content}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <button
                      className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${vibe.isLiked ? 'text-red-500' : ''}`}
                    >
                      <span>❤️</span>
                      <span>{vibe.likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <span>💬</span>
                      <span>{vibe.commentCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <span>🔄</span>
                      <span>{vibe.shareCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 个人资料预览 */}
        <ProfilePreviewModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userId={profileUserId}
        />
      </div>
    </section>
  )
}
