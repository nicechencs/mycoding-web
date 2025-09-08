'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useUserFavorites } from '@/hooks/use-interactions'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function MyFavoritesPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<
    'all' | 'resource' | 'post' | 'vibe'
  >('all')

  // 获取用户收藏
  const { favorites: allFavorites, loading, refresh } = useUserFavorites()
  const { favorites: resourceFavorites } = useUserFavorites('resource')
  const { favorites: postFavorites } = useUserFavorites('post')
  const { favorites: vibeFavorites } = useUserFavorites('vibe')

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">需要登录</h1>
        <p className="text-gray-600 mb-6">请先登录查看您的收藏</p>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          立即登录
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getCurrentFavorites = () => {
    switch (activeTab) {
      case 'resource':
        return resourceFavorites
      case 'post':
        return postFavorites
      case 'vibe':
        return vibeFavorites
      default:
        return allFavorites
    }
  }

  const favorites = getCurrentFavorites()

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'resource':
        return '资源'
      case 'post':
        return '文章'
      case 'vibe':
        return '动态'
      default:
        return '未知'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resource':
        return 'bg-green-100 text-green-700'
      case 'post':
        return 'bg-blue-100 text-blue-700'
      case 'vibe':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getItemUrl = (item: any) => {
    switch (item.targetType) {
      case 'resource':
        return `/resources/${item.targetId}`
      case 'post':
        return `/posts/${item.targetId}`
      case 'vibe':
        return `/vibes/${item.targetId}`
      default:
        return '#'
    }
  }

  return (
    <div className="container py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
        <p className="text-gray-600">管理您收藏的资源、文章和动态</p>
      </div>

      {/* 筛选标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部 ({allFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('resource')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resource'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          资源 ({resourceFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'post'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          文章 ({postFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('vibe')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'vibe'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          动态 ({vibeFavorites.length})
        </button>
      </div>

      {/* 收藏列表 */}
      <div className="space-y-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'all'
                ? '还没有收藏任何内容'
                : `还没有收藏任何${getTypeLabel(activeTab)}`}
            </h3>
            <p className="text-gray-600 mb-6">
              去浏览一些有趣的内容并收藏它们吧！
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/resources"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                浏览资源
              </Link>
              <Link
                href="/posts"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                阅读文章
              </Link>
              <Link
                href="/vibes"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                查看动态
              </Link>
            </div>
          </div>
        ) : (
          favorites.map((favorite: any) => (
            <div
              key={favorite.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getTypeColor(favorite.targetType)}`}
                    >
                      {getTypeLabel(favorite.targetType)}
                    </span>
                    <span className="text-sm text-gray-500">
                      收藏于{' '}
                      {formatDistanceToNow(favorite.createdAt, {
                        locale: zhCN,
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <Link
                    href={getItemUrl(favorite) as any}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {/* 这里应该显示实际的标题，需要根据targetId获取内容 */}
                      {favorite.targetType === 'resource' && '资源标题'}
                      {favorite.targetType === 'post' && '文章标题'}
                      {favorite.targetType === 'vibe' && '动态内容'}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {/* 这里应该显示实际的描述 */}
                    这是一个{getTypeLabel(favorite.targetType)}的简短描述...
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link
                      href={getItemUrl(favorite) as any}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      查看详情
                    </Link>
                    <button
                      onClick={() => {
                        // 这里应该实现取消收藏功能
                        console.log('取消收藏', favorite.id)
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      取消收藏
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Avatar size="xs" theme="secondary">
                    {user?.name.charAt(0) || 'U'}
                  </Avatar>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 刷新按钮 */}
      {favorites.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={refresh}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            刷新列表
          </button>
        </div>
      )}
    </div>
  )
}
