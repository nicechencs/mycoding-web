'use client'

import { useState } from 'react'
import { Vibe } from '@/types'
import { Avatar } from '@/components/ui/avatar'
import { ProfilePreviewModal } from '@/components/features/user/profile-preview'
import { LazyImage } from '@/components/ui/LazyImage'
import {
  ResourceStats,
  createStatsConfig,
} from '@/components/ui/resource-stats'
import { VibeActionsCompact } from './vibe-actions'
import { useAuth } from '@/hooks/use-auth'
import { LoginPromptInline } from '@/components/ui/login-prompt'
import { useVibeCardInteraction } from '@/hooks/use-card-interaction'
import { formatRelativeTime } from '@/utils/date'
import { useRouter } from 'next/navigation'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface VibeCardProps {
  vibe: Vibe
}

export function VibeCard({ vibe }: VibeCardProps) {
  const { user, isAuthenticated } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  // 使用统一的卡片交互Hook
  const { getCardProps, handleStatsClick } = useVibeCardInteraction({
    enableDebugLog: process.env.NODE_ENV === 'development',
  })

  // 创建统计数据配置
  const statsConfig = createStatsConfig('vibe', {
    likeCount: vibe.likeCount || 0,
    commentCount: vibe.commentCount || 0,
    onComment: handleStatsClick(vibe, 'comment'),
    // 这里可以添加点赞功能
    // onLike: handleLikeClick,
    // isLiked: vibe.isLiked
  })

  return (
    <>
      <div
        {...getCardProps(vibe)}
        className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
      >
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div
          role="button"
          aria-label="查看作者资料"
          onClick={e => {
            e.stopPropagation()
            setShowProfile(true)
          }}
          className="focus:outline-none rounded-full"
        >
          <Avatar size="lg" theme="primary">
            {vibe.author.name.charAt(0)}
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <button
              className="font-medium text-gray-900 hover:text-blue-600"
              onClick={e => {
                e.stopPropagation()
                setShowProfile(true)
              }}
            >
              {vibe.author.name}
            </button>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(vibe.createdAt)}
            </span>
          </div>
        </div>

        {/* More Actions */}
        <div className="relative">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <MarkdownRenderer 
          content={vibe.content} 
          className="text-gray-800 leading-relaxed"
        />
      </div>

      {/* Images */}
      {vibe.images && vibe.images.length > 0 && (
        <div className="mb-4">
          <div
            className={`grid gap-2 ${
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
                className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
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

      {/* Code Blocks */}
      {vibe.codeBlocks && vibe.codeBlocks.length > 0 && (
        <div className="mb-4 space-y-2">
          {vibe.codeBlocks.map((block, index) => (
            <div key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">{block.language}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(block.code)
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  复制代码
                </button>
              </div>
              <pre className="font-mono text-sm whitespace-pre-wrap">{block.code}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {vibe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {vibe.tags.map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <VibeActionsCompact vibeId={vibe.id} />
          <ResourceStats
            stats={statsConfig}
            variant="emoji"
            size="xs"
            className="text-sm"
          />
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
          data-no-click
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>查看评论</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {/* Comment Input */}
            {isAuthenticated && user ? (
              <div className="flex space-x-3">
                <Avatar size="sm" theme="secondary">
                  {user.name.charAt(0)}
                </Avatar>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="写下你的评论..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="py-3">
                <LoginPromptInline
                  message="登录后可评论"
                  onLoginClick={() => (window.location.href = '/login')}
                />
              </div>
            )}

            {/* Sample Comments */}
            {vibe.commentCount === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                暂无评论，
                {isAuthenticated
                  ? '成为第一个评论的人吧！'
                  : '登录后成为第一个评论的人吧！'}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                <button
                  onClick={() => router.push(`/vibes/${vibe.id}`)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  查看全部 {vibe.commentCount} 条评论
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    {/* 个人资料预览 */}
    <ProfilePreviewModal
      isOpen={showProfile}
      onClose={() => setShowProfile(false)}
      userId={vibe.author.id}
    />
    </>
  )
}
