'use client'

import React, { useState, useCallback, memo } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { formatRelativeTime } from '@/utils/date'
import { Comment } from '@/lib/interaction/interaction-types'
import { useCommentLike } from '@/hooks/use-interactions'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast'

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
  onReply?: (commentId: string) => void
  replyTo?: string | null
  replyContent?: string
  onReplyContentChange?: (content: string) => void
  onReplySubmit?: (parentId: string) => void
  onReplyCancel?: () => void
  isSubmitting?: boolean
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const CommentItem = memo(function CommentItem({
  comment,
  isReply = false,
  onReply,
  replyTo,
  replyContent = '',
  onReplyContentChange,
  onReplySubmit,
  onReplyCancel,
  isSubmitting = false,
}: CommentItemProps) {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const commentLike = useCommentLike(comment.id)

  const handleLikeClick = useCallback(async () => {
    try {
      await commentLike.toggleLike()
    } catch (error) {
      showToast({
        type: 'error',
        title: '操作失败',
        message: '请稍后重试'
      })
    }
  }, [commentLike.toggleLike, showToast])

  const handleReplyClick = useCallback(() => {
    onReply?.(comment.id)
  }, [onReply, comment.id])

  return (
    <div className={cn('flex gap-3', isReply && 'ml-12')}>
      <Avatar size="sm" theme="secondary">
        {comment.userName.charAt(0)}
      </Avatar>

      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.userName}
            </span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm">
          {isAuthenticated ? (
            <button
              onClick={handleLikeClick}
              disabled={commentLike.isLoading}
              className={cn(
                'flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50',
                commentLike.isLiked && 'text-red-500'
              )}
            >
              <svg
                className={cn(
                  'w-4 h-4',
                  commentLike.isLiked && 'fill-current'
                )}
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
              <span>{commentLike.likeCount}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-gray-400">
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
              <span>{commentLike.likeCount}</span>
            </div>
          )}

          {!isReply && isAuthenticated && onReply && (
            <button
              onClick={handleReplyClick}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              回复
            </button>
          )}

          {!isReply && !isAuthenticated && (
            <span className="text-gray-400 text-sm">登录后可回复</span>
          )}
        </div>

        {replyTo === comment.id && onReplySubmit && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={e => onReplyContentChange?.(e.target.value)}
              placeholder="写下你的回复..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
            />
            <button
              onClick={() => onReplySubmit(comment.id)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '发送中...' : '回复'}
            </button>
            <button
              onClick={onReplyCancel}
              className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700"
            >
              取消
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply: Comment) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                isReply 
                onReply={onReply}
                replyTo={replyTo}
                replyContent={replyContent}
                onReplyContentChange={onReplyContentChange}
                onReplySubmit={onReplySubmit}
                onReplyCancel={onReplyCancel}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})