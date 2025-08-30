import React from 'react'
import { cn } from '@/lib/utils'

// 基础Card组件
interface BaseCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const cardVariants = {
  default: 'bg-white border border-gray-200 rounded-lg',
  hover: 'bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 group',
  elevated: 'bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow'
}

const cardPadding = {
  sm: 'p-4',
  md: 'p-6', 
  lg: 'p-8'
}

export function BaseCard({ 
  children, 
  className, 
  variant = 'default', 
  padding = 'md',
  onClick 
}: BaseCardProps) {
  return (
    <div 
      className={cn(
        cardVariants[variant],
        cardPadding[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Card容器组件 - 用于统一的卡片布局
interface CardProps extends BaseCardProps {
  header?: React.ReactNode
  content?: React.ReactNode
  tags?: React.ReactNode
  stats?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ 
  header, 
  content, 
  tags, 
  stats, 
  footer, 
  children,
  ...props 
}: CardProps) {
  return (
    <BaseCard {...props}>
      {header && (
        <div className="mb-4">
          {header}
        </div>
      )}
      
      {content && (
        <div className="mb-4">
          {content}
        </div>
      )}
      
      {tags && (
        <div className="mb-4">
          {tags}
        </div>
      )}
      
      {stats && (
        <div className="pt-4 border-t border-gray-100">
          {stats}
        </div>
      )}
      
      {footer && (
        <div className="mt-3 text-xs text-gray-400">
          {footer}
        </div>
      )}
      
      {children}
    </BaseCard>
  )
}

// Card Section - 用于分隔卡片内容区域
interface CardSectionProps {
  children: React.ReactNode
  className?: string
  border?: boolean
}

export function CardSection({ children, className, border }: CardSectionProps) {
  return (
    <div className={cn(
      border && 'pt-4 border-t border-gray-100',
      className
    )}>
      {children}
    </div>
  )
}