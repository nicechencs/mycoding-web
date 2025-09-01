'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockArticles } from '@/lib/mock/articles'
import { ArticleCard } from '@/components/features/community/article-card'
import { ContentFilter } from '@/components/ui/content-filter'
import { taxonomyManager } from '@/lib/taxonomy'

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 映射文章分类到新的taxonomy系统
  const mapArticleCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      '前端开发': 'tech-article',
      '技术文章': 'tech-article',
      '项目推荐': 'project',
      '学习笔记': 'study-notes',
      '经验分享': 'experience',
      '工具资源': 'tools'
    }
    return categoryMap[category] || category
  }

  const filteredArticles = mockArticles.filter(article => {
    const articleCategoryId = mapArticleCategory(article.category)
    const matchesCategory = selectedCategory === 'all' || articleCategoryId === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-900">所有内容</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          探索技术文章、项目推荐、学习笔记和博客内容
        </p>
      </div>

      {/* Filters */}
      <ContentFilter
        module="posts"
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="搜索文章标题、内容或标签..."
        actions={
          <>
            <button className="btn-primary px-4 py-2 text-sm">
              写文章
            </button>
            <button className="btn-secondary px-4 py-2 text-sm">
              发推荐
            </button>
          </>
        }
      />

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          共找到 {filteredArticles.length} 篇内容
          {selectedCategory !== 'all' && (() => {
            const category = taxonomyManager.getCategory('posts', selectedCategory)
            return category ? ` (${category.name})` : ''
          })()}
          {searchQuery && ` 关于 "${searchQuery}"`}
        </p>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关内容</h3>
          <p className="text-gray-600 mb-6">
            尝试调整搜索条件或选择其他分类
          </p>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary">
              写文章
            </button>
            <button className="btn-secondary">
              发推荐
            </button>
          </div>
        </div>
      )}
    </div>
  )
}