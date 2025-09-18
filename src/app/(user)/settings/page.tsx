'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserOverviewStats } from '@/hooks/use-users'
import { mockArticles } from '@/lib/mock/articles'
import { mockResources } from '@/lib/mock/resources'
import { InteractionService } from '@/lib/interaction/interaction-service'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

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
  const userId = user?.id
  const { overview } = useUserOverviewStats(userId || '')

  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    website: '',
    github: '',
    twitter: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'account' | 'notifications' | 'privacy'
  >('overview')

  

  // 统计数据（保持与现有卡片一致）
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
    ],
    [overview?.favoriteResourcesCount, overview?.articlesCount, overview?.receivedLikes]
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
    setIsLoading(true)

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    alert('设置已保存')
  }

  const tabs = [
    { id: 'overview', name: '概览', icon: '📊' },
    { id: 'profile', name: '个人资料', icon: '👤' },
    { id: 'account', name: '账号安全', icon: '🔐' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🔒' },
  ] as const

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
        <p className="text-gray-600">管理您的个人信息和偏好设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏导航 */}
        <div className="lg:col-span-1">
          <BaseCard>
            <nav className="space-y-1">
              {tabs.map(tab => (
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
            </nav>
          </BaseCard>
        </div>

        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 欢迎区域 */}
              <BaseCard>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      欢迎回来，{user?.name}！
                    </h1>
                    <p className="text-gray-600">继续您的编程学习之旅</p>
                  </div>
                </div>
              </BaseCard>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Link key={index} href={stat.href} className="h-full">
                    <BaseCard className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center space-x-4 h-full p-2">
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <span className="text-3xl">{stat.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-2xl font-bold ${stat.color} mb-1`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-base font-medium text-gray-900">
                            {stat.label}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {stat.description}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </BaseCard>
                  </Link>
                ))}
              </div>

              {/* 最近活动 */}
              <BaseCard>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    最近活动
                  </h2>
                  <Link
                    href="/my-favorites"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    查看全部
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <Link key={index} href={activity.href}>
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                        <span className="text-xl">{activity.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 hover:text-blue-600 transition-colors">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(activity.createdAt, {
                              locale: zhCN,
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </BaseCard>
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

          {activeTab === 'account' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  账号安全
                </h2>
                <p className="text-gray-600 mt-1">管理您的账号安全设置</p>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-yellow-800">
                      密码强度：中等
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    建议使用包含大小写字母、数字和特殊字符的强密码
                  </p>
                </div>

                <div>
                  <Button variant="outline" className="mb-4">
                    修改密码
                  </Button>
                  <p className="text-sm text-gray-500">
                    修改密码后需要重新登录所有设备
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    危险区域
                  </h3>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      删除账户
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      一旦删除账户，所有数据将永久丢失且无法恢复。
                    </p>
                    <Button variant="destructive" size="sm">
                      删除我的账户
                    </Button>
                  </div>
                </div>
              </div>
            </BaseCard>
          )}

          {activeTab === 'notifications' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  通知设置
                </h2>
                <p className="text-gray-600 mt-1">选择您希望接收的通知类型</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: '新文章推荐',
                    desc: '当有新的优质文章时通知我',
                    checked: true,
                  },
                  {
                    title: '收到评论',
                    desc: '当有人评论我的内容时通知我',
                    checked: true,
                  },
                  {
                    title: '收到点赞',
                    desc: '当有人点赞我的内容时通知我',
                    checked: false,
                  },
                  {
                    title: '系统更新',
                    desc: '接收系统功能更新和维护通知',
                    checked: true,
                  },
                  {
                    title: '营销推广',
                    desc: '接收活动和产品推广信息',
                    checked: false,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`notification-${index}`}
                      defaultChecked={item.checked}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`notification-${index}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {item.title}
                      </label>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button>保存通知设置</Button>
              </div>
            </BaseCard>
          )}

          {activeTab === 'privacy' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  隐私设置
                </h2>
                <p className="text-gray-600 mt-1">控制您的信息可见性</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: '公开个人资料',
                    desc: '允许其他用户查看您的个人资料',
                    checked: true,
                  },
                  {
                    title: '显示活动状态',
                    desc: '显示您的在线状态和最近活动',
                    checked: false,
                  },
                  {
                    title: '允许搜索',
                    desc: '允许通过邮箱或用户名搜索到您',
                    checked: true,
                  },
                  {
                    title: '数据分析',
                    desc: '允许我们使用您的数据来改善服务',
                    checked: true,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`privacy-${index}`}
                      defaultChecked={item.checked}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`privacy-${index}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {item.title}
                      </label>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button>保存隐私设置</Button>
              </div>
            </BaseCard>
          )}
        </div>
      </div>
    </div>
  )
}
