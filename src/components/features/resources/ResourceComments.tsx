'use client'

import { useState } from 'react'
import { MessageSquare, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useComments } from '@/hooks/use-interactions'
import { useAuth } from '@/hooks/use-auth'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ResourceCommentsProps {
  resourceId: string
  resourceTitle: string
}

export function ResourceComments({
  resourceId,
  resourceTitle,
}: ResourceCommentsProps) {
  const { user, isAuthenticated } = useAuth()
  const { comments, isLoading, isSubmitting, createComment, deleteComment } =
    useComments(resourceId, 'resource')
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      await createComment(commentText)
      setCommentText('')
    } catch (error) {
      console.error('Failed to post comment:', error)
    }
  }

  return (
    <div className="mt-8 border-t pt-8">
      {/* 评论标题 */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5" />
          评论 ({comments.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? '收起评论' : '展开评论'}
        </Button>
      </div>

      {showComments && (
        <>
          {/* 评论输入框 */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={`评论《${resourceTitle}》...`}
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      size="sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      发表评论
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 rounded-lg bg-muted p-4 text-center">
              <p className="text-muted-foreground">
                请{' '}
                <a href="/login" className="text-primary underline">
                  登录
                </a>{' '}
                后发表评论
              </p>
            </div>
          )}

          {/* 评论列表 */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              加载评论中...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无评论，快来发表第一条评论吧！
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 rounded-lg bg-muted/30"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.userAvatar}
                      alt={comment.userName}
                    />
                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>
                        </div>
                        <p className="mt-2 text-foreground whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                      {user?.id === comment.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteComment(comment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
