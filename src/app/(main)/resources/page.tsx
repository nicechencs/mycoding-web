'use client'

import { useState, useMemo } from 'react'
import { useResources } from '@/hooks/use-resources'
import { ResourceCard } from '@/components/features/resources/resource-card'
import { ContentFilter } from '@/components/ui/content-filter'
import { taxonomyManager } from '@/lib/taxonomy'
import { ListSkeleton, PageLoader } from '@/components/ui/LoadingSuspense'

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayQuery, setDisplayQuery] = useState('')

  // 构建查询参数
  const queryParams = useMemo(() => {
    const params: any = {}
    if (selectedCategory !== 'all') {
      params.filters = {
        category: selectedCategory
      }
    }
    const searchTerm = displayQuery || searchQuery
    if (searchTerm) {
      params.search = searchTerm
    }
    return params
  }, [selectedCategory, displayQuery, searchQuery])

  const { resources, loading, error } = useResources(queryParams)

  const handleSearch = () => {
    setDisplayQuery(searchQuery)
  }

  if (loading) {
    return (
      <div className="container py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">资源</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            精选优质编程资源，涵盖前端、后端、移动端、AI等各个技术领域
          </p>
        </div>

        {/* Filter and Search */}
        <ContentFilter
          module="resources"
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="搜索资源标题、描述或标签..."
          showCategoryDropdown={false}
        />

        <PageLoader text="正在加载资源..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">资源</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            精选优质编程资源，涵盖前端、后端、移动端、AI等各个技术领域
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
            加载资源失败
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
        <h1 className="text-4xl font-bold text-gray-900">资源</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          精选优质编程资源，涵盖前端、后端、移动端、AI等各个技术领域
        </p>
      </div>

      {/* Filter and Search */}
      <ContentFilter
        module="resources"
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="搜索资源标题、描述或标签..."
        showCategoryDropdown={false}
      />

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          共找到 {resources?.length || 0} 个资源
          {selectedCategory !== 'all' &&
            (() => {
              const category = taxonomyManager.getCategory(
                'resources',
                selectedCategory
              )
              return category ? ` (${category.name})` : ''
            })()}
          {(displayQuery || searchQuery) &&
            ` 关于 "${displayQuery || searchQuery}"`}
        </p>
      </div>

      {/* Resources Grid */}
      {resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            没有找到相关资源
          </h3>
          <p className="text-gray-600">尝试调整搜索条件或选择其他分类</p>
        </div>
      )}
    </div>
  )
}
