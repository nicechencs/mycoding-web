'use client'

import React, { Suspense } from 'react'
import { cn } from '@/lib/utils'

// 加载状态组件类型
export type LoadingVariant = 'spinner' | 'skeleton' | 'pulse' | 'dots' | 'bars'

// 加载组件Props
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: LoadingVariant
  className?: string
  text?: string
  fullscreen?: boolean
}

// 尺寸映射
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

// 旋转加载器
export const SpinnerLoader: React.FC<{ size?: string; className?: string }> = ({ 
  size = 'w-6 h-6', 
  className 
}) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
      size,
      className
    )}
  />
)

// 脉冲加载器
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-2', className)}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
)

// 点状加载器
export const DotsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ 
          animationDelay: `${i * 0.1}s`,
          animationDuration: '1.4s'
        }}
      />
    ))}
  </div>
)

// 条状加载器
export const BarsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1 items-end', className)}>
    {[0, 1, 2, 3].map(i => (
      <div
        key={i}
        className="w-1 bg-blue-600 rounded animate-pulse"
        style={{ 
          height: `${12 + (i * 4)}px`,
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1.2s'
        }}
      />
    ))}
  </div>
)

// 骨架屏加载器
export const SkeletonLoader: React.FC<{ 
  className?: string
  lines?: number
  height?: string
}> = ({ 
  className, 
  lines = 3,
  height = '4'
}) => (
  <div className={cn('animate-pulse space-y-2', className)}>
    {Array.from({ length: lines }, (_, i) => (
      <div
        key={i}
        className={cn(
          'bg-gray-300 rounded',
          `h-${height}`,
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
)

// 主加载组件
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text,
  fullscreen = false,
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader size={sizeClasses[size]} className={className} />
      case 'pulse':
        return <PulseLoader className={className} />
      case 'dots':
        return <DotsLoader className={className} />
      case 'bars':
        return <BarsLoader className={className} />
      case 'skeleton':
        return <SkeletonLoader className={className} />
      default:
        return <SpinnerLoader size={sizeClasses[size]} className={className} />
    }
  }

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {renderLoader()}
          {text && (
            <p className="text-sm text-gray-600 animate-pulse">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-2">
        {renderLoader()}
        {text && (
          <p className="text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  )
}

// Suspense边界组件
export interface LoadingSuspenseProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingProps?: LoadingSpinnerProps
  errorBoundary?: boolean
}

export const LoadingSuspense: React.FC<LoadingSuspenseProps> = ({
  children,
  fallback,
  loadingProps = {},
  errorBoundary = false,
}) => {
  const defaultFallback = <LoadingSpinner {...loadingProps} />

  const content = (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )

  if (errorBoundary) {
    return <ErrorBoundary>{content}</ErrorBoundary>
  }

  return content
}

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LoadingSuspense ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">加载出错</h3>
          <p className="text-gray-600 mb-4">组件加载失败，请尝试刷新页面</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// 预设的页面级加载组件
export const PageLoader: React.FC<{ text?: string }> = ({ text = '页面加载中...' }) => (
  <LoadingSpinner
    size="lg"
    variant="spinner"
    text={text}
    className="text-blue-600"
  />
)

export const ComponentLoader: React.FC<{ text?: string }> = ({ text = '组件加载中...' }) => (
  <LoadingSpinner
    size="md"
    variant="dots"
    text={text}
  />
)

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg p-6 shadow-sm', className)}>
    <SkeletonLoader lines={4} />
  </div>
)

export const ListSkeleton: React.FC<{ 
  items?: number
  className?: string
}> = ({ 
  items = 3,
  className 
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export default LoadingSuspense