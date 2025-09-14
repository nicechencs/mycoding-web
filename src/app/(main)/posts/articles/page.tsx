'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useArticles } from '@/hooks/use-articles'
import { ArticleCard } from '@/components/features/community/article-card'
import { ContentFilter } from '@/components/ui/content-filter'
import { taxonomyManager } from '@/lib/taxonomy'
import { ListSkeleton, PageLoader } from '@/components/ui/LoadingSuspense'

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 构建查询参数
  const queryParams = useMemo(() => {
    const params: any = {}
    if (selectedCategory !== 'all') {
      params.category = selectedCategory
    }
    if (searchQuery) {
      params.search = searchQuery
    }
    return params
  }, [selectedCategory, searchQuery])

  const { articles, loading, error } = useArticles(queryParams)

  if (loading) {
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
              <Link href="/posts/new" className="btn-primary px-4 py-2 text-sm">写文章</Link>
            </>
          }
        />

        <PageLoader text="正在加载文章..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">所有内容</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索技术文章、项目推荐、学习笔记和博客内容
          </p>
        </div>

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
            加载文章失败
          </h3>
          <p className="text-gray-600 mb-4">网络错误或服务暂时不可用</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

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
            <Link href="/posts/new" className="btn-primary px-4 py-2 text-sm">写文章</Link>
          </>
        }
      />

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          共找到 {articles?.length || 0} 篇内容
          {selectedCategory !== 'all' &&
            (() => {
              const category = taxonomyManager.getCategory(
                'posts',
                selectedCategory
              )
              return category ? ` (${category.name})` : ''
            })()}
          {searchQuery && ` 关于 "${searchQuery}"`}
        </p>
      </div>

      {/* Articles Grid */}
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            没有找到相关内容
          </h3>
          <p className="text-gray-600 mb-6">尝试调整搜索条件或选择其他分类</p>
          <div className="flex gap-3 justify-center">
            <Link href="/posts/new" className="btn-primary">写文章</Link>
          </div>
        </div>
      )}
    </div>
  )
}
