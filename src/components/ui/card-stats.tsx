import React from 'react'
import { cn } from '@/lib/utils'

// 统计数据项
interface StatItem {
  label: string
  value: number
  icon?: 'view' | 'like' | 'comment' | 'share' | 'bookmark' | React.ReactNode
  color?: 'default' | 'blue' | 'red' | 'green' | 'yellow'
  onClick?: () => void
  active?: boolean
}

// 图标映射
const iconMap = {
  view: '👀',
  like: '❤️',
  comment: '💬',
  share: '🔗',
  bookmark: '🔖',
}

// SVG图标组件
const SvgIcon = ({
  type,
  className,
  filled = false,
}: {
  type: string
  className?: string
  filled?: boolean
}) => {
  const iconProps = {
    className: cn('w-5 h-5', className),
    fill: filled ? 'currentColor' : 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
  }

  switch (type) {
    case 'heart':
      return (
        <svg {...iconProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )
    case 'comment':
      return (
        <svg {...iconProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )
    case 'share':
      return (
        <svg {...iconProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      )
    case 'bookmark':
      return (
        <svg {...iconProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )
    default:
      return null
  }
}

// 颜色类配置
const colorMap = {
  default: 'text-gray-500 hover:text-gray-700',
  blue: 'text-gray-500 hover:text-blue-600',
  red: 'text-gray-500 hover:text-red-600',
  green: 'text-gray-500 hover:text-green-600',
  yellow: 'text-gray-500 hover:text-yellow-600',
}

// 单个统计项组件
function StatItemComponent({
  label,
  value,
  icon,
  color = 'default',
  onClick,
  active,
}: StatItem) {
  const isClickable = !!onClick

  // 处理图标渲染
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon
    }

    if (typeof icon === 'string' && icon in iconMap) {
      return <span>{iconMap[icon as keyof typeof iconMap]}</span>
    }

    // SVG图标
    if (icon === 'like') {
      return (
        <SvgIcon
          type="heart"
          className={cn('w-5 h-5', active && 'fill-current')}
          filled={active}
        />
      )
    }

    if (icon === 'comment') {
      return <SvgIcon type="comment" className="w-5 h-5" />
    }

    if (icon === 'share') {
      return <SvgIcon type="share" className="w-5 h-5" />
    }

    if (icon === 'bookmark') {
      return <SvgIcon type="bookmark" className="w-5 h-5" />
    }

    return null
  }

  return (
    <button
      className={cn(
        'flex items-center space-x-2 text-sm transition-colors',
        isClickable
          ? active
            ? {
                like: 'text-red-500',
                view: colorMap.blue,
                comment: colorMap.blue,
                share: colorMap.green,
                bookmark: colorMap.default,
              }[icon as string] || colorMap[color]
            : colorMap[color]
          : 'text-gray-500 cursor-default'
      )}
      onClick={onClick}
      disabled={!isClickable}
    >
      {renderIcon()}
      <span>{value}</span>
    </button>
  )
}

// 主要的CardStats组件
interface CardStatsProps {
  stats: StatItem[]
  layout?: 'horizontal' | 'justified'
  size?: 'sm' | 'md'
  className?: string
  rightContent?: React.ReactNode
}

export function CardStats({
  stats,
  layout = 'horizontal',
  size = 'md',
  className,
  rightContent,
}: CardStatsProps) {
  const containerClass =
    layout === 'justified'
      ? 'flex items-center justify-between'
      : 'flex items-center space-x-4'

  const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn(containerClass, sizeClass, className)}>
      <div
        className={cn(
          layout === 'justified'
            ? 'flex items-center space-x-4'
            : 'flex items-center space-x-4'
        )}
      >
        {stats.map((stat, index) => (
          <StatItemComponent key={`${stat.label}-${index}`} {...stat} />
        ))}
      </div>

      {rightContent && <div className="flex items-center">{rightContent}</div>}
    </div>
  )
}

// 预设的统计组合
export function ArticleStats({
  viewCount,
  likeCount,
  commentCount,
  onView,
  onLike,
  onComment,
  rightContent,
  className,
}: {
  viewCount: number
  likeCount: number
  commentCount: number
  onView?: () => void
  onLike?: () => void
  onComment?: () => void
  rightContent?: React.ReactNode
  className?: string
}) {
  const stats: StatItem[] = [
    {
      label: '查看',
      value: viewCount,
      icon: 'view',
      color: 'blue',
      onClick: onView,
    },
    {
      label: '点赞',
      value: likeCount,
      icon: 'like',
      color: 'red',
      onClick: onLike,
    },
    {
      label: '评论',
      value: commentCount,
      icon: 'comment',
      color: 'green',
      onClick: onComment,
    },
  ]

  return (
    <CardStats
      stats={stats}
      layout="justified"
      rightContent={rightContent}
      className={className}
    />
  )
}

// Vibe类型的统计
export function VibeStats({
  likeCount,
  commentCount,
  shareCount,
  isLiked,
  onLike,
  onComment,
  onShare,
  onBookmark,
  className,
}: {
  likeCount: number
  commentCount: number
  shareCount: number
  isLiked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}) {
  const stats: StatItem[] = [
    {
      label: '点赞',
      value: likeCount,
      icon: 'like',
      color: 'red',
      onClick: onLike,
      active: isLiked,
    },
    {
      label: '评论',
      value: commentCount,
      icon: 'comment',
      color: 'blue',
      onClick: onComment,
    },
    {
      label: '分享',
      value: shareCount,
      icon: 'share',
      color: 'green',
      onClick: onShare,
    },
  ]

  return (
    <CardStats
      stats={stats}
      layout="horizontal"
      rightContent={
        <button
          className="flex items-center space-x-2 hover:text-gray-700 transition-colors ml-auto text-sm text-gray-500"
          onClick={onBookmark}
        >
          <SvgIcon type="bookmark" className="w-5 h-5" />
        </button>
      }
      className={className}
    />
  )
}
