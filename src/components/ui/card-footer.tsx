import React from 'react'
import { cn } from '@/lib/utils'

// 卡片脚部组件
interface CardFooterProps {
  createdAt: Date
  updatedAt?: Date
  className?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

const formatDate = (date: Date) => {
  const now = new Date()
  const target = new Date(date)
  const diffInHours = (now.getTime() - target.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return target.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffInHours < 24 * 7) {
    return target.toLocaleDateString('zh-CN', { 
      month: 'numeric', 
      day: 'numeric' 
    })
  } else {
    return target.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric', 
      day: 'numeric'
    })
  }
}

export function CardFooter({ 
  createdAt, 
  updatedAt, 
  className,
  leftContent,
  rightContent 
}: CardFooterProps) {
  const showUpdated = updatedAt && 
    updatedAt.getTime() !== createdAt.getTime() &&
    (updatedAt.getTime() - createdAt.getTime()) > (1000 * 60 * 60) // 超过1小时的更新才显示

  return (
    <div className={cn('flex items-center justify-between text-xs text-gray-500', className)}>
      <div className="flex items-center space-x-2">
        {leftContent}
        <span>
          创建于 {formatDate(createdAt)}
        </span>
        {showUpdated && (
          <>
            <span>•</span>
            <span>
              更新于 {formatDate(updatedAt)}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {rightContent}
      </div>
    </div>
  )
}