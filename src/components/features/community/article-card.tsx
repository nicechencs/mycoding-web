'use client'

import React from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { Avatar } from '@/components/ui/avatar'
import { ResourceStats, createStatsConfig } from '@/components/ui/resource-stats'
import { useArticleCardInteraction } from '@/hooks/use-card-interaction'
import { getCategoryClasses } from '@/lib/utils/category'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard = React.memo(
  ({ article }: ArticleCardProps) => {
    // 使用统一的卡片交互Hook
    const { getCardProps, handleStatsClick } = useArticleCardInteraction({
      enableDebugLog: process.env.NODE_ENV === 'development'
    })

    // 创建统计数据配置
    const statsConfig = createStatsConfig('article', {
      viewCount: article.viewCount || 0,
      likeCount: article.likeCount || 0,
      commentCount: article.commentCount || 0,
      onComment: handleStatsClick(article, 'comment'),
      // 这里可以添加点赞功能
      // onLike: handleLikeClick,
      // isLiked: article.isLiked
    })

    return (
      <div
        {...getCardProps(article)}
        className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 group transform hover:-translate-y-1 relative"
      >
        {/* 精选书签 */}
        {article.featured && (
          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md transform rotate-12 z-10">
            精
          </div>
        )}
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar size="md" theme="secondary">
            {article.author.name.charAt(0)}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">
              {article.author.name}
            </div>
            <div className="text-sm text-gray-500">
              {article.createdAt.toLocaleDateString('zh-CN')}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClasses(article.category)}`}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs text-gray-500">
              +{article.tags.length - 3} 更多
            </span>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <ResourceStats 
            stats={statsConfig}
            variant="emoji"
            size="xs"
            className="text-xs"
          />

          <Link
            href={`/posts/${article.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            阅读全文
            <svg
              className="w-3 h-3 ml-1"
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
          </Link>
        </div>

        {/* Time info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>发布于 {article.createdAt.toLocaleDateString('zh-CN')}</span>
          {article.updatedAt.getTime() !== article.createdAt.getTime() && (
            <span>更新于 {article.updatedAt.toLocaleDateString('zh-CN')}</span>
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // 自定义比较函数：只在关键属性变化时重新渲染
    const prev = prevProps.article
    const next = nextProps.article

    return (
      prev.id === next.id &&
      prev.title === next.title &&
      prev.viewCount === next.viewCount &&
      prev.likeCount === next.likeCount &&
      prev.commentCount === next.commentCount &&
      prev.featured === next.featured &&
      prev.slug === next.slug &&
      prev.updatedAt.getTime() === next.updatedAt.getTime()
    )
  }
)
