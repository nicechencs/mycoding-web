'use client'

import { useState } from 'react'
import { mockResources, mockResourceCategories } from '@/lib/mock/resources'
import { ResourceCard } from '@/components/features/resources/resource-card'
import { ResourceFilter } from '@/components/features/resources/resource-filter'

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = mockResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-900">资源导航</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          精选优质编程资源，涵盖前端、后端、移动端、AI等各个技术领域
        </p>
      </div>

      {/* Filter and Search */}
      <ResourceFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={mockResourceCategories}
      />

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          共找到 {filteredResources.length} 个资源
          {selectedCategory !== 'all' && ` (${selectedCategory})`}
          {searchQuery && ` 关于 "${searchQuery}"`}
        </p>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关资源</h3>
          <p className="text-gray-600">
            尝试调整搜索条件或选择其他分类
          </p>
        </div>
      )}
    </div>
  )
}