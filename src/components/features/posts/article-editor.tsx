'use client'

import { useState, useEffect } from 'react'
import { ArticleFormData } from '@/types/article'
import { taxonomyManager } from '@/lib/taxonomy'

interface ArticleEditorProps {
  initialData?: Partial<ArticleFormData>
  onSave: (data: ArticleFormData, isDraft: boolean) => Promise<void>
  onCancel: () => void
  saving?: boolean
}

export function ArticleEditor({
  initialData,
  onSave,
  onCancel,
  saving = false,
}: ArticleEditorProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    coverImage: '',
    ...initialData,
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<
    Partial<Record<keyof ArticleFormData, string>>
  >({})
  const [showPreview, setShowPreview] = useState(false)

  // 获取文章分类
  const categories = taxonomyManager.getCategories('posts')

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArticleFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = '请输入文章标题'
    } else if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符'
    }

    if (!formData.content.trim()) {
      newErrors.content = '请输入文章内容'
    } else if (formData.content.length < 50) {
      newErrors.content = '文章内容至少需要50个字符'
    }

    if (!formData.category) {
      newErrors.category = '请选择文章分类'
    }

    if (formData.tags.length === 0) {
      newErrors.tags = '请至少添加一个标签'
    } else if (formData.tags.length > 5) {
      newErrors.tags = '标签数量不能超过5个'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理发布
  const handlePublish = async () => {
    if (!validateForm()) return

    // 自动生成摘要（如果未填写）
    const excerpt = formData.excerpt || formData.content.slice(0, 150) + '...'

    await onSave(
      {
        ...formData,
        excerpt,
      },
      false
    )
  }

  // 处理保存草稿
  const handleSaveDraft = async () => {
    // 草稿只验证标题
    if (!formData.title.trim()) {
      setErrors({ title: '请输入文章标题' })
      return
    }

    await onSave(formData, true)
  }

  // 添加标签
  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (!tag) return

    // 标签验证
    if (tag.length > 20) {
      setErrors({ ...errors, tags: '单个标签不能超过20个字符' })
      return
    }

    if (formData.tags.includes(tag)) {
      setErrors({ ...errors, tags: '该标签已存在' })
      return
    }

    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: '标签数量不能超过5个' })
      return
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tag],
    })
    setTagInput('')
    setErrors({ ...errors, tags: undefined })
  }

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    })
  }

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S 保存草稿
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSaveDraft()
      }
      // Ctrl+Enter 发布文章
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handlePublish()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [formData])

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-6">
        {/* 标题 */}
        <div>
          <input
            type="text"
            placeholder="输入文章标题..."
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className={`w-full text-3xl font-bold border-0 border-b-2 ${
              errors.title ? 'border-red-300' : 'border-gray-200'
            } focus:border-blue-500 focus:outline-none pb-2`}
            maxLength={100}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.title ? (
              <p className="text-red-500 text-sm">{errors.title}</p>
            ) : (
              <span className="text-sm text-gray-500">请输入文章标题</span>
            )}
            <span className="text-sm text-gray-500">
              {formData.title.length}/100
            </span>
          </div>
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章分类
          </label>
          <select
            value={formData.category}
            onChange={e =>
              setFormData({ ...formData, category: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">请选择分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* 封面图 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            封面图片（可选）
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="输入图片URL"
              value={formData.coverImage}
              onChange={e =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.coverImage && (
              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={formData.coverImage}
                  alt="封面预览"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="%23999"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: '' })}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 内容 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              文章内容
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showPreview ? '编辑' : '预览'}
            </button>
          </div>
          {showPreview ? (
            <div className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md overflow-y-auto bg-gray-50">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium mb-2">预览</h3>
                <div className="whitespace-pre-wrap">
                  {formData.content || '（暂无内容）'}
                </div>
              </div>
            </div>
          ) : (
            <textarea
              placeholder="开始写作..."
              value={formData.content}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className={`w-full h-96 px-3 py-2 border ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
          )}
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-500">
              {formData.content.length} 字符
              {formData.content.length < 50 && ' （至少需要50个字符）'}
            </p>
            <div className="text-sm text-gray-500">支持 Markdown 格式</div>
          </div>
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章摘要（可选，不填写将自动生成）
          </label>
          <textarea
            placeholder="简要描述文章内容..."
            value={formData.excerpt}
            onChange={e =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.excerpt.length}/200 字符
          </p>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="输入标签后按回车添加（最多20个字符）"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              添加
            </button>
          </div>
          {errors.tags && (
            <p className="text-red-500 text-sm mb-2">{errors.tags}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-500 hover:text-blue-700 text-lg leading-none"
                  title="删除标签"
                >
                  ×
                </button>
              </span>
            ))}
            {formData.tags.length === 0 && (
              <span className="text-sm text-gray-400">还没有添加标签</span>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              disabled={saving}
            >
              取消
            </button>
            <span className="text-xs text-gray-400">
              提示：Ctrl+S 保存草稿，Ctrl+Enter 发布文章
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? '保存中...' : '保存草稿'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? '发布中...' : '发布文章'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
