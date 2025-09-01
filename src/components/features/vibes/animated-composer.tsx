'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '@/components/ui/avatar'

interface AnimatedComposerProps {
  onSubmit: (content: string, tags: string[]) => void
}

export function AnimatedComposer({ onSubmit }: AnimatedComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const quickTags = [
    '前端开发', '后端开发', 'React', 'Next.js', 'TypeScript', 'Node.js',
    '学习笔记', '项目分享', '代码片段', '调试经验', '工具推荐', '技术思考'
  ]

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
    <motion.div
      layout
      className="bg-white rounded-lg shadow-sm overflow-hidden"
      initial={false}
      animate={{
        height: isExpanded ? 'auto' : 76,
        boxShadow: isExpanded 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-out
      }}
    >
      <div className="relative">
        {/* Collapsed Button State */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.button
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsExpanded(true)}
              className="w-full p-4 text-left group"
              whileHover={{ scale: 1.002 }}
              whileTap={{ scale: 0.998 }}
            >
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Avatar size="md" theme="primary">
                  我
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-500 group-hover:text-gray-600 transition-colors">
                    分享你的编程动态...
                  </p>
                </div>
                <motion.div 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Expanded Composer State */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ 
                duration: 0.25, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="p-6"
            >
              {/* Header */}
              <motion.div 
                className="flex items-center space-x-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Avatar size="md" theme="primary">
                  我
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">分享你的编程动态</div>
                  <div className="text-sm text-gray-500">让其他开发者了解你的想法</div>
                </div>
              </motion.div>

              {/* Content Input */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="分享你的编程想法、学习心得、项目进展或技术思考..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  rows={4}
                  maxLength={500}
                  autoFocus
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
              </motion.div>

              {/* Tags Section */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
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
                <AnimatePresence>
                  {tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 mb-3 overflow-hidden"
                    >
                      {tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
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
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Tags */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">快速添加标签：</div>
                  <div className="flex flex-wrap gap-2">
                    {quickTags.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag, index) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => addTag(tag)}
                        disabled={tags.length >= 5}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                className="flex items-center justify-between pt-4 border-t border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发布动态
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}