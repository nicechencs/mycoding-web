'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLike } from '@/hooks/use-interactions'
import {
  LoginPromptTooltip,
  LoginPromptModal,
} from '@/components/ui/login-prompt'

interface VibeActionsProps {
  vibeId: string
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function VibeActions({
  vibeId,
  className = '',
  showLabels = false,
  size = 'sm',
}: VibeActionsProps) {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 使用点赞 hook
  const {
    isLiked,
    likeCount,
    loading: likeLoading,
    toggleLike,
    canLike,
  } = useLike(vibeId, 'vibe')

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MyCoding Vibe',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // 这里可以添加一个提示
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* 点赞按钮 */}
        {canLike ? (
          <button
            onClick={() => handleAuthRequired(toggleLike)}
            disabled={likeLoading}
            className={`
              flex items-center rounded-lg transition-all
              ${sizeClasses[size]}
              ${
                isLiked
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
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
            {(showLabels || likeCount > 0) && (
              <span className="font-medium">
                {likeCount > 0 ? likeCount : ''}
                {showLabels && (isLiked ? ' 已点赞' : ' 点赞')}
              </span>
            )}
          </button>
        ) : (
          <LoginPromptTooltip message="登录后可点赞">
            <button
              onClick={() => setShowLoginModal(true)}
              className={`
                flex items-center rounded-lg border border-gray-200 
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
              {(showLabels || likeCount > 0) && (
                <span className="font-medium">
                  {likeCount > 0 ? likeCount : ''}
                  {showLabels && ' 点赞'}
                </span>
              )}
            </button>
          </LoginPromptTooltip>
        )}

        {/* 评论按钮 - 这里我们只显示，不处理功能，因为评论会在详情页处理 */}
        <button
          className={`
            flex items-center rounded-lg border border-gray-200 
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {showLabels && <span className="font-medium">评论</span>}
        </button>

        {/* 分享按钮 */}
        <button
          onClick={handleShare}
          className={`
            flex items-center rounded-lg border border-gray-200 
            text-gray-600 hover:border-green-200 hover:text-green-600
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
          {showLabels && <span className="font-medium">分享</span>}
        </button>
      </div>

      {/* 登录提示模态框 */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginClick={handleLogin}
        message="登录后即可点赞和互动"
      />
    </>
  )
}

// 简化版的Vibe操作组件（用于卡片）
export function VibeActionsCompact({
  vibeId,
  className = '',
}: {
  vibeId: string
  className?: string
}) {
  return (
    <VibeActions
      vibeId={vibeId}
      className={className}
      showLabels={false}
      size="sm"
    />
  )
}
