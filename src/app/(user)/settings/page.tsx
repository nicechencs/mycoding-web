'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  // 统计数据
  const stats = [
    {
      label: '已收藏资源',
      value: '12',
      icon: '📚',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '发表文章',
      value: '3',
      icon: '📝',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: '获得点赞',
      value: '28',
      icon: '👍',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: '学习天数',
      value: '45',
      icon: '🎯',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  // 最近活动
  const recentActivities = [
    {
      type: 'bookmark',
      title: '收藏了《React 性能优化指南》',
      time: '2小时前',
      icon: '📚',
    },
    {
      type: 'comment',
      title: '评论了《Vue 3 新特性详解》',
      time: '5小时前',
      icon: '💬',
    },
    {
      type: 'like',
      title: '点赞了《JavaScript 设计模式》',
      time: '1天前',
      icon: '👍',
    },
    {
      type: 'article',
      title: '发表了《TypeScript 实战总结》',
      time: '3天前',
      icon: '📝',
    },
  ]

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
    { id: 'account', name: '账户设置', icon: '⚙️' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🔒' },
  ] as const

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">账户设置</h1>
        <p className="text-gray-600">管理您的账户信息和偏好设置</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <BaseCard key={index} className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bg} mb-3`}
                    >
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </BaseCard>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 最近活动 */}
                <div className="lg:col-span-2">
                  <BaseCard>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">最近活动</h2>
                      <Link
                        href="/my-favorites"
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        查看全部
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                        >
                          <span className="text-xl">{activity.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BaseCard>
                </div>

                {/* 快捷操作 */}
                <div>
                  <BaseCard>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      快捷操作
                    </h2>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/posts">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          写文章
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/resources">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          探索资源
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/vibes">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                            />
                          </svg>
                          分享动态
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/my-favorites">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          我的收藏
                        </Link>
                      </Button>
                    </div>
                  </BaseCard>

                  {/* 学习进度 */}
                  <BaseCard className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      本周学习
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">学习目标</span>
                          <span className="text-gray-900">3/5 天</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        继续保持，距离本周目标还差2天！
                      </div>
                    </div>
                  </BaseCard>
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

          {activeTab === 'account' && (
            <BaseCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  账户设置
                </h2>
                <p className="text-gray-600 mt-1">管理您的账户安全</p>
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
