'use client'

import React from 'react'
import { useResourceRating } from '@/hooks/use-interactions'

interface ResourceRatingStatsProps {
  resourceId: string
  className?: string
}

export const ResourceRatingStats = React.memo(function ResourceRatingStats({
  resourceId,
  className = ''
}: ResourceRatingStatsProps) {
  const { ratingStats, loading } = useResourceRating(resourceId)

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    )
  }

  if (ratingStats.totalRatings === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-500 text-sm">
          还没有评分，成为第一个评分的人！
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {ratingStats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(ratingStats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 fill-current'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">
            基于 {ratingStats.totalRatings} 个评分
          </div>
          
          {/* 评分分布 */}
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-600">{star}</span>
                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${ratingStats.totalRatings > 0 
                        ? (ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] / ratingStats.totalRatings) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="w-6 text-gray-600 text-right">
                  {ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})