'use client'

import React from 'react'
import { ModuleType, Category } from '@/lib/taxonomy'
import { useCategories } from '@/lib/taxonomy'
import { cn } from '@/lib/utils'

interface ContentFilterProps {
  module: ModuleType
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  showSearch?: boolean
  showQuickFilters?: boolean
  className?: string
  placeholder?: string
  actions?: React.ReactNode
}

/**
 * 统一的内容筛选组件
 * 用于Resources、Posts、Vibes等模块的分类和搜索
 */
export function ContentFilter({
  module,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showSearch = true,
  showQuickFilters = true,
  className,
  placeholder = '搜索内容...',
  actions
}: ContentFilterProps) {
  const { categories, getCategoryColors } = useCategories(module)

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 搜索框 */}
        {showSearch && (
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              搜索内容
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 分类筛选 */}
        <div className="lg:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            内容分类
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 操作按钮 */}
        {actions && (
          <div className="flex items-end space-x-2">
            {actions}
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  onCategoryChange('all')
                  onSearchChange('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        )}
      </div>

      {/* 快速分类选择 */}
      {showQuickFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const colors = getCategoryColors(category.id)
              const isSelected = selectedCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : cn(colors.bg, colors.text, colors.hover)
                  )}
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                  {category.count !== undefined && (
                    <span className="ml-1 opacity-75">({category.count})</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 简化版筛选栏 - 只显示分类快速切换
 */
interface QuickFilterBarProps {
  module: ModuleType
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export function QuickFilterBar({
  module,
  selectedCategory,
  onCategoryChange,
  className
}: QuickFilterBarProps) {
  const { categories, getCategoryColors } = useCategories(module)

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => {
        const colors = getCategoryColors(category.id)
        const isSelected = selectedCategory === category.id
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isSelected
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : cn(colors.bg, colors.text, colors.hover)
            )}
          >
            {category.icon && <span className="mr-1.5">{category.icon}</span>}
            {category.name}
            {category.count !== undefined && (
              <span className={cn(
                'ml-2 px-2 py-0.5 text-xs rounded-full',
                isSelected ? 'bg-purple-500' : 'bg-white bg-opacity-50'
              )}>
                {category.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}