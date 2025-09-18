'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useArticle, useRelatedArticles } from '@/hooks/use-articles'
import { useIsFollowing, useUserActions } from '@/hooks/use-users'
import { PostActions } from '@/components/features/posts/post-actions'
import { PostComments } from '@/components/features/posts/post-comments'
import { Avatar } from '@/components/ui/avatar'
import { Markdown } from '@/components/ui/markdown'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function PostDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [activeTab, setActiveTab] = useState<'content' | 'comments'>('content')

  // 文章详情
  const {
    article,
    loading: articleLoading,
    error: articleError,
  } = useArticle(slug)

  // 相关文章
  const { articles: relatedArticles, loading: relatedLoading } =
    useRelatedArticles(slug, 3)

  // 统一使用详情对象的评论总数进行展示（不单独请求评论列表统计）

  // 关注作者状态与操作（使用mock服务）
  const authorId = article?.author?.id || ''
  const { isFollowing, loading: followStateLoading } = useIsFollowing(authorId)
  const { followUser, unfollowUser } = useUserActions()
  const [followLoading, setFollowLoading] = useState(false)

  const handleToggleFollow = async () => {
    if (!authorId) return
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(authorId)
      } else {
        await followUser(authorId)
      }
    } catch (e) {
      console.error('Follow toggle failed:', e)
    } finally {
      setFollowLoading(false)
    }
  }

  const loading = articleLoading || relatedLoading

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载文章详情...</p>
      </div>
    )
  }

  if (articleError) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">加载出错</h1>
        <p className="text-gray-600 mb-6">{String(articleError)}</p>
        <Link
          href="/posts"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回文章列表
        </Link>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">文章未找到</h1>
        <p className="text-gray-600 mb-6">抱歉，您访问的文章不存在或已被删除</p>
        <Link
          href="/posts"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回文章列表
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-blue-600 transition-colors">
          博客文章
        </Link>
        <span>/</span>
        <Link
          href={`/posts/articles?category=${encodeURIComponent(article.category)}`}
          className="hover:text-blue-600 transition-colors"
        >
          {article.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-3">
          {/* 文章头部信息 */}
          <article className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {article.title}
                </h1>
                {article.featured && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    精选文章
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* 作者信息 */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" theme="secondary">
                    {article.author.name.charAt(0)}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {article.author.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <time dateTime={article.createdAt.toISOString()}>
                        {formatDistanceToNow(article.createdAt, {
                          locale: zhCN,
                          addSuffix: true,
                        })}
                      </time>
                      {article.updatedAt !== article.createdAt && (
                        <>
                          <span>·</span>
                          <span>
                            更新于{' '}
                            {formatDistanceToNow(article.updatedAt, {
                              locale: zhCN,
                              addSuffix: true,
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 文章统计 */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {article.viewCount.toLocaleString()} 阅读
                  </span>
                  <span className="flex items-center gap-1">
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
                    {article.likeCount} 点赞
                  </span>
                  <span className="flex items-center gap-1">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {article.commentCount} 评论
                  </span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/posts/articles?tag=${encodeURIComponent(tag)}`}
                    className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* 交互按钮 */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <PostActions postId={article.id} />
            </div>

            {/* 标签页导航 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                文章内容
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'comments'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                评论 ({article.commentCount})
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {/* 文章正文 */}
              {activeTab === 'content' && (
                <div className="article-content">
                  <Markdown>{article.content}</Markdown>

                  {/* 文章底部信息 */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span>分类：</span>
                        <Link
                          href={`/posts/articles?category=${encodeURIComponent(article.category)}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {article.category}
                        </Link>
                      </div>
                      <div>
                        最后更新：
                        {formatDistanceToNow(article.updatedAt, {
                          locale: zhCN,
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 评论列表 */}
              {activeTab === 'comments' && (
                <PostComments
                  postId={article.id}
                  totalCount={article.commentCount}
                />
              )}
            </div>
          </article>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 作者信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">关于作者</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar size="lg" theme="secondary">
                {article.author.name.charAt(0)}
              </Avatar>
              <div>
                <h4 className="font-medium text-gray-900">
                  {article.author.name}
                </h4>
                <p className="text-sm text-gray-500">{article.author.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              热爱编程和技术分享的开发者，专注于现代Web开发技术栈。
            </p>
            <button
              onClick={handleToggleFollow}
              disabled={!authorId || followLoading || followStateLoading}
              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium 
                ${isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}
                ${followLoading || followStateLoading ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {followLoading || followStateLoading
                ? '处理中...'
                : isFollowing
                  ? '已关注'
                  : '关注作者'}
            </button>
          </div>

          {/* 目录 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">文章目录</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-blue-600 hover:text-blue-700 py-1"
              >
                App Router的主要特性
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1 ml-4"
              >
                基于文件系统的路由
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1 ml-4"
              >
                布局系统（Layouts）
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1"
              >
                服务端组件 vs 客户端组件
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1"
              >
                数据获取
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1"
              >
                性能优化
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-blue-600 py-1"
              >
                迁移策略
              </a>
            </div>
          </div>

          {/* 相关文章 */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">相关文章</h3>
              <div className="space-y-4">
                {relatedArticles.map(related => (
                  <Link
                    key={related.id}
                    href={`/posts/${related.slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {related.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {related.viewCount}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 文章统计 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">文章数据</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">阅读量</span>
                <span className="font-medium text-gray-900">
                  {article.viewCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">点赞数</span>
                <span className="font-medium text-gray-900">
                  {article.likeCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">评论数</span>
                <span className="font-medium text-gray-900">
                  {article.commentCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">发布时间</span>
                <span className="text-sm text-gray-900">
                  {article.createdAt.toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
