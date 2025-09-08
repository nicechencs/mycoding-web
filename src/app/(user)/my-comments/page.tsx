'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useUserComments } from '@/hooks/use-interactions'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Markdown } from '@/components/ui/markdown'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function MyCommentsPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<
    'all' | 'resource' | 'post' | 'vibe'
  >('all')

  // 获取用户评论
  const { comments: allComments, loading, refresh } = useUserComments()
  const { comments: resourceComments } = useUserComments('resource')
  const { comments: postComments } = useUserComments('post')
  const { comments: vibeComments } = useUserComments('vibe')

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">需要登录</h1>
        <p className="text-gray-600 mb-6">请先登录查看您的评论</p>
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

  const getCurrentComments = () => {
    switch (activeTab) {
      case 'resource':
        return resourceComments
      case 'post':
        return postComments
      case 'vibe':
        return vibeComments
      default:
        return allComments
    }
  }

  const comments = getCurrentComments()

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

  const getItemUrl = (comment: any) => {
    switch (comment.targetType) {
      case 'resource':
        return `/resources/${comment.targetId}`
      case 'post':
        return `/posts/${comment.targetId}`
      case 'vibe':
        return `/vibes/${comment.targetId}`
      default:
        return '#'
    }
  }

  return (
    <div className="container py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的评论</h1>
        <p className="text-gray-600">管理您发表的所有评论</p>
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
          全部 ({allComments.length})
        </button>
        <button
          onClick={() => setActiveTab('resource')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resource'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          资源评论 ({resourceComments.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'post'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          文章评论 ({postComments.length})
        </button>
        <button
          onClick={() => setActiveTab('vibe')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'vibe'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          动态评论 ({vibeComments.length})
        </button>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'all'
                ? '还没有发表过评论'
                : `还没有在${getTypeLabel(activeTab)}上评论过`}
            </h3>
            <p className="text-gray-600 mb-6">参与讨论，分享您的想法和见解！</p>
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
          comments.map((comment: any) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* 评论头部信息 */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getTypeColor(comment.targetType)}`}
                    >
                      {getTypeLabel(comment.targetType)}评论
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(comment.createdAt, {
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
                      <svg
                        className="w-4 h-4"
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
                      {comment.likeCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* 评论内容 */}
              <div className="p-6">
                <div className="flex gap-4">
                  <Avatar size="sm" theme="primary">
                    {comment.userName.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <Markdown>{comment.content}</Markdown>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <Link
                        href={getItemUrl(comment) as any}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        查看原文
                      </Link>
                      <button
                        onClick={() => {
                          // 这里可以实现编辑评论功能
                          console.log('编辑评论', comment.id)
                        }}
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          // 这里可以实现删除评论功能
                          if (confirm('确定要删除这条评论吗？')) {
                            console.log('删除评论', comment.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        删除
                      </button>
                    </div>

                    {/* 回复（如果有的话） */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-3 border-l-2 border-gray-100 pl-4">
                        <div className="text-sm text-gray-600 font-medium">
                          {comment.replies.length} 条回复
                        </div>
                        {comment.replies.slice(0, 2).map((reply: any) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 rounded p-3"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar size="xs" theme="secondary">
                                {reply.userName.charAt(0)}
                              </Avatar>
                              <span className="font-medium text-sm text-gray-900">
                                {reply.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(reply.createdAt, {
                                  locale: zhCN,
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                        {comment.replies.length > 2 && (
                          <Link
                            href={getItemUrl(comment) as any}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            查看全部 {comment.replies.length} 条回复
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 刷新按钮 */}
      {comments.length > 0 && (
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
