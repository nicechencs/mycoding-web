import { useState, useMemo, useCallback } from 'react'

export interface FilterConfig<T> {
  searchFields?: (keyof T)[]
  categoryField?: keyof T
  initialCategory?: string
  initialSearch?: string
}

interface UseFilterReturn<T> {
  filteredItems: T[]
  selectedCategory: string
  searchQuery: string
  setSelectedCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
  hasActiveFilters: boolean
}

/**
 * 通用的筛选和搜索Hook
 * @param items 要筛选的数据列表
 * @param config 筛选配置
 * @returns 筛选后的数据和控制方法
 */
export function useFilter<T extends Record<string, any>>(
  items: T[],
  config: FilterConfig<T> = {}
): UseFilterReturn<T> {
  const {
    searchFields = [],
    categoryField,
    initialCategory = 'all',
    initialSearch = '',
  } = config

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const filteredItems = useMemo(() => {
    let filtered = [...items]

    // 分类筛选
    if (categoryField && selectedCategory !== 'all') {
      filtered = filtered.filter(
        item => item[categoryField] === selectedCategory
      )
    }

    // 搜索筛选
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          if (Array.isArray(value)) {
            return value.some(
              (v: any) =>
                typeof v === 'string' && v.toLowerCase().includes(query)
            )
          }
          return false
        })
      })
    }

    return filtered
  }, [items, selectedCategory, searchQuery, categoryField, searchFields])

  const resetFilters = useCallback(() => {
    setSelectedCategory(initialCategory)
    setSearchQuery(initialSearch)
  }, [initialCategory, initialSearch])

  const hasActiveFilters =
    selectedCategory !== initialCategory || searchQuery !== initialSearch

  return {
    filteredItems,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  }
}

/**
 * 带分页功能的筛选Hook
 */
interface UseFilterWithPaginationConfig<T> extends FilterConfig<T> {
  itemsPerPage?: number
  initialPage?: number
}

export function useFilterWithPagination<T extends Record<string, any>>(
  items: T[],
  config: UseFilterWithPaginationConfig<T> = {}
) {
  const { itemsPerPage = 10, initialPage = 1, ...filterConfig } = config

  const filterResult = useFilter(items, filterConfig)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filterResult.filteredItems.slice(startIndex, endIndex)
  }, [filterResult.filteredItems, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filterResult.filteredItems.length / itemsPerPage)

  // 当筛选条件改变时，重置到第一页
  const setSelectedCategory = useCallback(
    (category: string) => {
      filterResult.setSelectedCategory(category)
      setCurrentPage(1)
    },
    [filterResult]
  )

  const setSearchQuery = useCallback(
    (query: string) => {
      filterResult.setSearchQuery(query)
      setCurrentPage(1)
    },
    [filterResult]
  )

  return {
    ...filterResult,
    paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
    setSelectedCategory,
    setSearchQuery,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToNextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
    goToPreviousPage: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
  }
}
