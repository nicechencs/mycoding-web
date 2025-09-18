'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFeaturedArticles } from '@/hooks/use-articles'
import { Avatar } from '@/components/ui/avatar'
import { ProfilePreviewModal } from '@/components/features/user/profile-preview'
import { ListSkeleton } from '@/components/ui/LoadingSuspense'
import ErrorView from '@/components/ui/ErrorView'

export default function LatestArticlesSection() {
  const { articles, loading, error, mutate } = useFeaturedArticles(3)
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [profileUserId, setProfileUserId] = useState<string | undefined>(
    undefined
  )

  const handleCardClick = (slug: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    router.push(`/posts/${slug}`)
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选文章</h2>
              <p className="text-gray-600 mt-2">最新的文章、推荐和笔记分享</p>
            </div>
            <Link
              href="/posts"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <ListSkeleton
            items={3}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选文章</h2>
              <p className="text-gray-600 mt-2">最新的文章、推荐和笔记分享</p>
            </div>
          </div>
          <ErrorView message="获取精选文章失败，请稍后重试" onRetry={() => mutate()} />
        </div>
      </section>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选文章</h2>
              <p className="text-gray-600 mt-2">最新的文章、推荐和笔记分享</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">暂无精选文章</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">精选文章</h2>
            <p className="text-gray-600 mt-2">最新的文章、推荐和笔记分享</p>
          </div>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={e => handleCardClick(article.slug, e)}
              role="link"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // 构造一个伪事件传递给处理函数
                  handleCardClick(article.slug, (e as unknown) as React.MouseEvent)
                }
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  role="button"
                  aria-label="查看作者资料"
                  onClick={e => {
                    e.stopPropagation()
                    setProfileUserId(article.author.id)
                    setShowProfile(true)
                  }}
                  className="focus:outline-none rounded-full"
                >
                  <Avatar size="sm" theme="secondary">
                    {article.author.name.charAt(0)}
                  </Avatar>
                </div>
                <div>
                  <button
                    className="font-medium text-gray-900 hover:text-blue-600"
                    onClick={e => {
                      e.stopPropagation()
                      setProfileUserId(article.author.id)
                      setShowProfile(true)
                    }}
                  >
                    {article.author.name}
                  </button>
                  <div className="text-xs text-gray-500">
                    {article.createdAt.toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>👀 {article.viewCount}</span>
                  <span>❤️ {article.likeCount}</span>
                  <span>💬 {article.commentCount}</span>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {article.category}
                </span>
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

//
