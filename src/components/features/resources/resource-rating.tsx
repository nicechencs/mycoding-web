'use client'

import { useState } from 'react'
import { ResourceRatingDistribution } from '@/types'

interface ResourceRatingProps {
  resourceId: string
  rating: number
  ratingCount: number
  distribution: ResourceRatingDistribution
  canRate?: boolean
  userRating?: number
}

export function ResourceRating({ 
  resourceId, 
  rating, 
  ratingCount, 
  distribution,
  canRate = true,
  userRating
}: ResourceRatingProps) {
  const [selectedRating, setSelectedRating] = useState(userRating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = async (rating: number) => {
    if (!canRate || isSubmitting) return
    
    setIsSubmitting(true)
    setSelectedRating(rating)
    
    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false)
    }, 1000)
  }

  const getRatingPercentage = (starLevel: number) => {
    const count = distribution[starLevel as keyof ResourceRatingDistribution]
    return ratingCount > 0 ? (count / ratingCount) * 100 : 0
  }

  const StarIcon = ({ filled, size = 'md' }: { filled: boolean; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-6 h-6'
    }
    
    return (
      <svg 
        className={`${sizeClasses[size]} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= Math.round(rating)} />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            基于 {ratingCount.toLocaleString()} 个评分
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600 w-12">
                  <span>{star}</span>
                  <StarIcon filled={true} size="sm" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercentage(star)}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {distribution[star as keyof ResourceRatingDistribution]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Rating */}
      {canRate && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedRating > 0 ? '您的评分' : '为这个资源评分'}
          </h4>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const shouldFill = star <= (hoverRating || selectedRating)
                return (
                  <button
                    key={star}
                    className={`transition-all duration-200 hover:scale-110 focus:outline-none ${
                      shouldFill ? 'text-yellow-400' : 'text-gray-300'
                    } ${canRate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onMouseEnter={() => canRate && setHoverRating(star)}
                    onMouseLeave={() => canRate && setHoverRating(0)}
                    onClick={() => handleRatingClick(star)}
                    disabled={isSubmitting}
                  >
                    <StarIcon filled={shouldFill} size="lg" />
                  </button>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedRating > 0 && (
                <span className="text-sm text-gray-600">
                  您给了 {selectedRating} 星
                </span>
              )}
              
              {isSubmitting && (
                <div className="flex items-center text-sm text-blue-600">
                  <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  提交中...
                </div>
              )}
            </div>
          </div>
          
          {selectedRating > 0 && !isSubmitting && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                感谢您的评分！您的反馈将帮助其他用户更好地了解这个资源。
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rating Guidelines */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">评分指南</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-start space-x-2">
            <span className="font-medium">⭐⭐⭐⭐⭐</span>
            <span>优秀 - 内容权威、实用性强、推荐给所有人</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">⭐⭐⭐⭐</span>
            <span>很好 - 内容质量高、有一定学习价值</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">⭐⭐⭐</span>
            <span>一般 - 内容普通、可以作为参考</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">⭐⭐</span>
            <span>较差 - 内容质量不高、不太推荐</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">⭐</span>
            <span>很差 - 内容有问题、不建议使用</span>
          </div>
        </div>
      </div>
    </div>
  )
}