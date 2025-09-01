import { CategoryConfig, TagConfig } from '../types'

/**
 * Vibes模块的分类配置
 * Vibes更偏向于动态和即时分享，分类较为宽泛
 */
export const vibesCategoryConfig: CategoryConfig = {
  module: 'vibes',
  defaultCategory: 'all',
  categories: [
    {
      id: 'all',
      name: '全部动态',
      description: '所有编程动态',
      icon: '🌟',
      colors: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-200'
      }
    },
    {
      id: 'coding',
      name: '编程心得',
      description: '编程感悟和技巧分享',
      icon: '💻',
      colors: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        hover: 'hover:bg-green-200'
      },
      count: 85
    },
    {
      id: 'learning',
      name: '学习分享',
      description: '学习进度和笔记',
      icon: '📖',
      colors: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        hover: 'hover:bg-blue-200'
      },
      count: 62
    },
    {
      id: 'project',
      name: '项目动态',
      description: '项目进展和成果',
      icon: '🚀',
      colors: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
        hover: 'hover:bg-purple-200'
      },
      count: 43
    },
    {
      id: 'debug',
      name: '调试日志',
      description: 'Bug修复和调试经验',
      icon: '🐛',
      colors: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        hover: 'hover:bg-red-200'
      },
      count: 31
    },
    {
      id: 'tips',
      name: '技巧分享',
      description: '编程技巧和快捷方式',
      icon: '💡',
      colors: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
        hover: 'hover:bg-yellow-200'
      },
      count: 58
    },
    {
      id: 'discussion',
      name: '技术讨论',
      description: '技术观点和讨论',
      icon: '💬',
      colors: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-700',
        border: 'border-cyan-300',
        hover: 'hover:bg-cyan-200'
      },
      count: 27
    }
  ]
}

/**
 * Vibes模块的标签配置
 * Vibes的标签更加自由和动态
 */
export const vibesTagConfig: TagConfig = {
  module: 'vibes',
  maxTags: 5,  // Vibes限制标签数量，保持简洁
  allowCustom: true,  // 允许用户自定义标签
  tags: [
    // 技术栈标签
    { id: 'react', name: 'React', count: 120, trending: true },
    { id: 'nextjs', name: 'Next.js', count: 98, trending: true },
    { id: 'typescript', name: 'TypeScript', count: 85 },
    { id: 'nodejs', name: 'Node.js', count: 76 },
    { id: 'python', name: 'Python', count: 65 },
    { id: 'tailwind', name: 'Tailwind CSS', count: 58 },
    { id: 'vue', name: 'Vue.js', count: 45 },
    { id: 'golang', name: 'Go', count: 38 },
    { id: 'rust', name: 'Rust', count: 32, trending: true },
    
    // 主题标签
    { id: 'frontend', name: '前端开发', count: 145 },
    { id: 'backend', name: '后端开发', count: 98 },
    { id: 'fullstack', name: '全栈开发', count: 67 },
    { id: 'mobile', name: '移动开发', count: 43 },
    { id: 'database', name: '数据库', count: 52 },
    { id: 'devops', name: 'DevOps', count: 38 },
    
    // 活动标签
    { id: 'learning', name: '学习笔记', count: 89 },
    { id: 'project', name: '项目分享', count: 76 },
    { id: 'debug', name: '调试经验', count: 54 },
    { id: 'code-snippet', name: '代码片段', count: 68 },
    { id: 'tips', name: '技巧分享', count: 72 },
    { id: 'review', name: '代码审查', count: 31 },
    { id: 'refactor', name: '重构', count: 28 },
    
    // 工具标签
    { id: 'vscode', name: 'VS Code', count: 45 },
    { id: 'git', name: 'Git', count: 52 },
    { id: 'docker', name: 'Docker', count: 35 },
    { id: 'webpack', name: 'Webpack', count: 22 },
    { id: 'vite', name: 'Vite', count: 28, trending: true },
    
    // 情绪/状态标签
    { id: 'excited', name: '兴奋', count: 42 },
    { id: 'stuck', name: '卡住了', count: 35 },
    { id: 'solved', name: '已解决', count: 58 },
    { id: 'eureka', name: '灵感', count: 31 },
    { id: 'help', name: '求助', count: 26 }
  ]
}