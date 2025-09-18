'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserOverviewStats, useUserPreferences } from '@/hooks/use-users'
import { usersService } from '@/services/users.service'
import { useUserFavorites, useUserComments, useUserLikes } from '@/hooks/use-interactions'
import { mockArticles } from '@/lib/mock/articles'
import { mockResources } from '@/lib/mock/resources'
import { mockVibes } from '@/lib/mock/vibes'
import { InteractionService } from '@/lib/interaction/interaction-service'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Avatar } from '@/components/ui/avatar'
import { Markdown } from '@/components/ui/markdown'

interface UserSettings {
  name: string
  email: string
  bio: string
  website: string
  github: string
  twitter: string
}

export default function SettingsPage() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = user?.id
  const { overview } = useUserOverviewStats(userId || '')
  const { preferences, loading: prefsLoading, mutate: mutatePrefs } = useUserPreferences(userId || '')
  
  // 收藏相关hooks
  const { favorites: allFavorites, loading: favoritesLoading, refresh: refreshFavorites } = useUserFavorites()
  
  // 评论相关hooks  
  const { comments: userComments, loading: commentsLoading, refresh: refreshComments } = useUserComments()
  
  // 点赞相关hooks
  const { likes: allLikes, loading: likesLoading, refresh: refreshLikes } = useUserLikes()

  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    website: '',
    github: '',
    twitter: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [isSavingPref, setIsSavingPref] = useState(false)
  // 列表筛选/排序状态
  const [favoriteType, setFavoriteType] = useState<'all' | 'resource' | 'post' | 'vibe'>('all')
  const [favoriteSort, setFavoriteSort] = useState<'newest' | 'oldest' | 'type' | 'title'>('newest')
  const [commentType, setCommentType] = useState<'all' | 'resource' | 'post' | 'vibe'>('all')
  const [commentSort, setCommentSort] = useState<'newest' | 'oldest' | 'most-liked' | 'most-replied'>('newest')
  const [likeType, setLikeType] = useState<'all' | 'resource' | 'post' | 'vibe'>('all')
  const [likeRange, setLikeRange] = useState<'all' | 'week' | 'month' | 'year'>('all')
  const [activeTab, setActiveTab] = useState<
    'overview' | 'favorites' | 'comments' | 'likes' | 'profile' | 'account' | 'notifications' | 'privacy'
  >('overview')

  // 统计数据 - 扩展更多统计信息
  const stats = useMemo(
    () => [
      {
        label: '已收藏资源',
        value: String(overview?.favoriteResourcesCount || 0),
        icon: '📚',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        href: '/my-favorites',
        description: '查看您收藏的所有学习资源',
      },
      {
        label: '发表文章',
        value: String(overview?.articlesCount || 0),
        icon: '📝',
        color: 'text-green-600',
        bg: 'bg-green-50',
        href: '/posts/articles',
        description: '管理您发布的文章内容',
      },
      {
        label: '获得点赞',
        value: String(overview?.receivedLikes || 0),
        icon: '👍',
        color: 'text-red-600',
        bg: 'bg-red-50',
        href: '/posts/articles',
        description: '查看获得赞赏的内容',
      },
      {
        label: '评论数',
        value: String(userComments?.length || 0),
        icon: '💬',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        href: '#',
        description: '您发表的所有评论',
      },
      {
        label: '收藏文章',
        value: String(allFavorites?.filter(f => f.targetType === 'post')?.length || 0),
        icon: '📄',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        href: '#',
        description: '收藏的技术文章',
      },
      {
        label: '收藏动态',
        value: String(allFavorites?.filter(f => f.targetType === 'vibe')?.length || 0),
        icon: '⚡',
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        href: '#',
        description: '收藏的动态分享',
      },
    ],
    [
      overview?.favoriteResourcesCount,
      overview?.articlesCount,
      overview?.receivedLikes,
      userComments?.length,
      allFavorites,
    ]
  )

  // 最近活动（基于交互服务 + mock 内容映射）
  type ActivityItem = {
    type: 'favorite' | 'comment' | 'like'
    title: string
    href: string
    icon: string
    createdAt: Date
  }

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    let mounted = true
    const loadActivities = async () => {
      if (!userId) {
        setRecentActivities([])
        return
      }
      try {
        const [favorites, comments, likes] = await Promise.all([
          InteractionService.getUserFavorites(userId),
          InteractionService.getUserComments(userId),
          InteractionService.getUserLikes(userId),
        ])

        const mapFavorite = (f: any): ActivityItem => {
          if (f.targetType === 'resource') {
            const res = mockResources.find(r => r.id === f.targetId)
            return {
              type: 'favorite',
              title: `收藏了《${res?.title || '资源'}》`,
              href: res ? `/resources/${res.slug}` : '/resources',
              icon: '📚',
              createdAt: new Date(f.createdAt),
            }
          }
          if (f.targetType === 'post') {
            const art = mockArticles.find(a => a.id === f.targetId)
            return {
              type: 'favorite',
              title: `收藏了《${art?.title || '文章'}》`,
              href: art ? `/posts/${art.slug}` : '/posts',
              icon: '📌',
              createdAt: new Date(f.createdAt),
            }
          }
          // vibe
          return {
            type: 'favorite',
            title: '收藏了一个动态',
            href: `/vibes/${f.targetId}`,
            icon: '📌',
            createdAt: new Date(f.createdAt),
          }
        }

        const mapComment = (c: any): ActivityItem => {
          if (c.targetType === 'resource') {
            const res = mockResources.find(r => r.id === c.targetId)
            return {
              type: 'comment',
              title: `评论了《${res?.title || '资源'}》`,
              href: res ? `/resources/${res.slug}` : '/resources',
              icon: '💬',
              createdAt: new Date(c.createdAt),
            }
          }
          if (c.targetType === 'post') {
            const art = mockArticles.find(a => a.id === c.targetId)
            return {
              type: 'comment',
              title: `评论了《${art?.title || '文章'}》`,
              href: art ? `/posts/${art.slug}` : '/posts',
              icon: '💬',
              createdAt: new Date(c.createdAt),
            }
          }
          return {
            type: 'comment',
            title: '评论了一个动态',
            href: `/vibes/${c.targetId}`,
            icon: '💬',
            createdAt: new Date(c.createdAt),
          }
        }

        const mapLike = (l: any): ActivityItem => {
          if (l.targetType === 'resource') {
            const res = mockResources.find(r => r.id === l.targetId)
            return {
              type: 'like',
              title: `点赞了《${res?.title || '资源'}》`,
              href: res ? `/resources/${res.slug}` : '/resources',
              icon: '👍',
              createdAt: new Date(l.createdAt),
            }
          }
          if (l.targetType === 'post') {
            const art = mockArticles.find(a => a.id === l.targetId)
            return {
              type: 'like',
              title: `点赞了《${art?.title || '文章'}》`,
              href: art ? `/posts/${art.slug}` : '/posts',
              icon: '👍',
              createdAt: new Date(l.createdAt),
            }
          }
          return {
            type: 'like',
            title: '点赞了一个动态',
            href: `/vibes/${l.targetId}`,
            icon: '👍',
            createdAt: new Date(l.createdAt),
          }
        }

        const items: ActivityItem[] = [
          ...favorites.map(mapFavorite),
          ...comments.map(mapComment),
          ...likes.map(mapLike),
        ]
          .filter(Boolean)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 8)

        if (mounted) setRecentActivities(items)
      } catch (e) {
        if (mounted) setRecentActivities([])
      }
    }

    loadActivities()
    return () => {
      mounted = false
    }
  }, [userId])

  const handleInputChange =
    (field: keyof UserSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSettings(prev => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleSave = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const payload = {
        name: settings.name,
        bio: settings.bio,
        website: settings.website,
        github: settings.github,
        twitter: settings.twitter,
      }
      const res = await usersService.updateUser(user.id, payload)
      if (!res.success) throw new Error(res.error || '保存失败')
      setShowSaveSuccess(true)
      // 3秒后自动隐藏通知
      setTimeout(() => setShowSaveSuccess(false), 3000)
    } catch (e) {
      console.error('保存用户资料失败:', e)
      alert('保存失败，请稍后再试。')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'favorites', name: '我的收藏', icon: '📚' },
    { id: 'comments', name: '我的评论', icon: '💬' },
    { id: 'likes', name: '我的点赞', icon: '👍' },
    { id: 'overview', name: '数据概览', icon: '📊' },
    { id: 'profile', name: '个人资料', icon: '👤' },
    { id: 'account', name: '账号安全', icon: '🔐' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🔒' },
  ] as const

  // 更新用户偏好设置（通知/隐私）
  const updatePreference = async <K extends keyof UserSettings | any>(
    key: 'emailNotifications' | 'pushNotifications' | 'newsletter' | 'publicProfile' | 'showActivity',
    value: boolean
  ) => {
    if (!userId) return
    setIsSavingPref(true)
    try {
      const res = await usersService.updateUserPreferences(userId, { [key]: value })
      if (!res.success) throw new Error(res.error || '更新失败')
      // 直接用返回值更新 SWR 缓存，避免开发模式下重新获取默认值
      await mutatePrefs(res as any, { revalidate: false })
    } catch (e) {
      console.error('更新偏好设置失败:', e)
      alert('更新失败，请稍后重试。')
    } finally {
      setIsSavingPref(false)
    }
  }

  // 从 URL 恢复当前 tab
  useEffect(() => {
    const tab = searchParams.get('tab') as typeof activeTab | null
    if (tab && ['overview','favorites','comments','likes','profile','account','notifications','privacy'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 将当前 tab 写入 URL（不刷新页面）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', activeTab)
      router.replace(url.pathname + '?' + url.searchParams.toString())
    }
  }, [activeTab, router])

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
        <p className="text-gray-600">管理您的个人信息和偏好设置</p>
      </div>

      {/* 成功通知 */}
      {showSaveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                设置已保存成功！
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowSaveSuccess(false)}
                className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏导航 */}
        <div className="lg:col-span-1">
          <BaseCard>
            <nav className="space-y-1">

   {/* 数据分析区域 */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
                  数据分析
                </div>
                {tabs.slice(3, 4).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* 分割线 */}
              <div className="border-t border-gray-200 my-4"></div>


              {/* 我的内容区域 */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
                  我的内容
                </div>
                {tabs.slice(0, 3).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* 分割线 */}
              <div className="border-t border-gray-200 my-4"></div>
           
              {/* 账号设置区域 */}
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
                  账号设置
                </div>
                {tabs.slice(4).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
          </BaseCard>
        </div>

        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 欢迎区域 */}
              <BaseCard>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      欢迎回来，{user?.name}！
                    </h1>
                    <p className="text-gray-600 mt-1">继续您的编程学习之旅</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user?.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        加入于 {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </BaseCard>

              {/* 数据统计区域 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📊 数据统计
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                          <span className="text-xl">{stat.icon}</span>
                        </div>
                        <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 学习进度概览 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📈 学习进度
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BaseCard>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">本周活跃度</h3>
                    <div className="flex items-end justify-between h-32">
                      {[40, 65, 30, 80, 45, 90, 70].map((height, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-blue-500 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">
                            {['一', '二', '三', '四', '五', '六', '日'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </BaseCard>
                  <BaseCard>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">技能分布</h3>
                    <div className="space-y-3">
                      {[
                        { name: '前端开发', value: 80, color: 'bg-blue-500' },
                        { name: '后端开发', value: 60, color: 'bg-green-500' },
                        { name: '数据库', value: 45, color: 'bg-purple-500' },
                        { name: '人工智能', value: 30, color: 'bg-red-500' },
                      ].map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{skill.name}</span>
                            <span className="text-gray-500">{skill.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${skill.color} h-2 rounded-full`}
                              style={{ width: `${skill.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </BaseCard>
                </div>
              </div>

              {/* 最近活动时间线 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  ⚡ 最近活动
                </h2>
                <BaseCard>
                  <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>暂无活动记录</p>
                      </div>
                    ) : (
                      recentActivities.slice(0, 10).map((activity, index) => (
                        <Link key={index} href={activity.href}>
                          <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-lg">{activity.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {activity.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(activity.createdAt, {
                                  locale: zhCN,
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </BaseCard>
              </div>

              {/* 推荐内容 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  🎯 为您推荐
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockResources.slice(0, 3).map((resource) => (
                    <Link key={resource.id} href={`/resources/${resource.slug}`}>
                      <BaseCard className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {resource.category}
                          </span>
                          <span className="text-xs text-gray-500">热门</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {resource.description}
                        </p>
                      </BaseCard>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  个人资料
                </h2>
                <p className="text-gray-600 mt-1">更新您的个人信息</p>
              </div>

              {/* 头像设置 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      更换头像
                    </Button>
                    <p className="text-xs text-gray-500">
                      支持JPG、PNG格式，文件大小不超过2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="姓名"
                  value={settings.name}
                  onChange={handleInputChange('name')}
                  placeholder="请输入您的姓名"
                />

                <Input
                  label="邮箱"
                  type="email"
                  value={settings.email}
                  onChange={handleInputChange('email')}
                  disabled
                  helperText="邮箱地址不能修改"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    个人简介
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="介绍一下自己..."
                    value={settings.bio}
                    onChange={handleInputChange('bio')}
                  />
                </div>

                <Input
                  label="个人网站"
                  value={settings.website}
                  onChange={handleInputChange('website')}
                  placeholder="https://yourwebsite.com"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub"
                    value={settings.github}
                    onChange={handleInputChange('github')}
                    placeholder="github用户名"
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  />

                  <Input
                    label="Twitter"
                    value={settings.twitter}
                    onChange={handleInputChange('twitter')}
                    placeholder="twitter用户名"
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </BaseCard>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-6">
              {/* 收藏统计概览 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📊 收藏统计
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{overview?.totalFavoritesCount || 0}</div>
                      <div className="text-sm text-gray-600">全部收藏</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{overview?.favoriteResourcesCount || 0}</div>
                      <div className="text-sm text-gray-600">资源收藏</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{overview?.favoritePostsCount || 0}</div>
                      <div className="text-sm text-gray-600">文章收藏</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{overview?.favoriteVibesCount || 0}</div>
                      <div className="text-sm text-gray-600">动态收藏</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 筛选和搜索 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  🔍 筛选和管理
                </h2>
                <BaseCard>
                  <div className="space-y-4">
                    {/* 类型筛选 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', name: '全部', count: allFavorites.length },
                          { id: 'resource', name: '资源', count: allFavorites.filter(f => f.targetType === 'resource').length },
                          { id: 'post', name: '文章', count: allFavorites.filter(f => f.targetType === 'post').length },
                          { id: 'vibe', name: '动态', count: allFavorites.filter(f => f.targetType === 'vibe').length },
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setFavoriteType(type.id as any)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              favoriteType === (type.id as any)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {type.name} ({type.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 排序选项 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                      <select
                        className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        value={favoriteSort}
                        onChange={e => setFavoriteSort(e.target.value as any)}
                      >
                        <option value="newest">最新收藏</option>
                        <option value="oldest">最早收藏</option>
                        <option value="type">按类型分组</option>
                        <option value="title">按标题排序</option>
                      </select>
                    </div>
                  </div>
                </BaseCard>
              </div>

              {/* 收藏列表 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📚 收藏内容
                </h2>
                {favoritesLoading ? (
                  <BaseCard>
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </BaseCard>
                ) : allFavorites.length === 0 ? (
                  <BaseCard>
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏任何内容</h3>
                      <p className="text-gray-600 mb-6">去浏览一些有趣的内容并收藏它们吧！</p>
                      <div className="flex gap-3 justify-center">
                        <Link href="/resources" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          浏览资源
                        </Link>
                        <Link href="/posts" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          阅读文章
                        </Link>
                        <Link href="/vibes" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          查看动态
                        </Link>
                      </div>
                    </div>
                  </BaseCard>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      let list = allFavorites
                      if (favoriteType !== 'all') {
                        list = list.filter(f => f.targetType === favoriteType)
                      }
                      switch (favoriteSort) {
                        case 'newest':
                          list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          break
                        case 'oldest':
                          list = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                          break
                        case 'type':
                          const order = { resource: 0, post: 1, vibe: 2 } as Record<string, number>
                          list = [...list].sort((a, b) => (order[a.targetType] ?? 99) - (order[b.targetType] ?? 99))
                          break
                        case 'title':
                          list = [...list].sort((a, b) => {
                            const getTitle = (x: any) => {
                              if (x.targetType === 'resource') return (mockResources.find(r => r.id === x.targetId)?.title || '')
                              if (x.targetType === 'post') return (mockArticles.find(r => r.id === x.targetId)?.title || '')
                              if (x.targetType === 'vibe') return (mockVibes.find(r => r.id === x.targetId)?.content || '')
                              return ''
                            }
                            return getTitle(a).localeCompare(getTitle(b))
                          })
                          break
                      }
                      return list
                    })().map((favorite) => {
                      let item = null
                      let itemUrl = '#'
                      let itemType = '未知'
                      let typeColor = 'bg-gray-100 text-gray-700'

                      if (favorite.targetType === 'resource') {
                        item = mockResources.find(r => r.id === favorite.targetId)
                        itemUrl = item ? `/resources/${item.slug}` : '#'
                        itemType = '资源'
                        typeColor = 'bg-green-100 text-green-700'
                      } else if (favorite.targetType === 'post') {
                        item = mockArticles.find(a => a.id === favorite.targetId)
                        itemUrl = item ? `/posts/${item.slug}` : '#'
                        itemType = '文章'
                        typeColor = 'bg-blue-100 text-blue-700'
                      } else if (favorite.targetType === 'vibe') {
                        item = mockVibes.find(v => v.id === favorite.targetId)
                        itemUrl = item ? `/vibes/${item.id}` : '#'
                        itemType = '动态'
                        typeColor = 'bg-purple-100 text-purple-700'
                      }

                      const itemTitle = item?.title || item?.content || '未找到内容'
                      const itemDescription = item?.description || item?.excerpt || ''

                      return (
                        <div key={favorite.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${typeColor}`}>
                                  {itemType}
                                </span>
                                <span className="text-sm text-gray-500">
                                  收藏于 {formatDistanceToNow(new Date(favorite.createdAt), {
                                    locale: zhCN,
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>

                              <Link href={itemUrl} className="block group">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                  {itemTitle}
                                </h3>
                              </Link>

                              {itemDescription && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                  {itemDescription}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <Link href={itemUrl} className="text-blue-600 hover:text-blue-700 font-medium">
                                  查看详情
                                </Link>
                                <button
                                  onClick={async () => {
                                    if (!userId) return
                                    await InteractionService.toggleFavorite(favorite.targetId, favorite.targetType, userId)
                                    refreshFavorites()
                                  }}
                                  className="text-red-600 hover:text-red-700 font-medium"
                                >
                                  取消收藏
                                </button>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  查看次数: {Math.floor(Math.random() * 100) + 1}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* 评论统计概览 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📊 评论统计
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{overview?.totalCommentsCount || 0}</div>
                      <div className="text-sm text-gray-600">全部评论</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{overview?.commentsOnResourcesCount || 0}</div>
                      <div className="text-sm text-gray-600">资源评论</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{overview?.commentsOnPostsCount || 0}</div>
                      <div className="text-sm text-gray-600">文章评论</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{overview?.commentsOnVibesCount || 0}</div>
                      <div className="text-sm text-gray-600">动态评论</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 评论质量和互动分析 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📈 互动分析
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BaseCard>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{Math.floor(Math.random() * 500) + 100}</div>
                      <div className="text-sm text-gray-600">获得点赞</div>
                    </div>
                  </BaseCard>
                  <BaseCard>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{Math.floor(Math.random() * 100) + 20}</div>
                      <div className="text-sm text-gray-600">收到回复</div>
                    </div>
                  </BaseCard>
                  <BaseCard>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{((Math.random() * 2) + 3).toFixed(1)}</div>
                      <div className="text-sm text-gray-600">平均评分</div>
                    </div>
                  </BaseCard>
                </div>
              </div>

              {/* 筛选和管理 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  🔍 筛选和管理
                </h2>
                <BaseCard>
                  <div className="space-y-4">
                    {/* 类型筛选 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">评论类型</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', name: '全部', count: userComments.length },
                          { id: 'resource', name: '资源', count: userComments.filter(c => c.targetType === 'resource').length },
                          { id: 'post', name: '文章', count: userComments.filter(c => c.targetType === 'post').length },
                          { id: 'vibe', name: '动态', count: userComments.filter(c => c.targetType === 'vibe').length },
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setCommentType(type.id as any)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              commentType === (type.id as any)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {type.name} ({type.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 排序和筛选选项 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                          value={commentSort}
                          onChange={e => setCommentSort(e.target.value as any)}
                        >
                          <option value="newest">最新发表</option>
                          <option value="oldest">最早发表</option>
                          <option value="most-liked">最多点赞</option>
                          <option value="most-replied">最多回复</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">评分筛选</label>
                        <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                          <option value="all">全部评分</option>
                          <option value="5">5星评价</option>
                          <option value="4">4星评价</option>
                          <option value="3">3星评价</option>
                          <option value="no-rating">无评分</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </BaseCard>
              </div>

              {/* 评论列表 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  💬 我的评论
                </h2>
                {commentsLoading ? (
                  <BaseCard>
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </BaseCard>
                ) : userComments.length === 0 ? (
                  <BaseCard>
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">还没有发表过评论</h3>
                      <p className="text-gray-600 mb-6">参与讨论，分享您的想法和见解！</p>
                      <div className="flex gap-3 justify-center">
                        <Link href="/resources" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          浏览资源
                        </Link>
                        <Link href="/posts" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          阅读文章
                        </Link>
                        <Link href="/vibes" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          查看动态
                        </Link>
                      </div>
                    </div>
                  </BaseCard>
                ) : (
                  <div className="space-y-6">
                    {(() => {
                      let list = userComments
                      if (commentType !== 'all') {
                        list = list.filter(c => c.targetType === commentType)
                      }
                      switch (commentSort) {
                        case 'newest':
                          list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          break
                        case 'oldest':
                          list = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                          break
                        case 'most-liked':
                          list = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0))
                          break
                        case 'most-replied':
                          list = [...list].sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
                          break
                      }
                      return list
                    })().map((comment) => {
                      let item = null
                      let itemUrl = '#'
                      let itemType = '未知'
                      let typeColor = 'bg-gray-100 text-gray-700'

                      if (comment.targetType === 'resource') {
                        item = mockResources.find(r => r.id === comment.targetId)
                        itemUrl = item ? `/resources/${item.slug}` : '#'
                        itemType = '资源'
                        typeColor = 'bg-green-100 text-green-700'
                      } else if (comment.targetType === 'post') {
                        item = mockArticles.find(a => a.id === comment.targetId)
                        itemUrl = item ? `/posts/${item.slug}` : '#'
                        itemType = '文章'
                        typeColor = 'bg-blue-100 text-blue-700'
                      } else if (comment.targetType === 'vibe') {
                        item = mockVibes.find(v => v.id === comment.targetId)
                        itemUrl = item ? `/vibes/${item.id}` : '#'
                        itemType = '动态'
                        typeColor = 'bg-purple-100 text-purple-700'
                      }

                      return (
                        <div key={comment.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          {/* 评论头部信息 */}
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${typeColor}`}>
                                  {itemType}评论
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(new Date(comment.createdAt), {
                                    locale: zhCN,
                                    addSuffix: true,
                                  })}
                                </span>
                                {comment.rating && (
                                  <div className="flex items-center text-yellow-500">
                                    <span className="text-sm mr-1">评分:</span>
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-3 h-3 ${i < comment.rating! ? 'fill-current' : 'fill-gray-300'}`}
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  {Math.floor(Math.random() * 50) + 1}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {Math.floor(Math.random() * 10)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 评论内容 */}
                          <div className="p-6">
                            <div className="flex gap-4">
                              <Avatar size="sm" theme="primary">
                                {user?.name?.charAt(0) || 'U'}
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="prose prose-sm max-w-none text-gray-700">
                                    <Markdown>{comment.content}</Markdown>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-3">
                                  <Link href={itemUrl} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                    查看原文
                                  </Link>
                                  <button className="text-gray-600 hover:text-gray-700 text-sm">
                                    编辑
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!userId) return
                                      const ok = await InteractionService.deleteComment(comment.id, userId)
                                      if (ok) refreshComments()
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    删除
                                  </button>
                                </div>

                                {/* 评论目标信息 */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xs text-gray-500 mb-1">评论对象</div>
                                  <Link href={itemUrl} className="block hover:text-blue-600 transition-colors">
                                    <div className="font-medium text-gray-900 text-sm">
                                      {item?.title || item?.content || '未找到内容'}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="space-y-6">
              {/* 点赞统计概览 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📊 点赞统计
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{overview?.totalLikesCount || 0}</div>
                      <div className="text-sm text-gray-600">全部点赞</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{overview?.likesOnResourcesCount || 0}</div>
                      <div className="text-sm text-gray-600">资源点赞</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{overview?.likesOnPostsCount || 0}</div>
                      <div className="text-sm text-gray-600">文章点赞</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{overview?.likesOnVibesCount || 0}</div>
                      <div className="text-sm text-gray-600">动态点赞</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 点赞活跃度分析 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  📈 点赞活跃度
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BaseCard>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">本周</div>
                      <div className="text-sm text-gray-600">{Math.floor(Math.random() * 50) + 10} 次点赞</div>
                    </div>
                  </BaseCard>
                  <BaseCard>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">平均</div>
                      <div className="text-sm text-gray-600">每天 {Math.floor(Math.random() * 10) + 2} 次</div>
                    </div>
                  </BaseCard>
                </div>
              </div>

              {/* 筛选和管理 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  🔍 筛选和管理
                </h2>
                <BaseCard>
                  <div className="space-y-4">
                    {/* 类型筛选 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">点赞类型</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', name: '全部', count: allLikes.length },
                          { id: 'resource', name: '资源', count: allLikes.filter(l => l.targetType === 'resource').length },
                          { id: 'post', name: '文章', count: allLikes.filter(l => l.targetType === 'post').length },
                          { id: 'vibe', name: '动态', count: allLikes.filter(l => l.targetType === 'vibe').length },
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setLikeType(type.id as any)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              likeType === (type.id as any)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {type.name} ({type.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 时间筛选 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                      <select
                        className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        value={likeRange}
                        onChange={e => setLikeRange(e.target.value as any)}
                      >
                        <option value="all">全部时间</option>
                        <option value="week">最近一周</option>
                        <option value="month">最近一月</option>
                        <option value="year">最近一年</option>
                      </select>
                    </div>
                  </div>
                </BaseCard>
              </div>

              {/* 点赞列表 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  👍 我的点赞
                </h2>
                {likesLoading ? (
                  <BaseCard>
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </BaseCard>
                ) : allLikes.length === 0 ? (
                  <BaseCard>
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">👍</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">还没有点赞任何内容</h3>
                      <p className="text-gray-600 mb-6">去发现一些优秀的内容并点赞支持吧！</p>
                      <div className="flex gap-3 justify-center">
                        <Link href="/resources" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          浏览资源
                        </Link>
                        <Link href="/posts" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          阅读文章
                        </Link>
                        <Link href="/vibes" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          查看动态
                        </Link>
                      </div>
                    </div>
                  </BaseCard>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      let list = allLikes
                      if (likeType !== 'all') {
                        list = list.filter(l => l.targetType === likeType)
                      }
                      if (likeRange !== 'all') {
                        const now = new Date()
                        const threshold = new Date()
                        if (likeRange === 'week') threshold.setDate(now.getDate() - 7)
                        if (likeRange === 'month') threshold.setMonth(now.getMonth() - 1)
                        if (likeRange === 'year') threshold.setFullYear(now.getFullYear() - 1)
                        list = list.filter(l => new Date(l.createdAt) >= threshold)
                      }
                      // 默认按最新时间排序
                      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      return list
                    })().map((like) => {
                      let item = null
                      let itemUrl = '#'
                      let itemType = '未知'
                      let typeColor = 'bg-gray-100 text-gray-700'

                      if (like.targetType === 'resource') {
                        item = mockResources.find(r => r.id === like.targetId)
                        itemUrl = item ? `/resources/${item.slug}` : '#'
                        itemType = '资源'
                        typeColor = 'bg-green-100 text-green-700'
                      } else if (like.targetType === 'post') {
                        item = mockArticles.find(a => a.id === like.targetId)
                        itemUrl = item ? `/posts/${item.slug}` : '#'
                        itemType = '文章'
                        typeColor = 'bg-blue-100 text-blue-700'
                      } else if (like.targetType === 'vibe') {
                        item = mockVibes.find(v => v.id === like.targetId)
                        itemUrl = item ? `/vibes/${item.id}` : '#'
                        itemType = '动态'
                        typeColor = 'bg-purple-100 text-purple-700'
                      }

                      const itemTitle = item?.title || item?.content || '未找到内容'
                      const itemDescription = item?.description || item?.excerpt || ''

                      return (
                        <div key={like.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${typeColor}`}>
                                  {itemType}
                                </span>
                                <span className="text-sm text-gray-500">
                                  点赞于 {formatDistanceToNow(new Date(like.createdAt), {
                                    locale: zhCN,
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>

                              <Link href={itemUrl} className="block group">
                                <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                                  {itemTitle}
                                </h3>
                              </Link>

                              {itemDescription && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                  {itemDescription}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <Link href={itemUrl} className="text-blue-600 hover:text-blue-700 font-medium">
                                  查看详情
                                </Link>
                                <button
                                  onClick={async () => {
                                    if (!userId) return
                                    await InteractionService.toggleLike(like.targetId, like.targetType, userId)
                                    refreshLikes()
                                  }}
                                  className="text-red-600 hover:text-red-700 font-medium"
                                >取消点赞</button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          
          

          {activeTab === 'account' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">账号安全</h2>
                <p className="text-gray-600 mt-1">管理您的账号安全设置</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">修改密码</h3>
                  <div className="space-y-4">
                    <Input
                      label="当前密码"
                      type="password"
                      placeholder="请输入当前密码"
                    />
                    <Input
                      label="新密码"
                      type="password"
                      placeholder="请输入新密码"
                    />
                    <Input
                      label="确认新密码"
                      type="password"
                      placeholder="请再次输入新密码"
                    />
                    <Button variant="outline">更新密码</Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">两步验证</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900">启用两步验证</p>
                      <p className="text-sm text-gray-600">为您的账号添加额外的安全保护</p>
                    </div>
                    <Button variant="outline" size="sm">启用</Button>
                  </div>
                </div>
              </div>
            </BaseCard>
          )}

          {activeTab === 'notifications' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">通知设置</h2>
                <p className="text-gray-600 mt-1">选择您希望接收的通知类型</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">邮件通知</p>
                    <p className="text-sm text-gray-600">接收重要更新和消息</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!preferences?.emailNotifications}
                    disabled={prefsLoading || isSavingPref}
                    onChange={e => updatePreference('emailNotifications', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">推送通知</p>
                    <p className="text-sm text-gray-600">接收浏览器推送通知</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!preferences?.pushNotifications}
                    disabled={prefsLoading || isSavingPref}
                    onChange={e => updatePreference('pushNotifications', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">订阅简报</p>
                    <p className="text-sm text-gray-600">接收产品和内容更新邮件</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!preferences?.newsletter}
                    disabled={prefsLoading || isSavingPref}
                    onChange={e => updatePreference('newsletter', e.target.checked)}
                  />
                </div>
              </div>
            </BaseCard>
          )}

          {activeTab === 'privacy' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">隐私设置</h2>
                <p className="text-gray-600 mt-1">控制您的隐私和数据使用</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">公开个人资料</p>
                    <p className="text-sm text-gray-600">允许其他用户查看您的个人资料</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!preferences?.publicProfile}
                    disabled={prefsLoading || isSavingPref}
                    onChange={e => updatePreference('publicProfile', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">公开活动记录</p>
                    <p className="text-sm text-gray-600">显示您的点赞、评论等活动</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!preferences?.showActivity}
                    disabled={prefsLoading || isSavingPref}
                    onChange={e => updatePreference('showActivity', e.target.checked)}
                  />
                </div>
              </div>
            </BaseCard>
          )}
        </div>
      </div>
    </div>
  )
}
