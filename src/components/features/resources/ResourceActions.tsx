'use client'

import { Heart, Star, MessageSquare, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLike, useFavorite, useRating } from '@/hooks/use-interactions'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface ResourceActionsProps {
  resourceId: string
  className?: string
}

export function ResourceActions({ resourceId, className }: ResourceActionsProps) {
  const { isAuthenticated } = useAuth()
  const { isLiked, likeCount, toggleLike, isLoading: isLikeLoading } = useLike(resourceId, 'resource')
  const { isFavorited, favoriteCount, toggleFavorite, isLoading: isFavoriteLoading } = useFavorite(resourceId, 'resource')
  const { userRating, averageRating, totalRatings, rateResource, isLoading: isRatingLoading } = useRating(resourceId)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRating = async (score: number) => {
    await rateResource(score)
  }

  const displayRating = hoveredRating || userRating || 0

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {/* 点赞按钮 */}
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={toggleLike}
        disabled={isLikeLoading}
        className="flex items-center gap-2"
      >
        <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
        <span>{likeCount || 0}</span>
      </Button>

      {/* 收藏按钮 */}
      <Button
        variant={isFavorited ? 'default' : 'outline'}
        size="sm"
        onClick={toggleFavorite}
        disabled={isFavoriteLoading}
        className="flex items-center gap-2"
      >
        <Star className={cn('h-4 w-4', isFavorited && 'fill-current')} />
        <span>{favoriteCount || 0}</span>
      </Button>

      {/* 评分 */}
      <div className="flex items-center gap-1">
        <div 
          className="flex items-center gap-0.5"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => handleRating(score)}
              onMouseEnter={() => setHoveredRating(score)}
              disabled={isRatingLoading || !isAuthenticated}
              className="p-0.5 transition-colors hover:text-yellow-500 disabled:cursor-not-allowed"
              title={!isAuthenticated ? '请先登录后评分' : `评分 ${score} 星`}
            >
              <Star
                className={cn(
                  'h-4 w-4 transition-colors',
                  score <= displayRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                )}
              />
            </button>
          ))}
        </div>
        {averageRating && (
          <span className="ml-2 text-sm text-muted-foreground">
            {averageRating.toFixed(1)} ({totalRatings})
          </span>
        )}
      </div>

      {/* 分享按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // 复制链接到剪贴板
          navigator.clipboard.writeText(window.location.href)
          // 可以添加一个提示
        }}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span>分享</span>
      </Button>
    </div>
  )
}