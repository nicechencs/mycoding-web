import React from 'react'
import { Avatar } from './avatar'
import { cn } from '@/lib/utils'

// 卡片头部组件
interface CardHeaderProps {
  author: {
    name: string
    avatar?: string
  }
  timestamp?: Date | string
  category?: string
  featured?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'stacked'
  className?: string
  rightContent?: React.ReactNode
  onAuthorClick?: () => void
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    '前端开发': 'bg-blue-100 text-blue-700',
    '后端开发': 'bg-green-100 text-green-700', 
    '数据库': 'bg-purple-100 text-purple-700',
    '移动开发': 'bg-orange-100 text-orange-700',
    '人工智能': 'bg-red-100 text-red-700',
    '云计算': 'bg-cyan-100 text-cyan-700',
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

const formatTime = (date: Date | string) => {
  if (typeof date === 'string') {
    return date
  }
  
  const now = new Date()
  const targetDate = new Date(date)
  const diff = now.getTime() - targetDate.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return targetDate.toLocaleDateString('zh-CN')
}

// Avatar尺寸映射
const avatarSizeMap = {
  sm: 'sm' as const,
  md: 'md' as const, 
  lg: 'lg' as const
}

export function CardHeader({
  author,
  timestamp,
  category,
  featured,
  size = 'md',
  layout = 'horizontal',
  className,
  rightContent,
  onAuthorClick
}: CardHeaderProps) {
  if (layout === 'stacked') {
    // 垂直布局 - 用于VibeCard的样式
    return (
      <div className={cn('flex items-start space-x-3', className)}>
        <Avatar 
          size={avatarSizeMap[size]} 
          theme="primary"
          onClick={onAuthorClick}
          className={onAuthorClick ? 'cursor-pointer' : undefined}
        >
          {author.name.charAt(0)}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span 
              className={cn(
                'font-medium text-gray-900',
                onAuthorClick && 'cursor-pointer hover:text-blue-600'
              )}
              onClick={onAuthorClick}
            >
              {author.name}
            </span>
            {timestamp && (
              <span className="text-sm text-gray-500">
                {formatTime(timestamp)}
              </span>
            )}
          </div>
          
          {category && (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(category)}`}>
              {category}
            </span>
          )}
        </div>
        
        {rightContent && (
          <div className="flex items-center space-x-2">
            {rightContent}
          </div>
        )}
      </div>
    )
  }
  
  // 水平布局 - 用于ArticleCard和ResourceCard
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Avatar 
        size={avatarSizeMap[size]} 
        theme="secondary"
        onClick={onAuthorClick}
        className={onAuthorClick ? 'cursor-pointer' : undefined}
      >
        {author.name.charAt(0)}
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{author.name}</div>
        {timestamp && (
          <div className="text-sm text-gray-500">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {category && (
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(category)}`}>
            {category}
          </span>
        )}
        
        {featured && (
          <div className="w-2 h-2 bg-red-500 rounded-full" title="精选内容"></div>
        )}
        
        {rightContent}
      </div>
    </div>
  )
}

// 简化版本 - 只显示作者和分类
interface SimpleCardHeaderProps {
  category?: string
  featured?: boolean
  rating?: number
  className?: string
  rightContent?: React.ReactNode
}

export function SimpleCardHeader({ category, featured, rating, className, rightContent }: SimpleCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      {category && (
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
          {category}
        </span>
      )}
      
      <div className="flex items-center space-x-2">
        {rating && (
          <div className="flex items-center text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium ml-1">{rating}</span>
          </div>
        )}
        
        {featured && (
          <div className="w-2 h-2 bg-red-500 rounded-full" title="精选内容"></div>
        )}
        
        {rightContent}
      </div>
    </div>
  )
}