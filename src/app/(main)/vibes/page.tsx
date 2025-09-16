'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLatestVibes } from '@/hooks/use-vibes'
import { VibeCard } from '@/components/features/vibes/vibe-card'
import { VibeComposer } from '@/components/features/vibes/vibe-composer'
import { Avatar, FloatingAvatar } from '@/components/ui/avatar'
import { QuickFilterBar } from '@/components/ui/content-filter'
import { LoginPromptInline } from '@/components/ui/login-prompt'
import { useTags } from '@/lib/taxonomy'
import { PageLoader } from '@/components/ui/LoadingSuspense'
import { PageContainer } from '@/components/ui/page-container'

export default function VibesPage() {
  const { user, isAuthenticated } = useAuth()
  const [showComposer, setShowComposer] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { trendingTags } = useTags('vibes')

  const { vibes, loading, error, mutate } = useLatestVibes(20)

  const handleNewVibe = (
    content: string,
    tags: string[],
    images?: string[],
    codeBlocks?: { language: string; code: string }[]
  ) => {
    if (!user) return

    const newVibe = {
      id: Date.now().toString(),
      content,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tags,
      images: images || [],
      codeBlocks: codeBlocks || [],
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      isLiked: false,
    }

    // 手动更新缓存
    mutate(
      prev => ({
        ...(prev || { success: true }),
        data: [
          newVibe,
          ...(prev && (prev as any).data ? (prev as any).data : vibes || []),
        ],
      }),
      false
    )
    setShowComposer(false)
  }

  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <PageContainer>
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Vibe 动态</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            分享你的编程想法、学习心得，记录编程生活的精彩瞬间
          </p>
        </div>

        <PageLoader text="正在加载动态..." />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Vibe 动态</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            分享你的编程想法、学习心得，记录编程生活的精彩瞬间
          </p>
        </div>

        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            加载动态失败
          </h3>
          <p className="text-gray-600 mb-4">网络错误或服务暂时不可用</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Vibe 动态</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          分享你的编程想法、学习心得，记录编程生活的精彩瞬间
        </p>
      </div>

      {/* Composer Toggle */}
      <div className="mb-8">
        {isAuthenticated && user ? (
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <Avatar size="md" theme="primary">
                {user.name.charAt(0)}
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-500">分享你的编程动态...</p>
              </div>
              <div className="text-2xl">✨</div>
            </div>
          </button>
        ) : (
          <div className="w-full p-4 bg-white border border-gray-200 rounded-lg">
            <LoginPromptInline
              message="登录后即可发布动态"
              onLoginClick={handleLoginClick}
            />
          </div>
        )}
      </div>

      {/* Vibe Composer */}
      {showComposer && isAuthenticated && (
        <div className="mb-8">
          <VibeComposer
            onSubmit={handleNewVibe}
            onCancel={() => setShowComposer(false)}
          />
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">浏览动态分类</h2>
          {trendingTags.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>🔥 热门标签:</span>
              {trendingTags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <QuickFilterBar
          module="vibes"
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button className="flex-1 py-2 px-4 rounded-md bg-white text-gray-900 font-medium shadow-sm">
          最新动态
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition-colors">
          热门动态
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition-colors">
          我关注的
        </button>
      </div>

      {/* Vibes Feed */}
      <div className="space-y-6">
        {vibes && vibes.length > 0 ? (
          vibes.map(vibe => <VibeCard key={vibe.id} vibe={vibe} />)
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有动态
            </h3>
            <p className="text-gray-600 mb-6">成为第一个分享编程动态的人</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary"
            >
              发布第一条Vibe
            </button>
          </div>
        )}
      </div>

      {/* Load More */}
      {vibes && vibes.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn-secondary px-8 py-3">加载更多动态</button>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingAvatar
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        theme="primary"
        title="发布动态"
      >
        ✨
      </FloatingAvatar>
    </PageContainer>
  )
}
