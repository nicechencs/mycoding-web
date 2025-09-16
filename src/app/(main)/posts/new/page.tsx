'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { ArticleEditor } from '@/components/features/posts/article-editor'
import { ArticleFormData } from '@/types/article'
import { articlesService } from '@/services/articles.service'

export default function NewArticlePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [saving, setSaving] = useState(false)

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/posts/new')
    return null
  }

  // 保存用户信息到localStorage（供Mock使用）
  if (user) {
    localStorage.setItem('userName', user.name)
    localStorage.setItem('userEmail', user.email)
    if (user.avatar) {
      localStorage.setItem('userAvatar', user.avatar)
    }
  }

  const handleSave = async (data: ArticleFormData, isDraft: boolean) => {
    setSaving(true)
    try {
      const response = await articlesService.createArticle({
        ...data,
        isDraft,
      })

      if (response.success && response.data) {
        // 保存成功后跳转
        if (isDraft) {
          alert('草稿保存成功！')
          // 跳转到草稿箱（暂时跳转到文章列表）
          router.push('/posts/articles')
        } else {
          alert('文章发布成功！')
          // 跳转到文章详情页
          router.push(`/posts/articles/${response.data.slug}`)
        }
      } else {
        throw new Error(response.error || '保存失败')
      }
    } catch (error) {
      console.error('保存文章失败:', error)
      alert(error instanceof Error ? error.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('确定要放弃编辑吗？未保存的内容将会丢失。')) {
      router.back()
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">写文章</h1>
        <p className="text-gray-600 mt-2">分享你的知识和经验</p>
      </div>

      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  )
}
