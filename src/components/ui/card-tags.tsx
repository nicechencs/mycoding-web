import React from 'react'
import { cn } from '@/lib/utils'
import { getCategoryColor } from '@/lib/utils/category'

// 标签类型
interface Tag {
  label: string
  color?: 'default' | 'blue' | 'red'
  variant?: 'default' | 'outline' | 'filled'
  onClick?: () => void
}

// 标签颜色配置 - 统一蓝色系
const tagColors = {
  default: {
    default: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
    filled: 'bg-gray-600 text-white hover:bg-gray-700'
  },
  blue: {
    default: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    outline: 'border border-blue-200 text-blue-600 hover:bg-blue-50', 
    filled: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  red: {
    default: 'bg-red-100 text-red-700 hover:bg-red-200',
    outline: 'border border-red-300 text-red-600 hover:bg-red-50',
    filled: 'bg-red-600 text-white hover:bg-red-700'
  }
}

// 单个标签组件
interface TagProps extends Tag {
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function Tag({ 
  label, 
  color = 'default', 
  variant = 'default',
  size = 'sm',
  onClick,
  className 
}: TagProps) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs', 
    md: 'px-3 py-1 text-sm'
  }
  
  const isClickable = !!onClick
  
  return (
    <span
      className={cn(
        'inline-block rounded transition-colors font-medium',
        sizeClasses[size],
        tagColors[color][variant],
        isClickable ? 'cursor-pointer' : 'cursor-default',
        className
      )}
      onClick={onClick}
    >
      {label.startsWith('#') ? label : `#${label}`}
    </span>
  )
}

// 标签组组件
interface CardTagsProps {
  tags: (string | Tag)[]
  maxVisible?: number
  size?: 'xs' | 'sm' | 'md'
  color?: 'default' | 'blue' | 'red'
  variant?: 'default' | 'outline' | 'filled'
  onTagClick?: (tag: string) => void
  className?: string
  showMoreText?: string
}

export function CardTags({ 
  tags, 
  maxVisible = 3, 
  size = 'sm',
  color = 'default',
  variant = 'default',
  onTagClick,
  className,
  showMoreText = '更多'
}: CardTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }
  
  const visibleTags = tags.slice(0, maxVisible)
  const remainingCount = tags.length - maxVisible
  
  const renderTag = (tag: string | Tag, index: number) => {
    if (typeof tag === 'string') {
      return (
        <Tag
          key={`${tag}-${index}`}
          label={tag}
          color={color}
          variant={variant}
          size={size}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
        />
      )
    } else {
      return (
        <Tag
          key={`${tag.label}-${index}`}
          {...tag}
          size={size}
          onClick={tag.onClick || (onTagClick ? () => onTagClick(tag.label) : undefined)}
        />
      )
    }
  }
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleTags.map(renderTag)}
      
      {remainingCount > 0 && (
        <span className={cn(
          'inline-block px-2 py-1 text-xs text-gray-500',
          size === 'xs' && 'px-2 py-0.5',
          size === 'md' && 'px-3 py-1 text-sm'
        )}>
          +{remainingCount} {showMoreText}
        </span>
      )}
    </div>
  )
}

// 预设的标签组合

// 资源标签 - 蓝色主题
export function ResourceTags({ 
  tags, 
  maxVisible, 
  onTagClick, 
  className 
}: Omit<CardTagsProps, 'color' | 'variant'>) {
  return (
    <CardTags 
      tags={tags}
      maxVisible={maxVisible}
      color="blue"
      variant="default"
      onTagClick={onTagClick}
      className={className}
    />
  )
}

// 文章标签 - 蓝色主题，带点击效果
export function ArticleTags({ 
  tags, 
  maxVisible, 
  onTagClick, 
  className 
}: Omit<CardTagsProps, 'color' | 'variant'>) {
  return (
    <CardTags 
      tags={tags}
      maxVisible={maxVisible}
      color="blue"
      variant="default"
      onTagClick={onTagClick}
      className={className}
    />
  )
}

// Vibe标签 - 蓝色主题
export function VibeTags({ 
  tags, 
  maxVisible, 
  onTagClick, 
  className 
}: Omit<CardTagsProps, 'color' | 'variant'>) {
  return (
    <CardTags 
      tags={tags}
      maxVisible={maxVisible}
      color="blue"
      variant="default"
      onTagClick={onTagClick}
      className={className}
    />
  )
}

// 分类标签 - 特殊的分类显示
interface CategoryBadgeProps {
  category: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
  onClick?: () => void
}

export function CategoryBadge({ category, size = 'sm', className, onClick }: CategoryBadgeProps) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }
  
  const colors = getCategoryColor(category)
  const isClickable = !!onClick
  
  return (
    <span
      className={cn(
        'inline-block font-medium rounded-full',
        sizeClasses[size],
        colors.bg,
        colors.text,
        isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
        className
      )}
      onClick={onClick}
    >
      {category}
    </span>
  )
}