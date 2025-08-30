import { useMemo } from 'react'

export interface Category {
  id: string
  name: string
  color?: string
  bgColor?: string
  textColor?: string
  count?: number
}

// 预定义的分类颜色方案
const defaultCategoryColors: Record<string, { bg: string; text: string }> = {
  '前端开发': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '后端开发': { bg: 'bg-green-100', text: 'text-green-700' },
  '移动开发': { bg: 'bg-purple-100', text: 'text-purple-700' },
  '数据库': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'DevOps': { bg: 'bg-red-100', text: 'text-red-700' },
  'AI/ML': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  '技术文章': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '项目推荐': { bg: 'bg-green-100', text: 'text-green-700' },
  '学习笔记': { bg: 'bg-purple-100', text: 'text-purple-700' },
  '经验分享': { bg: 'bg-orange-100', text: 'text-orange-700' },
  '工具资源': { bg: 'bg-red-100', text: 'text-red-700' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-700' }
}

interface UseCategoriesReturn {
  categories: Category[]
  getCategoryColor: (categoryName: string) => { bg: string; text: string }
  getCategoryBadgeClass: (categoryName: string) => string
  getCategoryById: (id: string) => Category | undefined
  getCategoryByName: (name: string) => Category | undefined
  categoryOptions: Array<{ value: string; label: string }>
}

/**
 * 分类管理Hook
 * @param categories 分类列表
 * @param customColors 自定义颜色映射
 * @returns 分类相关的工具方法和数据
 */
export function useCategories(
  categories: Category[],
  customColors?: Record<string, { bg: string; text: string }>
): UseCategoriesReturn {
  const colorMap = { ...defaultCategoryColors, ...customColors }

  const getCategoryColor = useMemo(() => {
    return (categoryName: string) => {
      return colorMap[categoryName] || colorMap['default']
    }
  }, [colorMap])

  const getCategoryBadgeClass = useMemo(() => {
    return (categoryName: string) => {
      const colors = getCategoryColor(categoryName)
      return `inline-block px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text} rounded`
    }
  }, [getCategoryColor])

  const getCategoryById = useMemo(() => {
    return (id: string) => categories.find(cat => cat.id === id)
  }, [categories])

  const getCategoryByName = useMemo(() => {
    return (name: string) => categories.find(cat => cat.name === name)
  }, [categories])

  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  }, [categories])

  return {
    categories,
    getCategoryColor,
    getCategoryBadgeClass,
    getCategoryById,
    getCategoryByName,
    categoryOptions
  }
}

/**
 * 资源分类的预定义列表
 */
export const resourceCategories: Category[] = [
  { id: 'all', name: '全部分类' },
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'database', name: '数据库' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ai-ml', name: 'AI/ML' }
]

/**
 * 文章分类的预定义列表
 */
export const articleCategories: Category[] = [
  { id: 'all', name: '全部内容' },
  { id: 'tech-article', name: '技术文章' },
  { id: 'project-recommend', name: '项目推荐' },
  { id: 'study-notes', name: '学习笔记' },
  { id: 'experience', name: '经验分享' },
  { id: 'tools', name: '工具资源' }
]

/**
 * 获取默认的资源分类Hook
 */
export function useResourceCategories(customColors?: Record<string, { bg: string; text: string }>) {
  return useCategories(resourceCategories, customColors)
}

/**
 * 获取默认的文章分类Hook
 */
export function useArticleCategories(customColors?: Record<string, { bg: string; text: string }>) {
  return useCategories(articleCategories, customColors)
}