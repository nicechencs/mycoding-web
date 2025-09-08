'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useComments } from '@/hooks/use-interactions'
import { Avatar } from '@/components/ui/avatar'
import { LoginPromptInline } from '@/components/ui/login-prompt'
import { formatRelativeTime } from '@/utils/date'

interface PostCommentsProps {
  postId: string
  className?: string
}

export function PostComments({ postId, className = '' }: PostCommentsProps) {
  const { user, isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // 使用评论 hook
  const {
    comments,
    loading,
    submitting,
    addComment,
    toggleCommentLike,
    canComment,
  } = useComments(postId, 'post')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    try {
      const result = await addComment(newComment)
      if (result?.success) {
        setNewComment('')
      }
    } catch (error) {
      console.error('Submit comment error:', error)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || submitting) return

    try {
      const result = await addComment(replyContent, parentId)
      if (result?.success) {
        setReplyContent('')
        setReplyTo(null)
      }
    } catch (error) {
      console.error('Submit reply error:', error)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    if (isAuthenticated) {
      await toggleCommentLike(commentId)
    }
  }

  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: any
    isReply?: boolean
  }) => (
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
              onClick={() => handleCommentLike(comment.id)}
              className={cn(
                'flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors',
                comment.isLiked && 'text-red-500'
              )}
            >
              <svg
                className={cn('w-4 h-4', comment.isLiked && 'fill-current')}
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
              <span>{comment.likeCount || 0}</span>
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
              <span>{comment.likeCount || 0}</span>
            </div>
          )}

          {!isReply && isAuthenticated && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              回复
            </button>
          )}

          {!isReply && !isAuthenticated && (
            <span className="text-gray-400 text-sm">登录后可回复</span>
          )}
        </div>

        {replyTo === comment.id && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="写下你的回复..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
            />
            <button
              onClick={() => handleReply(comment.id)}
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {submitting ? '发送中...' : '回复'}
            </button>
            <button
              onClick={() => {
                setReplyTo(null)
                setReplyContent('')
              }}
              className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700"
            >
              取消
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply: any) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                placeholder="分享你的看法..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                rows={3}
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? '发表中...' : '发表评论'}
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
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
