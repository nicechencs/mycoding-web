/**
 * MyCoding 统一配色系统
 * 遵循 3+1 配色原则：主色+辅色+状态色+中性色
 */

// 3+1配色原则：主色+辅色+状态色+中性色
export const colors = {
  // 品牌主色 - 蓝色系
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // 主品牌色
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // 辅助色 - 紫色系（限制使用）
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
  },
  
  // 状态色系 - 语义化颜色
  status: {
    success: '#10b981', // green-500
    warning: '#f59e0b', // yellow-500
    error: '#ef4444',   // red-500
    info: '#3b82f6',    // blue-500
  },
  
  // 中性色系
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  }
} as const

/**
 * 获取配色值的辅助函数
 */
export const getColor = {
  primary: (shade: keyof typeof colors.primary = 600) => colors.primary[shade],
  secondary: (shade: keyof typeof colors.secondary = 600) => colors.secondary[shade],
  status: (type: keyof typeof colors.status) => colors.status[type],
  neutral: (shade: keyof typeof colors.neutral.gray) => colors.neutral.gray[shade],
  white: () => colors.neutral.white,
}

/**
 * Tailwind CSS 类名生成器
 */
export const colorClasses = {
  primary: {
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-50',
    bgHover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    textLight: 'text-blue-700',
    border: 'border-blue-200',
    ring: 'ring-blue-500',
  },
  secondary: {
    bg: 'bg-purple-600',
    bgLight: 'bg-purple-50',
    bgHover: 'hover:bg-purple-700',
    text: 'text-purple-600',
    textLight: 'text-purple-700',
    border: 'border-purple-200',
    ring: 'ring-purple-500',
  },
  neutral: {
    bg: 'bg-gray-100',
    bgHover: 'hover:bg-gray-200',
    text: 'text-gray-700',
    textLight: 'text-gray-500',
    border: 'border-gray-200',
    ring: 'ring-gray-500',
  }
} as const

/**
 * 语义化配色方案
 */
export const semanticColors = {
  interactive: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    ghost: 'hover:bg-blue-50 text-blue-600',
  },
  feedback: {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }
} as const

export type ColorTheme = keyof typeof colorClasses
export type SemanticColorType = keyof typeof semanticColors.interactive | keyof typeof semanticColors.feedback