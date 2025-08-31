import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// 卡片内容组件
interface CardContentProps {
  title: string
  description?: string
  link?: {
    href: string
    external?: boolean
    target?: string
  }
  titleSize?: 'sm' | 'md' | 'lg'
  descriptionLines?: number
  className?: string
  onTitleClick?: () => void
}

const titleSizes = {
  sm: 'text-base font-semibold',
  md: 'text-lg font-bold', 
  lg: 'text-xl font-bold'
}

const getLineClampClass = (lines?: number) => {
  if (!lines) return ''
  switch (lines) {
    case 1: return 'line-clamp-1'
    case 2: return 'line-clamp-2'
    case 3: return 'line-clamp-3'
    default: return 'line-clamp-3'
  }
}

export function CardContent({ 
  title, 
  description, 
  link,
  titleSize = 'sm',
  descriptionLines = 3,
  className,
  onTitleClick
}: CardContentProps) {
  const titleContent = (
    <h3 className={cn(
      titleSizes[titleSize],
      'text-gray-900 mb-3 leading-snug',
      getLineClampClass(2),
      (link || onTitleClick) && 'group-hover:text-blue-600 transition-colors cursor-pointer',
      className
    )}>
      {title}
    </h3>
  )
  
  const handleTitleClick = () => {
    if (onTitleClick) {
      onTitleClick()
    }
  }
  
  const renderTitle = () => {
    if (link) {
      if (link.external) {
        return (
          <a 
            href={link.href}
            target={link.target || '_blank'}
            rel="noopener noreferrer"
            className="block group"
          >
            {titleContent}
          </a>
        )
      } else {
        return (
          <Link href={link.href} className="block group">
            {titleContent}
          </Link>
        )
      }
    }
    
    if (onTitleClick) {
      return (
        <div className="block group cursor-pointer" onClick={handleTitleClick}>
          {titleContent}
        </div>
      )
    }
    
    return titleContent
  }
  
  return (
    <div>
      {renderTitle()}
      
      {description && (
        <p className={cn(
          'text-gray-600 text-sm leading-relaxed',
          getLineClampClass(descriptionLines)
        )}>
          {description}
        </p>
      )}
    </div>
  )
}

// 资源内容 - 不带链接的标题
export function ResourceContent({ 
  title, 
  description, 
  className 
}: Omit<CardContentProps, 'link' | 'onTitleClick' | 'titleSize'>) {
  return (
    <CardContent 
      title={title}
      description={description}
      titleSize="sm"
      descriptionLines={3}
      className={className}
    />
  )
}

// 文章内容 - 带链接的标题
export function ArticleContent({ 
  title, 
  excerpt, 
  slug, 
  className 
}: {
  title: string
  excerpt: string
  slug: string
  className?: string
}) {
  return (
    <CardContent 
      title={title}
      description={excerpt}
      link={{ href: `/posts/${slug}` }}
      titleSize="md"
      descriptionLines={3}
      className={className}
    />
  )
}

// Vibe内容 - 简单的文本内容
interface VibeContentProps {
  content: string
  images?: string[]
  className?: string
}

export function VibeContent({ content, images, className }: VibeContentProps) {
  return (
    <div className={className}>
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">
        {content}
      </p>
      
      {/* 图片展示 */}
      {images && images.length > 0 && (
        <div className="mb-4">
          <div className={cn(
            'grid gap-2',
            images.length === 1 ? 'grid-cols-1' :
            images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          )}>
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                {/* 这里可以替换为真实的图片组件 */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">图片 {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 卡片底部信息组件
interface CardFooterProps {
  createdAt?: Date
  updatedAt?: Date
  showCreated?: boolean
  showUpdated?: boolean
  customContent?: React.ReactNode
  className?: string
}

export function CardFooter({ 
  createdAt, 
  updatedAt, 
  showCreated = true, 
  showUpdated = true,
  customContent,
  className 
}: CardFooterProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN')
  }
  
  if (customContent) {
    return (
      <div className={cn('text-xs text-gray-400', className)}>
        {customContent}
      </div>
    )
  }
  
  const showBothDates = showCreated && showUpdated && createdAt && updatedAt
  const showOnlyCreated = showCreated && createdAt && (!showUpdated || !updatedAt)
  const showOnlyUpdated = showUpdated && updatedAt && (!showCreated || !createdAt)
  
  if (!createdAt && !updatedAt) {
    return null
  }
  
  return (
    <div className={cn('flex items-center text-xs text-gray-400', className)}>
      {showBothDates && (
        <>
          <span>创建于 {formatDate(createdAt)}</span>
          {updatedAt.getTime() !== createdAt.getTime() && (
            <span className="ml-auto">更新于 {formatDate(updatedAt)}</span>
          )}
        </>
      )}
      
      {showOnlyCreated && (
        <span>创建于 {formatDate(createdAt)}</span>
      )}
      
      {showOnlyUpdated && (
        <span>更新于 {formatDate(updatedAt)}</span>
      )}
    </div>
  )
}

// 卡片操作区域
interface CardActionsProps {
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    external?: boolean
    variant?: 'default' | 'primary' | 'secondary'
  }
  secondaryActions?: Array<{
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }>
  className?: string
}

export function CardActions({ primaryAction, secondaryActions, className }: CardActionsProps) {
  const buttonVariants = {
    default: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
  
  const renderPrimaryAction = () => {
    if (!primaryAction) return null
    
    const variant = primaryAction.variant || 'default'
    const baseClasses = 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors'
    const variantClasses = buttonVariants[variant]
    
    const content = (
      <>
        {primaryAction.label}
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </>
    )
    
    if (primaryAction.href) {
      if (primaryAction.external) {
        return (
          <a
            href={primaryAction.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(baseClasses, variantClasses)}
          >
            {content}
          </a>
        )
      } else {
        return (
          <Link
            href={primaryAction.href}
            className={cn(baseClasses, variantClasses)}
          >
            {content}
          </Link>
        )
      }
    }
    
    return (
      <button
        onClick={primaryAction.onClick}
        className={cn(baseClasses, variantClasses)}
      >
        {content}
      </button>
    )
  }
  
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center space-x-2">
        {secondaryActions?.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
      
      {renderPrimaryAction()}
    </div>
  )
}