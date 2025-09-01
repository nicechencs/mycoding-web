'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getArticleComments, getRelatedArticles } from '@/lib/mock/articles'
import { Avatar } from '@/components/ui/avatar'
import { Markdown } from '@/components/ui/markdown'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function PostDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const article = getArticleBySlug(slug)
  const [activeTab, setActiveTab] = useState<'content' | 'comments'>('content')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likeCount, setLikeCount] = useState(article?.likeCount || 0)
  
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

  const comments = getArticleComments(article.id)
  const relatedArticles = getRelatedArticles(article.slug, 3)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className="container py-8">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">首页</Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-blue-600 transition-colors">博客文章</Link>
        <span>/</span>
        <Link href={`/posts/articles?category=${encodeURIComponent(article.category)}`} className="hover:text-blue-600 transition-colors">
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

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>

              {/* 作者信息 */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" theme="secondary">
                    {article.author.name.charAt(0)}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <time dateTime={article.createdAt.toISOString()}>
                        {formatDistanceToNow(article.createdAt, { locale: zhCN, addSuffix: true })}
                      </time>
                      {article.updatedAt !== article.createdAt && (
                        <>
                          <span>·</span>
                          <span>更新于 {formatDistanceToNow(article.updatedAt, { locale: zhCN, addSuffix: true })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 文章统计 */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {article.viewCount.toLocaleString()} 阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likeCount} 点赞
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {comments.length} 评论
                  </span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag) => (
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
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isLiked ? '已点赞' : '点赞'} ({likeCount})
                </button>

                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isFavorited 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isFavorited ? '已收藏' : '收藏'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  分享
                </button>
              </div>
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
                评论 ({comments.length})
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
                        最后更新：{formatDistanceToNow(article.updatedAt, { locale: zhCN, addSuffix: true })}
                      </div>
                    </div>
                  </div>
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
                              {comment.author.name.charAt(0)}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">{comment.author.name}</span>
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(comment.createdAt, { locale: zhCN, addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  <span>点赞</span>
                                </button>
                                <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                  回复
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">💬</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">还没有评论</h3>
                      <p className="text-gray-600">来做第一个评论的人吧！</p>
                    </div>
                  )}
                </div>
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
                <h4 className="font-medium text-gray-900">{article.author.name}</h4>
                <p className="text-sm text-gray-500">{article.author.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              热爱编程和技术分享的开发者，专注于现代Web开发技术栈。
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              关注作者
            </button>
          </div>

          {/* 目录 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">文章目录</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-blue-600 hover:text-blue-700 py-1">
                App Router的主要特性
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1 ml-4">
                基于文件系统的路由
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1 ml-4">
                布局系统（Layouts）
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1">
                服务端组件 vs 客户端组件
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1">
                数据获取
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1">
                性能优化
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 py-1">
                迁移策略
              </a>
            </div>
          </div>

          {/* 相关文章 */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">相关文章</h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/posts/${related.slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{related.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{related.category}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                <span className="font-medium text-gray-900">{article.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">点赞数</span>
                <span className="font-medium text-gray-900">{likeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">评论数</span>
                <span className="font-medium text-gray-900">{comments.length}</span>
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