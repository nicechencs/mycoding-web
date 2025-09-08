'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user } = useUser()

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 欢迎区域 */}
      <div className="mb-8">
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
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                href="/dashboard"
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
                <Link href="/settings">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  账户设置
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
  )
}
