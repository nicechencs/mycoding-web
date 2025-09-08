'use client'

import { useMemo } from 'react'
import { Category, ModuleType } from '../types'
import { taxonomyManager } from '../manager'

/**
 * Hook for accessing categories in React components
 */
export function useCategories(module: ModuleType) {
  const categories = useMemo(() => {
    return taxonomyManager.getCategories(module)
  }, [module])

  const defaultCategory = useMemo(() => {
    return taxonomyManager.getDefaultCategory(module)
  }, [module])

  const getCategoryById = (categoryId: string): Category | undefined => {
    return taxonomyManager.getCategory(module, categoryId)
  }

  const getCategoryByName = (categoryName: string): Category | undefined => {
    return taxonomyManager.getCategoryByName(module, categoryName)
  }

  const getCategoryColors = (categoryId: string) => {
    return taxonomyManager.getCategoryColors(module, categoryId)
  }

  const formatCategory = (category: Category): string => {
    return taxonomyManager.formatCategoryName(category)
  }

  const stats = useMemo(() => {
    return taxonomyManager.getCategoryStats(module)
  }, [module])

  return {
    categories,
    defaultCategory,
    getCategoryById,
    getCategoryByName,
    getCategoryColors,
    formatCategory,
    stats,
  }
}
