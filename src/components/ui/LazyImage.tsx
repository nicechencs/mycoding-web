'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// 加载状态类型
export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error'

// 懒加载选项配置
export interface LazyImageOptions {
  // Intersection Observer 配置
  rootMargin?: string
  threshold?: number
  // 是否启用预加载
  preload?: boolean
  // 加载失败重试次数
  retryCount?: number
  // 重试延迟时间（毫秒）
  retryDelay?: number
  // 是否显示渐入动画
  fadeIn?: boolean
  // 动画持续时间
  fadeInDuration?: number
}

// 组件Props
export interface LazyImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  // 占位符图片
  placeholder?: string
  // 错误时的备用图片
  fallback?: string
  // 懒加载配置
  options?: LazyImageOptions
  // 骨架屏自定义样式
  skeletonClassName?: string
  // 容器样式
  containerClassName?: string
  // 加载状态回调
  onLoadingStateChange?: (state: LoadingState) => void
  // 尺寸配置
  width?: number | string
  height?: number | string
  // 是否显示加载指示器
  showLoadingIndicator?: boolean
  // 自定义加载指示器
  loadingIndicator?: React.ReactNode
  // 自定义错误内容
  errorContent?: React.ReactNode
}

const defaultOptions: LazyImageOptions = {
  rootMargin: '50px',
  threshold: 0.1,
  preload: false,
  retryCount: 3,
  retryDelay: 1000,
  fadeIn: true,
  fadeInDuration: 300,
}

// 默认骨架屏组件
const DefaultSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
      'animate-[shimmer_1.5s_ease-in-out_infinite]',
      className
    )}
    style={{
      backgroundImage:
        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    }}
  />
)

// 默认加载指示器
const DefaultLoadingIndicator: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
)

// 默认错误内容
const DefaultErrorContent: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
    <svg
      className="w-12 h-12 mb-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="text-sm mb-2">图片加载失败</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
      >
        点击重试
      </button>
    )}
  </div>
)

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  options = {},
  className,
  containerClassName,
  skeletonClassName,
  onLoadingStateChange,
  width,
  height,
  showLoadingIndicator = true,
  loadingIndicator,
  errorContent,
  style,
  ...props
}) => {
  // 合并配置
  const config = { ...defaultOptions, ...options }

  // 状态管理
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [currentSrc, setCurrentSrc] = useState<string>(placeholder || '')
  const [retryCount, setRetryCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 更新加载状态
  const updateLoadingState = (state: LoadingState) => {
    setLoadingState(state)
    onLoadingStateChange?.(state)
  }

  // 加载图片
  const loadImage = (imageSrc: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = imageSrc
    })
  }

  // 处理图片加载
  const handleImageLoad = async () => {
    if (loadingState === 'loading') return

    updateLoadingState('loading')

    try {
      await loadImage(src)
      setCurrentSrc(src)
      updateLoadingState('loaded')
    } catch (error) {
      console.warn('LazyImage: Failed to load image', { src, error })

      if (retryCount < config.retryCount) {
        // 重试加载
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          handleImageLoad()
        }, config.retryDelay)
      } else {
        // 尝试使用备用图片
        if (fallback && fallback !== src) {
          try {
            await loadImage(fallback)
            setCurrentSrc(fallback)
            updateLoadingState('loaded')
          } catch {
            updateLoadingState('error')
          }
        } else {
          updateLoadingState('error')
        }
      }
    }
  }

  // 手动重试
  const handleRetry = () => {
    setRetryCount(0)
    updateLoadingState('idle')
    handleImageLoad()
  }

  // 设置Intersection Observer
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: config.rootMargin,
        threshold: config.threshold,
      }
    )

    observer.observe(container)
    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [config.rootMargin, config.threshold])

  // 预加载处理
  useEffect(() => {
    if (config.preload && loadingState === 'idle') {
      handleImageLoad()
    }
  }, [config.preload])

  // 可见时开始加载
  useEffect(() => {
    if (isVisible && loadingState === 'idle' && !config.preload) {
      handleImageLoad()
    }
  }, [isVisible])

  // 计算样式
  const containerStyle: React.CSSProperties = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: config.fadeIn
      ? `opacity ${config.fadeInDuration}ms ease-in-out`
      : undefined,
    opacity: loadingState === 'loaded' ? 1 : 0,
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', containerClassName)}
      style={containerStyle}
    >
      {/* 骨架屏 */}
      {(loadingState === 'idle' || loadingState === 'loading') &&
        !currentSrc && (
          <DefaultSkeleton
            className={cn('absolute inset-0 w-full h-full', skeletonClassName)}
          />
        )}

      {/* 占位符图片 */}
      {currentSrc && loadingState !== 'loaded' && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            className
          )}
          style={{ opacity: 0.6 }}
        />
      )}

      {/* 主图片 */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn('absolute inset-0', className)}
          style={imageStyle}
          {...props}
        />
      )}

      {/* 加载指示器 */}
      {loadingState === 'loading' &&
        showLoadingIndicator &&
        (loadingIndicator || <DefaultLoadingIndicator />)}

      {/* 错误状态 */}
      {loadingState === 'error' &&
        (errorContent || <DefaultErrorContent onRetry={handleRetry} />)}
    </div>
  )
}

// 预设变体
export const LazyImageRounded: React.FC<LazyImageProps> = props => (
  <LazyImage {...props} className={cn('rounded-lg', props.className)} />
)

export const LazyImageCircle: React.FC<LazyImageProps> = props => (
  <LazyImage {...props} className={cn('rounded-full', props.className)} />
)

export const LazyImageAvatar: React.FC<
  LazyImageProps & { size?: 'sm' | 'md' | 'lg' | 'xl' }
> = ({ size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <LazyImage
      {...props}
      containerClassName={cn(
        sizeClasses[size],
        'rounded-full',
        props.containerClassName
      )}
    />
  )
}

export default LazyImage
