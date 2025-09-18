'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useUserOverviewStats } from '@/hooks/use-users'
import { useUserFavorites } from '@/hooks/use-interactions'
import type { Favorite } from '@/lib/interaction/interaction-types'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { mockArticles } from '@/lib/mock/articles'
import { mockResources } from '@/lib/mock/resources'
import { mockVibes } from '@/lib/mock/vibes'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { InteractionService } from '@/lib/interaction/interaction-service'

export default function MyFavoritesPage() {
  const { user, isAuthenticated } = useAuth()
  const { overview, mutate: mutateOverview } = useUserOverviewStats(
    user?.id || ''
  )
  const [activeTab, setActiveTab] = useState<
    'all' | 'resource' | 'post' | 'vibe'
  >('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // 切换标签或每页大小变化时重置页码（需在任何返回前调用）
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  // 获取用户收藏
  const { favorites: allFavorites, loading, refresh } = useUserFavorites()
  const { favorites: resourceFavorites, refresh: refreshResourceFavorites } =
    useUserFavorites('resource')
  const { favorites: postFavorites, refresh: refreshPostFavorites } =
    useUserFavorites('post')
  const { favorites: vibeFavorites, refresh: refreshVibeFavorites } =
    useUserFavorites('vibe')

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

  // 统一统计计数（显示用），分页以实际列表长度为准
  const displayTotal = (() => {
    switch (activeTab) {
      case 'resource':
        return overview?.favoriteResourcesCount ?? favorites.length
      case 'post':
        return overview?.favoritePostsCount ?? favorites.length
      case 'vibe':
        return overview?.favoriteVibesCount ?? favorites.length
      default:
        return overview?.totalFavoritesCount ?? favorites.length
    }
  })()

  const totalPages = Math.max(1, Math.ceil(favorites.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedFavorites = favorites.slice(startIndex, startIndex + pageSize)

  // 切换标签时或越界时修正页码
  if (typeof window !== 'undefined') {
    if (page > totalPages) {
      setTimeout(() => setPage(totalPages), 0)
    }
  }

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

  const getItemUrl = (item: Favorite) => {
    switch (item.targetType) {
      case 'resource': {
        const res = mockResources.find(r => r.id === item.targetId)
        return res ? `/resources/${res.slug}` : '/resources'
      }
      case 'post': {
        const art = mockArticles.find(a => a.id === item.targetId)
        return art ? `/posts/${art.slug}` : '/posts'
      }
      case 'vibe':
        return `/vibes/${item.targetId}`
      default:
        return '#'
    }
  }

  const getItemTitle = (item: Favorite) => {
    switch (item.targetType) {
      case 'resource': {
        const res = mockResources.find(r => r.id === item.targetId)
        return res?.title || '资源'
      }
      case 'post': {
        const art = mockArticles.find(a => a.id === item.targetId)
        return art?.title || '文章'
      }
      case 'vibe': {
        const vibe = mockVibes.find(v => v.id === item.targetId)
        return vibe?.content || '动态'
      }
      default:
        return '内容'
    }
  }

  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max)}...` : text

  const getItemDescription = (item: Favorite) => {
    switch (item.targetType) {
      case 'resource': {
        const res = mockResources.find(r => r.id === item.targetId)
        const desc = res?.description || res?.detailedDescription || ''
        return desc
          ? truncate(desc.replace(/\s+/g, ' ').trim(), 120)
          : '优质资源，点击查看详情'
      }
      case 'post': {
        const art = mockArticles.find(a => a.id === item.targetId)
        const desc = art?.excerpt || ''
        return desc
          ? truncate(desc.replace(/\s+/g, ' ').trim(), 120)
          : '精选文章，点击查看详情'
      }
      case 'vibe': {
        const vibe = mockVibes.find(v => v.id === item.targetId)
        const desc = vibe?.content || ''
        return desc
          ? truncate(desc.replace(/\s+/g, ' ').trim(), 120)
          : '动态内容，点击查看详情'
      }
      default:
        return '点击查看详情'
    }
  }

  const handleUnfavorite = async (favorite: Favorite) => {
    if (!user?.id) return
    try {
      await InteractionService.toggleFavorite(
        favorite.targetId,
        favorite.targetType,
        user.id
      )
      await Promise.all([
        refresh(),
        refreshResourceFavorites(),
        refreshPostFavorites(),
        refreshVibeFavorites(),
        mutateOverview(),
      ])
      setPage(1)
    } catch {}
  }

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
        <p className="text-gray-600">管理您收藏的资源、文章和动态</p>

        {/* 汇总统计 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">全部收藏</div>
            <div className="text-2xl font-bold text-gray-900">
              {overview?.totalFavoritesCount ?? 0}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">资源</div>
            <div className="text-2xl font-bold text-green-600">
              {overview?.favoriteResourcesCount ?? 0}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">文章</div>
            <div className="text-2xl font-bold text-blue-600">
              {overview?.favoritePostsCount ?? 0}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">动态</div>
            <div className="text-2xl font-bold text-purple-600">
              {overview?.favoriteVibesCount ?? 0}
            </div>
          </div>
        </div>
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
          全部 ({overview?.totalFavoritesCount ?? allFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('resource')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resource'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          资源 ({overview?.favoriteResourcesCount ?? resourceFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'post'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          文章 ({overview?.favoritePostsCount ?? postFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('vibe')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'vibe'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          动态 ({overview?.favoriteVibesCount ?? vibeFavorites.length})
        </button>
      </div>

      {/* 结果汇总与分页 */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div>
          共 <span className="font-semibold text-gray-900">{displayTotal}</span>{' '}
          条{activeTab !== 'all' && `（${getTypeLabel(activeTab)}）`}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-500">每页</label>
          <select
            value={pageSize}
            onChange={e => setPageSize(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-3 py-1 rounded border ${
              page <= 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            上一页
          </button>
          <span>
            第 <span className="font-medium">{page}</span> / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`px-3 py-1 rounded border ${
              page >= totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            下一页
          </button>
        </div>
      </div>

      {/* 收藏列表 */}
      <div className="space-y-4">
        {paginatedFavorites.length === 0 ? (
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
          paginatedFavorites.map((favorite: Favorite) => (
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

                  <Link href={getItemUrl(favorite)} className="block group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {getItemTitle(favorite)}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {getItemDescription(favorite)}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link
                      href={getItemUrl(favorite)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      查看详情
                    </Link>
                    <button
                      onClick={() => handleUnfavorite(favorite)}
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
            onClick={async () => {
              await refresh()
              await mutateOverview()
              setPage(1)
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            刷新列表
          </button>
        </div>
      )}
    </div>
  )
}
