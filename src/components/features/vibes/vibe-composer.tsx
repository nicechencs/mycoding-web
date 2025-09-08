'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar } from '@/components/ui/avatar'
import { LoginPrompt } from '@/components/ui/login-prompt'

interface VibeComposerProps {
  onSubmit: (content: string, tags: string[]) => void
  onCancel: () => void
}

export function VibeComposer({ onSubmit, onCancel }: VibeComposerProps) {
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // 如果未登录，显示登录提示
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <LoginPrompt
          message="请登录后发布动态"
          actionText="立即登录"
          onLoginClick={() => (window.location.href = '/login')}
        />
      </div>
    )
  }

  const quickTags = [
    '前端开发',
    '后端开发',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    '学习笔记',
    '项目分享',
    '代码片段',
    '调试经验',
    '工具推荐',
    '技术思考',
  ]

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim(), tags)
      setContent('')
      setTags([])
      setTagInput('')
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput.trim())
      setTagInput('')
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar size="md" theme="primary">
          {user.name.charAt(0)}
        </Avatar>
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">分享你的编程动态</div>
        </div>
      </div>

      {/* Content Input */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="分享你的编程想法、学习心得、项目进展或技术思考..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          rows={4}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500">{content.length}/500 字符</div>
          {content.length > 400 && (
            <div className="text-xs text-blue-600">内容即将达到上限</div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          添加标签 (最多5个)
        </label>

        {/* Tag Input */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            placeholder="输入标签并按回车"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
            disabled={tags.length >= 5}
          />
          <button
            onClick={() => {
              if (tagInput.trim()) {
                addTag(tagInput.trim())
                setTagInput('')
              }
            }}
            disabled={!tagInput.trim() || tags.length >= 5}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Quick Tags */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">快速添加标签：</div>
          <div className="flex flex-wrap gap-2">
            {quickTags
              .filter(tag => !tags.includes(tag))
              .slice(0, 8)
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={tags.length >= 5}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">添加图片</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <span className="text-sm">代码片段</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
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
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1V4z"
              />
            </svg>
            <span className="text-sm">链接</span>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发布动态
          </button>
        </div>
      </div>
    </div>
  )
}
