import { 
  Category, 
  CategoryColors, 
  Tag, 
  ModuleType, 
  ITaxonomyManager,
  CategoryConfig,
  TagConfig 
} from './types'
import { resourcesCategoryConfig, resourcesTagConfig } from './config/resources'
import { postsCategoryConfig, postsTagConfig } from './config/posts'
import { vibesCategoryConfig, vibesTagConfig } from './config/vibes'

/**
 * 统一的分类和标签管理器
 * 使用单例模式确保全局一致性
 */
export class TaxonomyManager implements ITaxonomyManager {
  private static instance: TaxonomyManager
  private categoryConfigs: Map<ModuleType, CategoryConfig>
  private tagConfigs: Map<ModuleType, TagConfig>
  
  // 默认颜色配置
  private defaultColors: CategoryColors = {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-200'
  }

  private constructor() {
    // 初始化分类配置
    this.categoryConfigs = new Map([
      ['resources', resourcesCategoryConfig],
      ['posts', postsCategoryConfig],
      ['vibes', vibesCategoryConfig]
    ])
    
    // 初始化标签配置
    this.tagConfigs = new Map([
      ['resources', resourcesTagConfig],
      ['posts', postsTagConfig],
      ['vibes', vibesTagConfig]
    ])
  }

  /**
   * 获取单例实例
   */
  static getInstance(): TaxonomyManager {
    if (!TaxonomyManager.instance) {
      TaxonomyManager.instance = new TaxonomyManager()
    }
    return TaxonomyManager.instance
  }

  /**
   * 获取指定模块的所有分类
   */
  getCategories(module: ModuleType): Category[] {
    const config = this.categoryConfigs.get(module)
    return config?.categories || []
  }

  /**
   * 获取指定模块的特定分类
   */
  getCategory(module: ModuleType, categoryId: string): Category | undefined {
    const categories = this.getCategories(module)
    return categories.find(cat => cat.id === categoryId)
  }

  /**
   * 获取分类颜色配置
   */
  getCategoryColors(module: ModuleType, categoryId: string): CategoryColors {
    const category = this.getCategory(module, categoryId)
    return category?.colors || this.defaultColors
  }

  /**
   * 根据分类名称查找分类（兼容旧代码）
   */
  getCategoryByName(module: ModuleType, categoryName: string): Category | undefined {
    const categories = this.getCategories(module)
    return categories.find(cat => cat.name === categoryName)
  }

  /**
   * 获取指定模块的默认分类
   */
  getDefaultCategory(module: ModuleType): string {
    const config = this.categoryConfigs.get(module)
    return config?.defaultCategory || 'all'
  }

  /**
   * 获取指定模块的所有标签
   */
  getTags(module: ModuleType): Tag[] {
    const config = this.tagConfigs.get(module)
    return config?.tags || []
  }

  /**
   * 获取热门标签
   */
  getPopularTags(module: ModuleType, limit: number = 10): Tag[] {
    const tags = this.getTags(module)
    return tags
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, limit)
  }

  /**
   * 获取趋势标签
   */
  getTrendingTags(module: ModuleType, limit: number = 5): Tag[] {
    const tags = this.getTags(module)
    return tags
      .filter(tag => tag.trending)
      .slice(0, limit)
  }

  /**
   * 搜索标签
   */
  searchTags(module: ModuleType, query: string): Tag[] {
    const tags = this.getTags(module)
    const lowerQuery = query.toLowerCase()
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 检查模块是否允许自定义标签
   */
  allowsCustomTags(module: ModuleType): boolean {
    const config = this.tagConfigs.get(module)
    return config?.allowCustom || false
  }

  /**
   * 获取模块的最大标签数量
   */
  getMaxTags(module: ModuleType): number {
    const config = this.tagConfigs.get(module)
    return config?.maxTags || 10
  }

  /**
   * 验证标签是否有效
   */
  validateTags(module: ModuleType, tags: string[]): boolean {
    const maxTags = this.getMaxTags(module)
    if (tags.length > maxTags) {
      return false
    }
    
    if (!this.allowsCustomTags(module)) {
      const validTags = this.getTags(module).map(t => t.name)
      return tags.every(tag => validTags.includes(tag))
    }
    
    return true
  }

  /**
   * 格式化分类名称（用于显示）
   */
  formatCategoryName(category: Category): string {
    return category.icon ? `${category.icon} ${category.name}` : category.name
  }

  /**
   * 获取分类统计信息
   */
  getCategoryStats(module: ModuleType): { total: number; categories: Array<{ id: string; name: string; count: number }> } {
    const categories = this.getCategories(module)
    const stats = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat.count || 0
      }))
    
    const total = stats.reduce((sum, cat) => sum + cat.count, 0)
    
    return { total, categories: stats }
  }
}

// 导出单例实例
export const taxonomyManager = TaxonomyManager.getInstance()

// 便捷函数导出
export const getModuleCategories = (module: ModuleType) => 
  taxonomyManager.getCategories(module)

export const getModuleTags = (module: ModuleType) => 
  taxonomyManager.getTags(module)

export const getCategoryColors = (module: ModuleType, categoryId: string) =>
  taxonomyManager.getCategoryColors(module, categoryId)