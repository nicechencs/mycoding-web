'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useVibeDetail } from '@/hooks/use-vibes'
import { useAuth } from '@/hooks/use-auth'
import { VibeComment } from '@/types'
import { Avatar } from '@/components/ui/avatar'
import { VibeCard } from '@/components/features/vibes/vibe-card'
import { useLike } from '@/hooks/use-like'
import { formatRelativeTime } from '@/utils/date'
import { PageLoader } from '@/components/ui/LoadingSuspense'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { LazyImage } from '@/components/ui/LazyImage'

interface Props {
  params: { id: string }
}

export default function VibeDetailPage({ params }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')

  const { vibe, comments, relatedVibes, loading, error, mutate } =
    useVibeDetail(params.id)

  const { likeCount, isLiked, handleLike } = useLike(
    vibe?.likeCount || 0,
    vibe?.isLiked || false
  )

  if (loading) {
    return (
      <div className="container py-8">
        <PageLoader text="正在加载动态详情..." />
      </div>
    )
  }

  if (error || !vibe) {
    if (error?.message?.includes('404')) {
      notFound()
    }
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            加载动态失败
          </h3>
          <p className="text-gray-600 mb-4">动态不存在或已被删除</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const comment: VibeComment = {
      id: Date.now().toString(),
      vibeId: params.id,
      content: newComment.trim(),
      author: user,
      createdAt: new Date(),
    }

    // 手动更新缓存
    const updatedVibe = { ...vibe!, commentCount: vibe!.commentCount + 1 }
    const updatedComments = [...(comments || []), comment]

    mutate.comments(
      prev => ({ ...(prev || { success: true }), data: updatedComments }),
      false
    )
    mutate.vibe(
      prev => ({ ...(prev || { success: true }), data: updatedVibe }),
      false
    )
    setNewComment('')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vibe?.author.name}的Vibe动态`,
        text: vibe?.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className="container py-8">
      <div>
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>返回</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vibe主体 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* 作者信息 */}
              <div className="flex items-start space-x-3 mb-6">
                <Avatar size="lg" theme="primary">
                  {vibe.author.name.charAt(0)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="font-semibold text-gray-900 text-lg">
                      {vibe.author.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    发布于 {formatRelativeTime(vibe.createdAt)}
                  </p>
                </div>

                {/* 更多操作 */}
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <div className="mb-6">
                <MarkdownRenderer
                  content={vibe.content}
                  className="text-gray-800 leading-relaxed text-lg"
                />
              </div>

              {/* 图片 */}
              {vibe.images && vibe.images.length > 0 && (
                <div className="mb-6">
                  <div
                    className={`grid gap-3 ${
                      vibe.images.length === 1
                        ? 'grid-cols-1'
                        : vibe.images.length === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-2 md:grid-cols-3'
                    }`}
                  >
                    {vibe.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        {typeof image === 'string' ? (
                          <LazyImage
                            src={image}
                            alt={`${vibe.author.name} 分享的图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                            options={{
                              rootMargin: '100px',
                              fadeIn: true,
                              retryCount: 2,
                            }}
                            showLoadingIndicator={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              图片 {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 代码块 */}
              {vibe.codeBlocks && vibe.codeBlocks.length > 0 && (
                <div className="mb-6 space-y-3">
                  {vibe.codeBlocks.map((block, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-mono">
                          {block.language}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(block.code)
                            alert('代码已复制到剪贴板')
                          }}
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          复制代码
                        </button>
                      </div>
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {block.code}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* 标签 */}
              {vibe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {vibe.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 交互按钮 */}
              <div className="flex items-center space-x-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-red-500'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
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
                  <span>{likeCount}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors">
                  <svg
                    className="w-5 h-5"
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
                  <span>{vibe.commentCount}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
                  <span>{vibe.shareCount}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors ml-auto">
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            </div>

            {/* 评论区 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                评论 ({comments.length})
              </h3>

              {/* 评论输入 */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex space-x-3">
                    <Avatar size="md" theme="primary">
                      {user.name.charAt(0)}
                    </Avatar>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="写下你的评论..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          发布评论
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg mb-6">
                  <p className="text-gray-600 mb-2">登录后即可发表评论</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    立即登录
                  </button>
                </div>
              )}

              {/* 评论列表 */}
              <div className="space-y-4">
                {comments && comments.length > 0 ? (
                  comments.map(comment => (
                    <div
                      key={comment.id}
                      className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <Avatar size="sm" theme="secondary">
                        {comment.author.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                            回复
                          </button>
                          <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                            点赞
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p>还没有评论，成为第一个评论的人吧！</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息卡 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <Avatar size="xl" theme="primary" className="mx-auto mb-3">
                  {vibe.author.name.charAt(0)}
                </Avatar>
                <h3 className="font-semibold text-gray-900">
                  {vibe.author.name}
                </h3>
                <p className="text-sm text-gray-500">{vibe.author.email}</p>
              </div>
              <button className="w-full btn-primary">关注</button>
            </div>

            {/* 相关动态 */}
            {relatedVibes && relatedVibes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">相关动态</h3>
                <div className="space-y-4">
                  {relatedVibes.map(relatedVibe => (
                    <div
                      key={relatedVibe.id}
                      onClick={() => router.push(`/vibes/${relatedVibe.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar size="sm" theme="tertiary">
                          {relatedVibe.author.name.charAt(0)}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {relatedVibe.author.name}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {relatedVibe.content}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                            <span>{relatedVibe.likeCount} 赞</span>
                            <span>{relatedVibe.commentCount} 评论</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作面板 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">更多操作</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  举报内容
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  复制链接
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  嵌入代码
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
