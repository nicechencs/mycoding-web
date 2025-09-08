'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLike, useFavorite, useRating } from '@/hooks/use-interactions'
import {
  LoginPromptTooltip,
  LoginPromptModal,
} from '@/components/ui/login-prompt'
import { RatingStars } from './rating-stars'

interface ResourceActionsProps {
  resourceId: string
  className?: string
  showLabels?: boolean
}

export function ResourceActions({
  resourceId,
  className = '',
  showLabels = true,
}: ResourceActionsProps) {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)

  // 使用交互 hooks
  const {
    isLiked,
    likeCount,
    loading: likeLoading,
    toggleLike,
    canLike,
  } = useLike(resourceId, 'resource')
  const {
    isFavorited,
    favoriteCount,
    loading: favoriteLoading,
    toggleFavorite,
    canFavorite,
  } = useFavorite(resourceId, 'resource')
  const {
    userRating,
    averageRating,
    ratingCount,
    loading: ratingLoading,
    submitRating,
    canRate,
  } = useRating(resourceId, 'resource')

  // 处理需要登录的操作
  const handleAuthRequired = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLogin = () => {
    // 这里应该跳转到登录页面或打开登录模态框
    // 可以根据实际的路由方案调整
    window.location.href = '/login'
  }

  const handleRatingSubmit = (rating: number) => {
    if (canRate && !ratingLoading) {
      submitRating(rating)
      setShowRatingModal(false)
    }
  }

  return (
    <>
      <div className={`flex items-center gap-4 ${className}`}>
        {/* 点赞按钮 */}
        {canLike ? (
          <button
            onClick={() => handleAuthRequired(toggleLike)}
            disabled={likeLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
              ${
                isLiked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
              }
              ${likeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            {likeLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            {showLabels && (
              <span className="font-medium">
                {isLiked ? '已点赞' : '点赞'}{' '}
                {likeCount > 0 && `(${likeCount})`}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可点赞">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {showLabels && (
                <span className="font-medium">
                  点赞 {likeCount > 0 && `(${likeCount})`}
                </span>
              )}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 收藏按钮 */}
        {canFavorite ? (
          <button
            onClick={() => handleAuthRequired(toggleFavorite)}
            disabled={favoriteLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
              ${
                isFavorited
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-200 hover:text-yellow-600'
              }
              ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            {favoriteLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
            {showLabels && (
              <span className="font-medium">
                {isFavorited ? '已收藏' : '收藏'}{' '}
                {favoriteCount > 0 && `(${favoriteCount})`}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可收藏">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {showLabels && (
                <span className="font-medium">
                  收藏 {favoriteCount > 0 && `(${favoriteCount})`}
                </span>
              )}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 评分按钮 */}
        {canRate ? (
          <button
            onClick={() => setShowRatingModal(true)}
            disabled={ratingLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
              ${
                userRating
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
              }
              ${ratingLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {showLabels && (
              <span className="font-medium">
                {userRating ? `已评分 (${userRating}★)` : '评分'}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可评分">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {showLabels && <span className="font-medium">评分</span>}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 显示平均评分 */}
        {ratingCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RatingStars rating={averageRating} size="xs" showCount={false} />
            <span>
              {averageRating.toFixed(1)} ({ratingCount} 人评分)
            </span>
          </div>
        )}
      </div>

      {/* 登录提示模态框 */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginClick={handleLogin}
        message="登录后即可点赞、收藏和评分资源"
      />

      {/* 评分模态框 */}
      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          currentRating={userRating}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          loading={ratingLoading}
        />
      )}
    </>
  )
}

// 评分模态框组件
function RatingModal({
  isOpen,
  currentRating,
  onClose,
  onSubmit,
  loading = false,
}: {
  isOpen: boolean
  currentRating?: number
  onClose: () => void
  onSubmit: (rating: number) => void
  loading?: boolean
}) {
  const [selectedRating, setSelectedRating] = useState(currentRating || 0)
  const [hoverRating, setHoverRating] = useState(0)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (selectedRating > 0 && !loading) {
      onSubmit(selectedRating)
    }
  }

  const ratingLabels = ['', '很差', '一般', '良好', '很好', '极佳']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            为资源评分
          </h3>

          <div className="text-center mb-6">
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoverRating || selectedRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            {(hoverRating || selectedRating) > 0 && (
              <p className="text-sm text-gray-600">
                {ratingLabels[hoverRating || selectedRating]}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {currentRating ? '更新评分' : '提交评分'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
