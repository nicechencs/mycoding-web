import { CategoryConfig, TagConfig } from '../types'

/**
 * Resources模块的分类配置
 */
export const resourcesCategoryConfig: CategoryConfig = {
  module: 'resources',
  defaultCategory: 'all',
  categories: [
    {
      id: 'all',
      name: '全部资源',
      description: '所有学习资源',
      icon: '📚',
      colors: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-200',
      },
    },
    {
      id: 'frontend',
      name: '前端开发',
      description: '现代前端技术和框架资源',
      icon: '🎨',
      colors: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        hover: 'hover:bg-blue-200',
      },
      count: 25,
    },
    {
      id: 'backend',
      name: '后端开发',
      description: '服务端技术和架构资源',
      icon: '⚙️',
      colors: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
      },
      count: 18,
    },
    {
      id: 'database',
      name: '数据库',
      description: '数据库设计和优化资源',
      icon: '🗄️',
      colors: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
      },
      count: 12,
    },
    {
      id: 'mobile',
      name: '移动开发',
      description: 'iOS、Android和跨平台开发',
      icon: '📱',
      colors: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
      },
      count: 15,
    },
    {
      id: 'ai',
      name: '人工智能',
      description: 'AI、机器学习和深度学习',
      icon: '🤖',
      colors: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        hover: 'hover:bg-red-200',
      },
      count: 20,
    },
    {
      id: 'cloud',
      name: '云计算',
      description: '云服务和DevOps工具',
      icon: '☁️',
      colors: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
      },
      count: 10,
    },
  ],
}

/**
 * Resources模块的标签配置
 */
export const resourcesTagConfig: TagConfig = {
  module: 'resources',
  maxTags: 10,
  allowCustom: false,
  tags: [
    { id: 'nextjs', name: 'Next.js', count: 42, trending: true },
    { id: 'react', name: 'React', count: 38, trending: true },
    { id: 'typescript', name: 'TypeScript', count: 35 },
    { id: 'tailwind', name: 'Tailwind CSS', count: 28 },
    { id: 'nodejs', name: 'Node.js', count: 25 },
    { id: 'python', name: 'Python', count: 22 },
    { id: 'golang', name: 'Go', count: 18 },
    { id: 'rust', name: 'Rust', count: 15 },
    { id: 'docker', name: 'Docker', count: 20 },
    { id: 'kubernetes', name: 'Kubernetes', count: 16 },
    { id: 'aws', name: 'AWS', count: 14 },
    { id: 'postgresql', name: 'PostgreSQL', count: 12 },
    { id: 'mongodb', name: 'MongoDB', count: 11 },
    { id: 'redis', name: 'Redis', count: 10 },
    { id: 'graphql', name: 'GraphQL', count: 9 },
    { id: 'webpack', name: 'Webpack', count: 8 },
    { id: 'vite', name: 'Vite', count: 12, trending: true },
    { id: 'vue', name: 'Vue.js', count: 15 },
    { id: 'flutter', name: 'Flutter', count: 13 },
    { id: 'react-native', name: 'React Native', count: 11 },
  ],
}
