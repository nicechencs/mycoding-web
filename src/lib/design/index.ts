/**
 * MyCoding 设计系统统一导出
 */

export * from './colors'

// 常用配色类组合
export const designTokens = {
  // 交互元素
  interactive: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus-visible:ring-gray-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500',
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus-visible:ring-blue-500',
  },
  
  // 状态反馈
  feedback: {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  
  // 卡片样式
  card: {
    base: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    hover: 'hover:shadow-lg hover:border-gray-300 transition-all duration-200',
    interactive: 'cursor-pointer transform hover:-translate-y-1',
  },
  
  // 标签样式
  tag: {
    category: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    default: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  }
} as const

// 语义化颜色映射
export const semanticColors = {
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600', 
    muted: 'text-gray-500',
    accent: 'text-blue-600',
  },
  background: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    accent: 'bg-blue-50',
  },
  border: {
    default: 'border-gray-200',
    accent: 'border-blue-200',
  }
} as const