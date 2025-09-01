'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useResourceDetail } from '@/hooks/use-resource-detail'
import { RatingStars } from '@/components/features/resources/rating-stars'
import { Avatar } from '@/components/ui/avatar'
import { Markdown } from '@/components/ui/markdown'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ResourceCard } from '@/components/features/resources/resource-card'

export default function ResourceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [activeTab, setActiveTab] = useState<'description' | 'comments' | 'ratings'>('description')
  
  // 使用自定义 Hook 管理资源详情数据
  const {
    resource,
    comments,
    relatedResources,
    ratingDistribution,
    loading,
    error,
    refresh
  } = useResourceDetail(slug)
  
  // 加载状态
  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载资源详情...</p>
      </div>
    )
  }
  
  // 错误状态
  if (error) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">加载出错</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-x-4">
          <button 
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            重试
          </button>
          <Link 
            href="/resources" 
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            返回资源列表
          </Link>
        </div>
      </div>
    )
  }
  
  // 资源不存在
  if (!resource) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">资源未找到</h1>
        <p className="text-gray-600 mb-6">抱歉，您访问的资源不存在</p>
        <Link 
          href="/resources" 
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          返回资源列表
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-purple-600 transition-colors">首页</Link>
        <span>/</span>
        <Link href="/resources" className="hover:text-purple-600 transition-colors">资源</Link>
        <span>/</span>
        <span className="text-gray-900">{resource.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-2">
          {/* 资源头部信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
              {resource.featured && (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  精选资源
                </span>
              )}
            </div>

            <div className="text-gray-600 mb-6 leading-relaxed">
              <Markdown>{resource.description}</Markdown>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar size="sm" theme="secondary">
                  {resource.author.charAt(0)}
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{resource.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <RatingStars rating={resource.rating} totalCount={resource.ratingCount} />
              </div>

              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {resource.category}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {resource.viewCount.toLocaleString()} 浏览
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {resource.likeCount} 收藏
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {resource.commentCount} 评论
              </span>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                详细介绍
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'comments'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                评论 ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'ratings'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                评分详情
              </button>
            </div>

            <div className="p-6">
              {/* 详细介绍 */}
              {activeTab === 'description' && (
                <div>
                  {resource.detailedDescription ? (
                    <Markdown>{resource.detailedDescription}</Markdown>
                  ) : (
                    <Markdown>{resource.description}</Markdown>
                  )}
                  
                  {resource.screenshots && resource.screenshots.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">资源截图</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resource.screenshots.map((screenshot, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 评论列表 */}
              {activeTab === 'comments' && (
                <div>
                  {comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-start gap-3">
                            <Avatar size="sm" theme="tertiary">
                              {comment.userName.charAt(0)}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">{comment.userName}</span>
                                {comment.rating && (
                                  <RatingStars rating={comment.rating} size="xs" showCount={false} />
                                )}
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(comment.createdAt, { locale: zhCN, addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <button className={`flex items-center gap-1 text-sm ${comment.isLiked ? 'text-purple-600' : 'text-gray-500'} hover:text-purple-600 transition-colors`}>
                                  <svg className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  <span>{comment.likeCount}</span>
                                </button>
                                <button className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                                  回复
                                </button>
                              </div>
                              
                              {/* 回复列表 */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-100 pl-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex items-start gap-3">
                                      <Avatar size="xs" theme="tertiary">
                                        {reply.userName.charAt(0)}
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm text-gray-900">{reply.userName}</span>
                                          <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(reply.createdAt, { locale: zhCN, addSuffix: true })}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{reply.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-gray-600">还没有评论，来做第一个评论的人吧！</p>
                    </div>
                  )}
                </div>
              )}

              {/* 评分详情 */}
              {activeTab === 'ratings' && (
                <div>
                  <div className="flex items-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{resource.rating.toFixed(1)}</div>
                      <RatingStars rating={resource.rating} size="lg" showCount={false} />
                      <div className="text-sm text-gray-600 mt-1">{resource.ratingCount} 人评分</div>
                    </div>
                    
                    {ratingDistribution && (
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingDistribution[star as keyof typeof ratingDistribution]
                          const percentage = resource.ratingCount > 0 ? (count / resource.ratingCount) * 100 : 0
                          
                          return (
                            <div key={star} className="flex items-center gap-3 mb-2">
                              <span className="text-sm text-gray-600 w-8">{star}星</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 访问资源 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">访问资源</h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 bg-purple-600 text-white text-center font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              访问资源网站
              <svg className="inline-block w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">更新时间</span>
                <span className="text-gray-900">
                  {formatDistanceToNow(resource.updatedAt, { locale: zhCN, addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {/* 相关资源 */}
          {relatedResources.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">相关资源</h3>
              <div className="space-y-4">
                {relatedResources.map((related) => (
                  <Link
                    key={related.id}
                    href={`/resources/${related.slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <RatingStars rating={related.rating} size="xs" showCount={false} />
                      <span className="text-xs text-gray-500">{related.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 资源统计 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">资源统计</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">总浏览量</span>
                <span className="font-medium text-gray-900">{resource.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">收藏数</span>
                <span className="font-medium text-gray-900">{resource.likeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">评论数</span>
                <span className="font-medium text-gray-900">{resource.commentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">评分人数</span>
                <span className="font-medium text-gray-900">{resource.ratingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}