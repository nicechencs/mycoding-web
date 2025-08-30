'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockArticles } from '@/lib/mock/articles'
import { ArticleCard } from '@/components/features/community/article-card'

const categories = [
  { id: 'all', name: '全部内容' },
  { id: '技术文章', name: '技术文章' },
  { id: '项目推荐', name: '项目推荐' },
  { id: '学习笔记', name: '学习笔记' },
  { id: '经验分享', name: '经验分享' },
  { id: '工具资源', name: '工具资源' },
]

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = mockArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              搜索内容
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="搜索标题、内容或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              内容类型
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end space-x-2">
            <button className="btn-primary px-4 py-2 text-sm">
              写文章
            </button>
            <button className="btn-secondary px-4 py-2 text-sm">
              发推荐
            </button>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* Quick Categories */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          共找到 {filteredArticles.length} 篇内容
          {selectedCategory !== 'all' && ` (${selectedCategory})`}
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