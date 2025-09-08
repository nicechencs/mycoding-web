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

  // 统一的分类颜色映射 - 全部使用蓝色系保持一致性
  private readonly colorMap: Record<string, CategoryColors> = {
    全部: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    前端开发: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    后端开发: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    移动开发: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    'AI & 机器学习': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    数据库: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    云计算: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    DevOps: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    网络安全: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    区块链: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    游戏开发: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    其他: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    default: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
  }

  // 分类图标映射
  private readonly iconMap: Record<string, string> = {
    全部: '📚',
    前端开发: '🎨',
    后端开发: '⚙️',
    移动开发: '📱',
    'AI & 机器学习': '🤖',
    数据库: '💾',
    云计算: '☁️',
    DevOps: '🔧',
    网络安全: '🔐',
    区块链: '⛓️',
    游戏开发: '🎮',
    其他: '📦',
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
      icon,
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
  getCategoryClasses(
    category: string,
    type: 'full' | 'text' | 'bg' = 'full'
  ): string {
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
export const getCategoryColor = (category: string) =>
  categoryManager.getCategoryColor(category)
export const getCategoryIcon = (category: string) =>
  categoryManager.getCategoryIcon(category)
export const getCategoryClasses = (
  category: string,
  type?: 'full' | 'text' | 'bg'
) => categoryManager.getCategoryClasses(category, type)
