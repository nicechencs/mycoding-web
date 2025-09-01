'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  totalCount?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showCount?: boolean
  interactive?: boolean
  onRate?: (rating: number) => void
}

// 性能优化：将大小类映射提取到组件外部
const SIZE_CLASSES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
} as const

export const RatingStars = React.memo(({ 
  rating, 
  totalCount, 
  size = 'md', 
  showCount = true,
  interactive = false,
  onRate 
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  
  const displayRating = hoverRating || userRating || rating
  
  const handleClick = useCallback((value: number) => {
    if (!interactive) return
    setUserRating(value)
    onRate?.(value)
  }, [interactive, onRate])
  
  // 性能优化：memoize 星星数据计算
  const stars = useMemo(() => {
    return [1, 2, 3, 4, 5].map((value) => ({
      value,
      filled: value <= Math.floor(displayRating),
      partial: value === Math.ceil(displayRating) && displayRating % 1 !== 0
    }))
  }, [displayRating])
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <button
            key={star.value}
            onClick={() => handleClick(star.value)}
            onMouseEnter={() => interactive && setHoverRating(star.value)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={cn(
              'relative transition-transform',
              interactive && 'hover:scale-110 cursor-pointer'
            )}
          >
            <svg 
              className={cn(SIZE_CLASSES[size], 'text-gray-300')}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            
            {(star.filled || star.partial) && (
              <svg 
                className={cn(
                  SIZE_CLASSES[size], 
                  'absolute inset-0 text-yellow-400',
                  star.partial && 'overflow-hidden'
                )}
                style={star.partial ? { clipPath: `inset(0 ${100 - (displayRating % 1) * 100}% 0 0)` } : {}}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </button>
        ))}
      </div>
      
      {showCount && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="font-medium">{displayRating.toFixed(1)}</span>
          {totalCount && (
            <span className="text-gray-400">({totalCount.toLocaleString()})</span>
          )}
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数：只在关键属性变化时重新渲染
  return (
    prevProps.rating === nextProps.rating &&
    prevProps.totalCount === nextProps.totalCount &&
    prevProps.size === nextProps.size &&
    prevProps.showCount === nextProps.showCount &&
    prevProps.interactive === nextProps.interactive
    // onRate 函数变化时仍会重新渲染，这是合理的
  )
})