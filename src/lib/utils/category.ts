/**
 * 分类管理器 - 统一管理所有分类相关的逻辑
 * 解决代码重复问题，提供单一数据源
 */

export interface CategoryColors {
  bg: string
  text: string
  border?: string
  hover?: string
}

export interface CategoryConfig {
  name: string
  colors: CategoryColors
  icon?: string
  description?: string
}

class CategoryManager {
  private static instance: CategoryManager
  
  // 统一的分类颜色映射
  private readonly colorMap: Record<string, CategoryColors> = {
    '前端开发': { 
      bg: 'bg-blue-100', 
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-200'
    },
    '后端开发': { 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-200'
    },
    '移动开发': { 
      bg: 'bg-purple-100', 
      text: 'text-purple-700',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-200'
    },
    '数据科学': { 
      bg: 'bg-orange-100', 
      text: 'text-orange-700',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-200'
    },
    '人工智能': { 
      bg: 'bg-red-100', 
      text: 'text-red-700',
      border: 'border-red-200',
      hover: 'hover:bg-red-200'
    },
    '云计算': { 
      bg: 'bg-indigo-100', 
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      hover: 'hover:bg-indigo-200'
    },
    '区块链': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-200'
    },
    '游戏开发': { 
      bg: 'bg-pink-100', 
      text: 'text-pink-700',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-200'
    },
    '安全': { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-200'
    },
    '运维': { 
      bg: 'bg-cyan-100', 
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-200'
    },
    'default': { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-200'
    }
  }

  // 分类图标映射
  private readonly iconMap: Record<string, string> = {
    '前端开发': '🎨',
    '后端开发': '⚙️',
    '移动开发': '📱',
    '数据科学': '📊',
    '人工智能': '🤖',
    '云计算': '☁️',
    '区块链': '🔗',
    '游戏开发': '🎮',
    '安全': '🔒',
    '运维': '🛠️'
  }

  /**
   * 获取单例实例
   */
  static getInstance(): CategoryManager {
    if (!CategoryManager.instance) {
      CategoryManager.instance = new CategoryManager()
    }
    return CategoryManager.instance
  }

  /**
   * 获取分类颜色配置
   */
  getCategoryColor(category: string): CategoryColors {
    return this.colorMap[category] || this.colorMap['default']
  }

  /**
   * 获取分类图标
   */
  getCategoryIcon(category: string): string {
    return this.iconMap[category] || '📚'
  }

  /**
   * 获取所有分类
   */
  getAllCategories(): string[] {
    return Object.keys(this.colorMap).filter(key => key !== 'default')
  }

  /**
   * 获取分类完整配置
   */
  getCategoryConfig(category: string): CategoryConfig {
    const colors = this.getCategoryColor(category)
    const icon = this.getCategoryIcon(category)
    return {
      name: category,
      colors,
      icon
    }
  }

  /**
   * 检查分类是否存在
   */
  hasCategory(category: string): boolean {
    return category in this.colorMap && category !== 'default'
  }

  /**
   * 获取分类样式类名（用于className属性）
   */
  getCategoryClasses(category: string, type: 'full' | 'text' | 'bg' = 'full'): string {
    const colors = this.getCategoryColor(category)
    
    switch (type) {
      case 'text':
        return colors.text
      case 'bg':
        return colors.bg
      case 'full':
      default:
        return `${colors.bg} ${colors.text}`
    }
  }
}

// 导出单例实例
export const categoryManager = CategoryManager.getInstance()

// 导出便捷函数
export const getCategoryColor = (category: string) => categoryManager.getCategoryColor(category)
export const getCategoryIcon = (category: string) => categoryManager.getCategoryIcon(category)
export const getCategoryClasses = (category: string, type?: 'full' | 'text' | 'bg') => 
  categoryManager.getCategoryClasses(category, type)