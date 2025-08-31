'use client'

import { useState } from 'react'
import { ResourceComment } from '@/types/resource'
import { Avatar } from '@/components/ui/avatar'
import { formatRelativeTime } from '@/utils/date'

interface ResourceCommentsProps {
  comments: ResourceComment[]
  onAddComment?: (content: string, parentId?: string) => void
}

export function ResourceComments({ comments, onAddComment }: ResourceCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment?.(newComment)
      setNewComment('')
    }
  }

  const handleReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment?.(replyContent, parentId)
      setReplyContent('')
      setReplyTo(null)
    }
  }

  const handleLike = (commentId: string) => {
    // 处理点赞逻辑
    console.log('Like comment:', commentId)
  }

  const CommentItem = ({ comment, isReply = false }: { comment: ResourceComment; isReply?: boolean }) => (
    <div className={cn('flex gap-3', isReply && 'ml-12')}>
      <Avatar size="sm" theme="secondary">
        {comment.userName.charAt(0)}
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{comment.userName}</span>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(comment.createdAt)}
              </span>
              {comment.rating && (
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={cn('w-3 h-3', i < comment.rating! ? 'fill-current' : 'fill-gray-300')}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            onClick={() => handleLike(comment.id)}
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
          
          {!isReply && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              回复
            </button>
          )}
        </div>
        
        {replyTo === comment.id && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="写下你的回复..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
            />
            <button
              onClick={() => handleReply(comment.id)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              回复
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
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          评论 ({comments.length})
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar size="sm" theme="primary">
          我
        </Avatar>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="分享你的使用体验..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发表评论
            </button>
          </div>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无评论，成为第一个评论的人吧！
          </div>
        ) : (
          comments.map((comment) => (
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