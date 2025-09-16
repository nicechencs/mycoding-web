'use client'

import { useState, useCallback, useMemo } from 'react'
import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useComments, useCommentLike } from '@/hooks/use-interactions'
import { Avatar } from '@/components/ui/avatar'
import { LoginPrompt, LoginPromptInline } from '@/components/ui/login-prompt'
import { formatRelativeTime } from '@/utils/date'
import { Comment } from '@/lib/interaction/interaction-types'
import { useToast } from '@/components/ui/toast'
import { CommentItem } from './comment-item'
import { CommentSkeleton, CommentInputSkeleton, CommentHeaderSkeleton } from '@/components/ui/comment-skeleton'

interface ResourceCommentsProps {
  resourceId: string
  className?: string
}

export const ResourceComments = React.memo(function ResourceComments({
  resourceId,
  className = '',
}: ResourceCommentsProps) {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)

  // 使用评论 hook（支持分页）
  const {
    comments,
    isLoading,
    isLoadingMore,
    isSubmitting,
    pagination,
    createComment,
    loadMoreComments,
    // deleteComment,
    // refreshComments,
  } = useComments(resourceId, 'resource', { pageSize: 10 })
  
  const canComment = useMemo(() => isAuthenticated, [isAuthenticated])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    try {
      const result = await createComment(newComment)
      if (result) {
        setNewComment('')
        setRating(0)
        setShowRating(false)
        showToast({
          type: 'success',
          title: '评论发表成功',
          message: '感谢您的分享！'
        })
      }
    } catch (error) {
      console.error('Submit comment error:', error)
      showToast({
        type: 'error',
        title: '评论发表失败',
        message: '请稍后重试'
      })
    }
  }, [newComment, isSubmitting, createComment, showToast])

  const handleReply = useCallback(async (parentId: string) => {
    if (!replyContent.trim() || isSubmitting) return

    try {
      const result = await createComment(replyContent)
      if (result) {
        setReplyContent('')
        setReplyTo(null)
        showToast({
          type: 'success',
          title: '回复发表成功'
        })
      }
    } catch (error) {
      console.error('Submit reply error:', error)
      showToast({
        type: 'error',
        title: '回复发表失败',
        message: '请稍后重试'
      })
    }
  }, [replyContent, isSubmitting, createComment, showToast])

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !isLoadingMore) {
      loadMoreComments()
    }
  }, [pagination.hasMore, isLoadingMore, loadMoreComments])

  // 移除这个函数，我们将在组件中使用hook

  const handleLoginClick = useCallback(() => {
    window.location.href = '/login'
  }, [])

  const handleReplyToComment = useCallback((commentId: string) => {
    setReplyTo(commentId)
  }, [])

  const handleReplyCancel = useCallback(() => {
    setReplyTo(null)
    setReplyContent('')
  }, [])

  const handleReplyContentChange = useCallback((content: string) => {
    setReplyContent(content)
  }, [])

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <CommentHeaderSkeleton />
        <CommentInputSkeleton />
        <CommentSkeleton count={3} showReplies={true} />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 评论输入区域 */}
      {canComment ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar size="sm" theme="primary">
              {user?.name.charAt(0) || '我'}
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="分享你的使用体验..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                rows={3}
              />

              {/* 评分选项 */}
              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRating}
                    onChange={e => setShowRating(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">同时评分</span>
                </label>

                {showRating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            star <= rating
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
                )}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? '发表中...' : '发表评论'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6">
          <LoginPromptInline
            message="请登录后发表评论"
            onLoginClick={handleLoginClick}
          />
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>
              暂无评论，
              {canComment
                ? '成为第一个评论的人吧！'
                : '登录后成为第一个评论的人吧！'}
            </p>
          </div>
        ) : (
          <>
            {comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                onReply={handleReplyToComment}
                replyTo={replyTo}
                replyContent={replyContent}
                onReplyContentChange={handleReplyContentChange}
                onReplySubmit={handleReply}
                onReplyCancel={handleReplyCancel}
                isSubmitting={isSubmitting}
              />
            ))}
            
            {/* 加载更多按钮 */}
            {pagination.hasMore && (
              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full px-4 py-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      加载中...
                    </>
                  ) : (
                    <>
                      查看更多评论
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        剩余 {pagination.total - comments.length} 条
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
