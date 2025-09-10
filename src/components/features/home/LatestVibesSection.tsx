'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLatestVibes } from '@/hooks/use-vibes'
import { Avatar } from '@/components/ui/avatar'
import { ListSkeleton } from '@/components/ui/LoadingSuspense'

export default function LatestVibesSection() {
  const { vibes, loading, error } = useLatestVibes(3)
  const router = useRouter()

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
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">获取最新动态失败，请稍后重试</p>
          </div>
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
            >
              <div className="flex items-start space-x-3">
                <Avatar size="md" theme="primary">
                  {vibe.author.name.charAt(0)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {vibe.author.name}
                    </span>
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
      </div>
    </section>
  )
}
