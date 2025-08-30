'use client'

import { useState } from 'react'
import { Vibe } from '@/types'
import { Avatar } from '@/components/ui/avatar'
import { useLike } from '@/hooks/use-like'
import { formatRelativeTime } from '@/utils/date'

interface VibeCardProps {
  vibe: Vibe
}

export function VibeCard({ vibe }: VibeCardProps) {
  const { likeCount, isLiked, handleLike } = useLike(vibe.likeCount, vibe.isLiked)
  const [showComments, setShowComments] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <Avatar size="lg" theme="primary">
          {vibe.author.name.charAt(0)}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{vibe.author.name}</span>
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
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {vibe.content}
        </p>
      </div>

      {/* Images */}
      {vibe.images && vibe.images.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${
            vibe.images.length === 1 ? 'grid-cols-1' :
            vibe.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {vibe.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">图片 {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {vibe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {vibe.tags.map((tag) => (
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
      <div className="flex items-center space-x-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 hover:text-red-500 transition-colors ${
            isLiked ? 'text-red-500' : ''
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

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{vibe.commentCount}</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>{vibe.shareCount}</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-gray-700 transition-colors ml-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {/* Comment Input */}
            <div className="flex space-x-3">
              <Avatar size="sm" theme="secondary">
                我
              </Avatar>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="写下你的评论..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Sample Comments */}
            {vibe.commentCount > 0 && (
              <div className="text-sm text-gray-500">
                暂无评论，成为第一个评论的人吧！
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}