import React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
}

const sizeClasses = {
  narrow: 'max-w-4xl', // 896px - 适合阅读内容
  default: 'max-w-6xl', // 1152px - 标准页面宽度
  wide: 'max-w-7xl', // 1280px - 宽屏展示
}

export function PageContainer({ children, className, size = 'default' }: PageContainerProps) {
  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8 py-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// 导出预设的容器组件
export const PageContainerNarrow = ({ children, className }: Omit<PageContainerProps, 'size'>) => (
  <PageContainer size="narrow" className={className}>
    {children}
  </PageContainer>
)

export const PageContainerWide = ({ children, className }: Omit<PageContainerProps, 'size'>) => (
  <PageContainer size="wide" className={className}>
    {children}
  </PageContainer>
)