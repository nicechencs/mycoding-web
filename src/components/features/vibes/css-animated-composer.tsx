'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'

interface CSSAnimatedComposerProps {
  onSubmit: (content: string, tags: string[]) => void
}

export function CSSAnimatedComposer({ onSubmit }: CSSAnimatedComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const quickTags = [
    '前端开发', '后端开发', 'React', 'Next.js', 'TypeScript', 'Node.js',
    '学习笔记', '项目分享', '代码片段', '调试经验', '工具推荐', '技术思考'
  ]

  // 自动聚焦到输入框
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      // 延迟一点时间确保动画开始后再聚焦
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 150)
    }
  }, [isExpanded])

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim(), tags)
      setContent('')
      setTags([])
      setTagInput('')
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setTags([])
    setTagInput('')
    setIsExpanded(false)
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
    <>
      <style jsx>{`
        @keyframes expandHeight {
          from {
            max-height: 76px;
            background-color: rgb(255, 255, 255);
          }
          to {
            max-height: 600px;
            background-color: rgb(250, 250, 255);
          }
        }
        
        @keyframes collapseHeight {
          from {
            max-height: 600px;
            background-color: rgb(250, 250, 255);
          }
          to {
            max-height: 76px;
            background-color: rgb(255, 255, 255);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        .expand {
          animation: expandHeight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .collapse {
          animation: collapseHeight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .content-fade-in {
          animation: fadeIn 0.25s ease-out 0.1s both;
        }
        
        .content-fade-out {
          animation: fadeOut 0.15s ease-out forwards;
        }
      `}</style>
      
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-400 ${
          isExpanded ? 'expand shadow-lg' : 'collapse shadow-sm hover:shadow-md'
        }`}
        style={{ 
          maxHeight: isExpanded ? '600px' : '76px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'max-height, transform'
        }}
      >
        {/* Collapsed Button State */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Avatar size="md" theme="primary">
                我
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-500">分享你的编程动态...</p>
              </div>
              <div className="text-2xl">✨</div>
            </div>
          </button>
        )}

        {/* Expanded Composer State */}
        {isExpanded && (
          <div className="p-6 content-fade-in">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar size="md" theme="primary">
                我
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">分享你的编程动态</div>
                <div className="text-sm text-gray-500">让其他开发者了解你的想法</div>
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享你的编程想法、学习心得、项目进展或技术思考..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {content.length}/500 字符
                </div>
                {content.length > 400 && (
                  <div className="text-xs text-blue-600">
                    内容即将达到上限
                  </div>
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
                  onChange={(e) => setTagInput(e.target.value)}
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
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                  {quickTags.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag) => (
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">添加图片</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="text-sm">代码片段</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v11a1 1 0 01-1-1H7a1 1 0 01-1-1V4a1 1 0 011-1V4z" />
                  </svg>
                  <span className="text-sm">链接</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:scale-105 active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  发布动态
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}