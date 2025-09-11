import React from 'react'
import { cn } from '@/lib/utils'

// 统计项类型
interface StatItem {
  key: string
  value: number | string
  icon: React.ReactNode
  label?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  active?: boolean
  disabled?: boolean
}

// 预定义的图标组件
export const StatIcons = {
  view: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  ),
  like: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  comment: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  rating: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

// 表情符号图标（用于简洁显示）
export const EmojiIcons = {
  view: '👀',
  like: '❤️', 
  comment: '💬',
  rating: '⭐',
  share: '🔄'
}

interface ResourceStatsProps {
  stats: StatItem[]
  variant?: 'default' | 'compact' | 'emoji'
  size?: 'xs' | 'sm' | 'md'
  className?: string
  interactive?: boolean
}

export function ResourceStats({
  stats,
  variant = 'default',
  size = 'sm',
  className,
  interactive = true
}: ResourceStatsProps) {
  const baseClasses = "flex items-center text-gray-500"
  
  const sizeClasses = {
    xs: 'text-xs gap-3',
    sm: 'text-sm gap-4',
    md: 'text-base gap-5'
  }

  const itemClasses = cn(
    'flex items-center gap-1',
    interactive && 'hover:text-blue-600 transition-colors cursor-pointer'
  )

  const renderStatItem = (stat: StatItem) => {
    const {
      key,
      value,
      icon,
      label,
      className: itemClassName,
      onClick,
      active,
      disabled
    } = stat

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation() // 防止事件冒泡到父组件
      if (!disabled && onClick) {
        onClick(e)
      }
    }

    const itemContent = (
      <>
        {variant === 'emoji' ? (
          <span className="text-sm">{icon}</span>
        ) : (
          icon
        )}
        <span className={cn(
          'font-medium',
          active && 'text-blue-600',
          disabled && 'opacity-50'
        )}>
          {typeof value === 'number' && value > 999 
            ? value.toLocaleString() 
            : value}
          {label && ` ${label}`}
        </span>
      </>
    )

    if (onClick && interactive) {
      return (
        <button
          key={key}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            itemClasses,
            active && 'text-blue-600',
            disabled && 'cursor-not-allowed opacity-50',
            itemClassName
          )}
          data-no-click="true" // 防止触发父级点击事件
        >
          {itemContent}
        </button>
      )
    }

    return (
      <span
        key={key}
        className={cn(itemClasses, 'cursor-default', itemClassName)}
      >
        {itemContent}
      </span>
    )
  }

  return (
    <div className={cn(
      baseClasses,
      sizeClasses[size],
      className
    )}>
      {stats.map(renderStatItem)}
    </div>
  )
}

// 便捷的统计数据构建器
// 数值格式化工具函数
const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return value.toLocaleString()
  }
  return value.toString()
}

const formatRating = (value: number): string => {
  return value.toFixed(1)
}

// 统计配置类型
type StatsDataType = 'article' | 'resource' | 'vibe'

interface ArticleStatsData {
  viewCount: number
  likeCount: number
  commentCount: number
  onLike?: (e: React.MouseEvent<HTMLElement>) => void
  onComment?: (e: React.MouseEvent<HTMLElement>) => void
  isLiked?: boolean
}

interface ResourceStatsData {
  viewCount: number
  commentCount: number
  rating?: number
  onComment?: (e: React.MouseEvent<HTMLElement>) => void
}

interface VibeStatsData {
  likeCount: number
  commentCount: number
  onLike?: (e: React.MouseEvent<HTMLElement>) => void
  onComment?: (e: React.MouseEvent<HTMLElement>) => void
  isLiked?: boolean
}

/**
 * 类型安全的统计配置创建器
 */
export function createStatsConfig(
  type: 'article',
  data: ArticleStatsData
): StatItem[]
export function createStatsConfig(
  type: 'resource', 
  data: ResourceStatsData
): StatItem[]
export function createStatsConfig(
  type: 'vibe',
  data: VibeStatsData  
): StatItem[]
export function createStatsConfig(
  type: StatsDataType,
  data: ArticleStatsData | ResourceStatsData | VibeStatsData
): StatItem[] {
  switch (type) {
    case 'article': {
      const articleData = data as ArticleStatsData
      return [
        {
          key: 'view',
          value: formatNumber(articleData.viewCount),
          icon: EmojiIcons.view,
          label: '浏览'
        },
        {
          key: 'like',
          value: formatNumber(articleData.likeCount),
          icon: EmojiIcons.like,
          label: '点赞',
          onClick: articleData.onLike,
          active: articleData.isLiked,
          className: articleData.isLiked ? 'text-red-500' : undefined
        },
        {
          key: 'comment',
          value: formatNumber(articleData.commentCount),
          icon: EmojiIcons.comment,
          label: '评论',
          onClick: articleData.onComment
        }
      ]
    }

    case 'resource': {
      const resourceData = data as ResourceStatsData
      const baseStats: StatItem[] = [
        {
          key: 'view',
          value: formatNumber(resourceData.viewCount),
          icon: StatIcons.view,
          label: '浏览'
        },
        {
          key: 'comment',
          value: formatNumber(resourceData.commentCount),
          icon: StatIcons.comment,
          label: '评论',
          onClick: resourceData.onComment
        }
      ]

      if (resourceData.rating !== undefined) {
        baseStats.push({
          key: 'rating',
          value: formatRating(resourceData.rating),
          icon: StatIcons.rating,
          label: '评分',
          className: 'text-yellow-500 font-medium'
        })
      }

      return baseStats
    }

    case 'vibe': {
      const vibeData = data as VibeStatsData
      return [
        {
          key: 'like',
          value: formatNumber(vibeData.likeCount),
          icon: EmojiIcons.like,
          label: '点赞',
          onClick: vibeData.onLike,
          active: vibeData.isLiked,
          className: vibeData.isLiked ? 'text-red-500' : undefined
        },
        {
          key: 'comment',
          value: formatNumber(vibeData.commentCount),
          icon: EmojiIcons.comment,
          label: '评论',
          onClick: vibeData.onComment
        }
      ]
    }

    default:
      return []
  }
}

// 快捷配置创建器
export const StatsConfig = {
  /**
   * 创建文章统计配置
   */
  forArticle: (data: ArticleStatsData): StatItem[] => createStatsConfig('article', data),
  
  /**
   * 创建资源统计配置  
   */
  forResource: (data: ResourceStatsData): StatItem[] => createStatsConfig('resource', data),
  
  /**
   * 创建Vibe统计配置
   */
  forVibe: (data: VibeStatsData): StatItem[] => createStatsConfig('vibe', data)
}

export default ResourceStats