import type { Category, Tag, ModuleType, ITaxonomyManager, CategoryColors } from './types'
import { resourcesCategoryConfig, resourcesTagConfig } from './config/resources'
import { postsCategoryConfig, postsTagConfig } from './config/posts'
import { vibesCategoryConfig, vibesTagConfig } from './config/vibes'

// 简化的TaxonomyManager类
export class TaxonomyManager implements ITaxonomyManager {
  private static instance: TaxonomyManager
  
  private categories = {
    resources: resourcesCategoryConfig.categories,
    posts: postsCategoryConfig.categories,
    vibes: vibesCategoryConfig.categories
  }
  
  private tags = {
    resources: resourcesTagConfig.tags,
    posts: postsTagConfig.tags,
    vibes: vibesTagConfig.tags
  }
  
  private constructor() {}
  
  static getInstance(): TaxonomyManager {
    if (!TaxonomyManager.instance) {
      TaxonomyManager.instance = new TaxonomyManager()
    }
    return TaxonomyManager.instance
  }
  
  getCategories(module: ModuleType): Category[] {
    return this.categories[module] || []
  }
  
  getCategory(module: ModuleType, categoryId: string): Category | undefined {
    const categories = this.getCategories(module)
    return categories.find(c => c.id === categoryId)
  }
  
  getTags(module: ModuleType): Tag[] {
    return this.tags[module] || []
  }
  
  getTag(module: ModuleType, tagId: string): Tag | undefined {
    const tags = this.getTags(module)
    return tags.find(t => t.id === tagId)
  }
  
  searchTags(module: ModuleType, query: string): Tag[] {
    const tags = this.getTags(module)
    const lowerQuery = query.toLowerCase()
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery)
    )
  }
  
  getPopularTags(module: ModuleType, limit: number = 10): Tag[] {
    const tags = this.getTags(module)
    return tags
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, limit)
  }
  
  // 获取默认分类
  getDefaultCategory(module: ModuleType): Category | undefined {
    const categories = this.getCategories(module)
    return categories.find(c => c.id === 'all') || categories[0]
  }
  
  // 根据名称获取分类
  getCategoryByName(module: ModuleType, categoryName: string): Category | undefined {
    const categories = this.getCategories(module)
    return categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
  }
  
  // 格式化分类名称
  formatCategoryName(category: Category): string {
    return category.name
  }
  
  // 获取分类统计信息
  getCategoryStats(module: ModuleType): Record<string, number> {
    const categories = this.getCategories(module)
    const stats: Record<string, number> = {}
    
    categories.forEach(category => {
      stats[category.id] = category.count || 0
    })
    
    return stats
  }
  
  // 获取热门标签（基于趋势）
  getTrendingTags(module: ModuleType, limit: number = 5): Tag[] {
    const tags = this.getTags(module)
    return tags
      .filter(tag => tag.trending === true)
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, limit)
  }
  
  // 获取最大标签数限制
  getMaxTags(module: ModuleType): number {
    // 不同模块可以有不同的标签数限制
    const limits = {
      resources: 5,
      posts: 8,
      vibes: 3
    }
    return limits[module] || 5
  }
  
  // 检查是否允许自定义标签
  allowsCustomTags(module: ModuleType): boolean {
    // 不同模块对自定义标签的策略
    const allowCustom = {
      resources: false, // 资源模块不允许自定义标签
      posts: true,      // 文章模块允许自定义标签  
      vibes: false      // 氛围模块不允许自定义标签
    }
    return allowCustom[module] || false
  }
  
  // 验证标签数组是否有效
  validateTags(module: ModuleType, tags: string[]): boolean {
    const maxTags = this.getMaxTags(module)
    const allowsCustom = this.allowsCustomTags(module)
    
    // 检查标签数量限制
    if (tags.length > maxTags) {
      return false
    }
    
    // 如果不允许自定义标签，检查所有标签是否都在预定义列表中
    if (!allowsCustom) {
      const validTags = this.getTags(module).map(t => t.name)
      return tags.every(tag => validTags.includes(tag))
    }
    
    return true
  }
  
  getCategoryColors(module: ModuleType, categoryId: string): CategoryColors {
    const category = this.getCategory(module, categoryId)
    if (!category) {
      // 返回默认颜色
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-200'
      }
    }
    return category.colors
  }
}

// 导出单例实例
export const taxonomyManager = TaxonomyManager.getInstance()

// 导出便捷函数
export function getModuleCategories(module: ModuleType): Category[] {
  return taxonomyManager.getCategories(module)
}

export function getModuleTags(module: ModuleType): Tag[] {
  return taxonomyManager.getTags(module)
}

export function getCategoryColors(module: ModuleType): Record<string, { bg: string; text: string }> {
  const categories = taxonomyManager.getCategories(module)
  const colors: Record<string, { bg: string; text: string }> = {}
  
  categories.forEach(category => {
    colors[category.id] = {
      bg: category.colors.bg,
      text: category.colors.text
    }
  })
  
  return colors
}