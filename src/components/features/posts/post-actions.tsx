'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLike, useFavorite } from '@/hooks/use-interactions'
import {
  LoginPromptTooltip,
  LoginPromptModal,
} from '@/components/ui/login-prompt'

interface PostActionsProps {
  postId: string
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PostActions({
  postId,
  className = '',
  showLabels = true,
  size = 'md',
}: PostActionsProps) {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 使用交互 hooks
  const {
    isLiked,
    likeCount,
    isLoading: likeLoading,
    toggleLike,
  } = useLike(postId, 'post')
  const {
    isFavorited,
    favoriteCount,
    isLoading: favoriteLoading,
    toggleFavorite,
  } = useFavorite(postId, 'post')

  // 处理需要登录的操作
  const handleAuthRequired = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {/* 点赞按钮 */}
        {isAuthenticated ? (
          <button
            onClick={() => handleAuthRequired(toggleLike)}
            disabled={likeLoading}
            className={`
              flex items-center gap-2 rounded-lg border transition-all
              ${sizeClasses[size]}
              ${
                isLiked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
              }
              ${likeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            {likeLoading ? (
              <div
                className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
              />
            ) : (
              <svg
                className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`}
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
                {likeCount > 0 ? likeCount : ''}
                {size !== 'sm' && (isLiked ? ' 已点赞' : ' 点赞')}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可点赞">
            <button
              onClick={() => setShowLoginModal(true)}
              className={`
                flex items-center gap-2 rounded-lg border border-gray-200 
                text-gray-400 cursor-not-allowed ${sizeClasses[size]}
              `}
            >
              <svg
                className={iconSizes[size]}
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
                  {likeCount > 0 ? likeCount : ''}
                  {size !== 'sm' && ' 点赞'}
                </span>
              )}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 收藏按钮 */}
        {isAuthenticated ? (
          <button
            onClick={() => handleAuthRequired(toggleFavorite)}
            disabled={favoriteLoading}
            className={`
              flex items-center gap-2 rounded-lg border transition-all
              ${sizeClasses[size]}
              ${
                isFavorited
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-200 hover:text-yellow-600'
              }
              ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            {favoriteLoading ? (
              <div
                className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
              />
            ) : (
              <svg
                className={`${iconSizes[size]} ${isFavorited ? 'fill-current' : ''}`}
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
                {favoriteCount > 0 ? favoriteCount : ''}
                {size !== 'sm' && (isFavorited ? ' 已收藏' : ' 收藏')}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可收藏">
            <button
              onClick={() => setShowLoginModal(true)}
              className={`
                flex items-center gap-2 rounded-lg border border-gray-200 
                text-gray-400 cursor-not-allowed ${sizeClasses[size]}
              `}
            >
              <svg
                className={iconSizes[size]}
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
                  {favoriteCount > 0 ? favoriteCount : ''}
                  {size !== 'sm' && ' 收藏'}
                </span>
              )}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 分享按钮 */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: document.title,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              // 这里可以添加一个提示组件
            }
          }}
          className={`
            flex items-center gap-2 rounded-lg border border-gray-200 
            text-gray-600 hover:border-blue-200 hover:text-blue-600
            transition-all hover:shadow-sm ${sizeClasses[size]}
          `}
        >
          <svg
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          {showLabels && size !== 'sm' && (
            <span className="font-medium">分享</span>
          )}
        </button>
      </div>

      {/* 登录提示模态框 */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginClick={handleLogin}
        message="登录后即可点赞和收藏文章"
      />
    </>
  )
}

// 简化版的文章操作组件（用于卡片等）
export function PostActionsCompact({
  postId,
  className = '',
}: {
  postId: string
  className?: string
}) {
  return (
    <PostActions
      postId={postId}
      className={className}
      showLabels={false}
      size="sm"
    />
  )
}
