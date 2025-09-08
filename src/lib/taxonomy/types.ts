/**
 * 统一的分类和标签系统类型定义
 */

// 分类颜色配置
export interface CategoryColors {
  bg: string
  text: string
  border: string
  hover: string
}

// 分类定义
export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  colors: CategoryColors
  count?: number
}

// 标签定义
export interface Tag {
  id: string
  name: string
  count?: number
  trending?: boolean
}

// 模块类型
export type ModuleType = 'resources' | 'posts' | 'vibes'

// 分类配置
export interface CategoryConfig {
  module: ModuleType
  categories: Category[]
  defaultCategory?: string
}

// 标签配置
export interface TagConfig {
  module: ModuleType
  tags: Tag[]
  maxTags?: number
  allowCustom?: boolean
}

// 筛选器状态
export interface FilterState {
  category: string
  tags: string[]
  search: string
  sortBy?: 'latest' | 'popular' | 'trending'
}

// 分类管理器接口
export interface ITaxonomyManager {
  getCategories(module: ModuleType): Category[]
  getCategory(module: ModuleType, categoryId: string): Category | undefined
  getDefaultCategory(module: ModuleType): Category | undefined
  getCategoryByName(module: ModuleType, categoryName: string): Category | undefined
  getCategoryColors(module: ModuleType, categoryId: string): CategoryColors
  formatCategoryName(category: Category): string
  getCategoryStats(module: ModuleType): Record<string, number>
  getTags(module: ModuleType): Tag[]
  getPopularTags(module: ModuleType, limit?: number): Tag[]
  getTrendingTags(module: ModuleType, limit?: number): Tag[]
  searchTags(module: ModuleType, query: string): Tag[]
  getMaxTags(module: ModuleType): number
  allowsCustomTags(module: ModuleType): boolean
  validateTags(module: ModuleType, tags: string[]): boolean
}