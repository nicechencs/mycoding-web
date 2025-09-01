import { CategoryConfig, TagConfig } from '../types'

/**
 * Posts模块的分类配置
 */
export const postsCategoryConfig: CategoryConfig = {
  module: 'posts',
  defaultCategory: 'all',
  categories: [
    {
      id: 'all',
      name: '全部内容',
      description: '所有文章和内容',
      icon: '📝',
      colors: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-200'
      }
    },
    {
      id: 'tech-article',
      name: '技术文章',
      description: '深度技术分析和教程',
      icon: '💻',
      colors: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        hover: 'hover:bg-blue-200'
      },
      count: 45
    },
    {
      id: 'project',
      name: '项目推荐',
      description: '优秀开源项目推荐',
      icon: '🚀',
      colors: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
        hover: 'hover:bg-purple-200'
      },
      count: 23
    },
    {
      id: 'study-notes',
      name: '学习笔记',
      description: '学习记录和心得',
      icon: '📚',
      colors: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        hover: 'hover:bg-green-200'
      },
      count: 38
    },
    {
      id: 'experience',
      name: '经验分享',
      description: '开发经验和最佳实践',
      icon: '💡',
      colors: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
        hover: 'hover:bg-yellow-200'
      },
      count: 29
    },
    {
      id: 'tools',
      name: '工具资源',
      description: '开发工具和资源推荐',
      icon: '🛠️',
      colors: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300',
        hover: 'hover:bg-orange-200'
      },
      count: 17
    },
    {
      id: 'career',
      name: '职业发展',
      description: '职业规划和面试经验',
      icon: '🎯',
      colors: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        border: 'border-indigo-300',
        hover: 'hover:bg-indigo-200'
      },
      count: 12
    }
  ]
}

/**
 * Posts模块的标签配置
 */
export const postsTagConfig: TagConfig = {
  module: 'posts',
  maxTags: 15,
  allowCustom: true,
  tags: [
    // 前端相关
    { id: 'frontend', name: '前端开发', count: 52 },
    { id: 'react', name: 'React', count: 45, trending: true },
    { id: 'vue', name: 'Vue.js', count: 32 },
    { id: 'angular', name: 'Angular', count: 18 },
    { id: 'nextjs', name: 'Next.js', count: 38, trending: true },
    { id: 'nuxt', name: 'Nuxt.js', count: 15 },
    { id: 'typescript', name: 'TypeScript', count: 42 },
    { id: 'javascript', name: 'JavaScript', count: 48 },
    { id: 'css', name: 'CSS', count: 35 },
    { id: 'tailwind', name: 'Tailwind CSS', count: 28 },
    
    // 后端相关
    { id: 'backend', name: '后端开发', count: 38 },
    { id: 'nodejs', name: 'Node.js', count: 35 },
    { id: 'python', name: 'Python', count: 32 },
    { id: 'golang', name: 'Go', count: 22 },
    { id: 'java', name: 'Java', count: 25 },
    { id: 'rust', name: 'Rust', count: 18, trending: true },
    { id: 'csharp', name: 'C#', count: 15 },
    
    // 数据库
    { id: 'database', name: '数据库', count: 28 },
    { id: 'postgresql', name: 'PostgreSQL', count: 18 },
    { id: 'mysql', name: 'MySQL', count: 20 },
    { id: 'mongodb', name: 'MongoDB', count: 16 },
    { id: 'redis', name: 'Redis', count: 14 },
    
    // 工具和框架
    { id: 'docker', name: 'Docker', count: 22 },
    { id: 'kubernetes', name: 'Kubernetes', count: 18 },
    { id: 'git', name: 'Git', count: 30 },
    { id: 'webpack', name: 'Webpack', count: 12 },
    { id: 'vite', name: 'Vite', count: 15, trending: true },
    
    // 概念和方法
    { id: 'architecture', name: '架构设计', count: 25 },
    { id: 'design-patterns', name: '设计模式', count: 20 },
    { id: 'testing', name: '测试', count: 18 },
    { id: 'performance', name: '性能优化', count: 22 },
    { id: 'security', name: '安全', count: 15 },
    { id: 'devops', name: 'DevOps', count: 20 },
    { id: 'algorithm', name: '算法', count: 16 },
    { id: 'data-structure', name: '数据结构', count: 14 }
  ]
}