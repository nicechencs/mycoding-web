/**
 * 统一的分类和标签系统
 * 
 * 使用示例:
 * 
 * 1. 在组件中使用分类:
 * ```tsx
 * import { useCategories } from '@/lib/taxonomy'
 * 
 * const { categories, getCategoryColors } = useCategories('resources')
 * ```
 * 
 * 2. 在组件中使用标签:
 * ```tsx
 * import { useTags } from '@/lib/taxonomy'
 * 
 * const { selectedTags, addTag, removeTag } = useTags('posts')
 * ```
 * 
 * 3. 直接使用管理器:
 * ```tsx
 * import { taxonomyManager } from '@/lib/taxonomy'
 * 
 * const categories = taxonomyManager.getCategories('vibes')
 * ```
 */

// 导出类型
export type {
  Category,
  CategoryColors,
  Tag,
  ModuleType,
  CategoryConfig,
  TagConfig,
  FilterState,
  ITaxonomyManager
} from './types'

// 导出管理器
export { 
  TaxonomyManager,
  taxonomyManager,
  getModuleCategories,
  getModuleTags,
  getCategoryColors
} from './manager'

// 导出配置
export { resourcesCategoryConfig, resourcesTagConfig } from './config/resources'
export { postsCategoryConfig, postsTagConfig } from './config/posts'
export { vibesCategoryConfig, vibesTagConfig } from './config/vibes'

// 导出Hooks
export { useCategories } from './hooks/useCategories'
export { useTags } from './hooks/useTags'