import { Resource, ResourceCategory } from '@/types'

export const mockResourceCategories: ResourceCategory[] = [
  {
    id: '1',
    name: '前端开发',
    description: '现代前端技术和框架资源',
    icon: '🎨',
    count: 25,
  },
  {
    id: '2',
    name: '后端开发',
    description: '服务端技术和架构资源',
    icon: '⚙️',
    count: 18,
  },
  {
    id: '3',
    name: '数据库',
    description: '数据库设计和优化资源',
    icon: '🗄️',
    count: 12,
  },
  {
    id: '4',
    name: '移动开发',
    description: 'iOS、Android和跨平台开发',
    icon: '📱',
    count: 15,
  },
  {
    id: '5',
    name: '人工智能',
    description: 'AI、机器学习和深度学习',
    icon: '🤖',
    count: 20,
  },
  {
    id: '6',
    name: '云计算',
    description: '云服务和DevOps工具',
    icon: '☁️',
    count: 10,
  },
]

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Next.js 14 官方文档',
    description: 'Next.js 14的完整官方文档，包含App Router、Server Components等新特性的详细说明。',
    url: 'https://nextjs.org/docs',
    category: '前端开发',
    tags: ['Next.js', 'React', '官方文档'],
    rating: 4.9,
    author: 'Vercel团队',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-08-15'),
    featured: true,
  },
  {
    id: '2',
    title: 'React 18 新特性详解',
    description: 'React 18引入的并发特性、Suspense、自动批处理等新功能的深入解析。',
    url: 'https://react.dev/blog/2022/03/29/react-v18',
    category: '前端开发',
    tags: ['React', 'React 18', '并发特性'],
    rating: 4.8,
    author: 'React团队',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-08-10'),
    featured: true,
  },
  {
    id: '3',
    title: 'TypeScript 5.0 新功能',
    description: 'TypeScript 5.0版本的新增功能、性能改进和重大变更。',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html',
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    rating: 4.7,
    author: 'Microsoft',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-08-05'),
  },
  {
    id: '4',
    title: 'Tailwind CSS 实用指南',
    description: '从基础到高级的Tailwind CSS实用教程，涵盖响应式设计和自定义配置。',
    url: 'https://tailwindcss.com/docs',
    category: '前端开发',
    tags: ['Tailwind CSS', 'CSS', '响应式设计'],
    rating: 4.6,
    author: 'Tailwind团队',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-07-30'),
  },
  {
    id: '5',
    title: 'Node.js 性能优化指南',
    description: 'Node.js应用的性能监控、内存管理和并发优化最佳实践。',
    url: 'https://nodejs.org/en/docs/guides/simple-profiling',
    category: '后端开发',
    tags: ['Node.js', '性能优化', '监控'],
    rating: 4.5,
    author: 'Node.js社区',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-07-25'),
  },
  {
    id: '6',
    title: 'PostgreSQL 高级特性',
    description: 'PostgreSQL数据库的高级特性：索引优化、分区表、窗口函数等。',
    url: 'https://www.postgresql.org/docs/current/',
    category: '数据库',
    tags: ['PostgreSQL', '数据库', '索引优化'],
    rating: 4.4,
    author: 'PostgreSQL团队',
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: '7',
    title: 'React Native 开发实战',
    description: 'React Native跨平台移动应用开发的完整指南和最佳实践。',
    url: 'https://reactnative.dev/docs/getting-started',
    category: '移动开发',
    tags: ['React Native', '移动开发', '跨平台'],
    rating: 4.3,
    author: 'Meta团队',
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '8',
    title: 'Python机器学习入门',
    description: '使用Python进行机器学习的基础教程，包含scikit-learn和pandas。',
    url: 'https://scikit-learn.org/stable/tutorial/index.html',
    category: '人工智能',
    tags: ['Python', '机器学习', 'scikit-learn'],
    rating: 4.7,
    author: 'scikit-learn团队',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-28'),
    featured: true,
  },
]

export const getResourcesByCategory = (category: string): Resource[] => {
  return mockResources.filter(resource => resource.category === category)
}

export const getFeaturedResources = (): Resource[] => {
  return mockResources.filter(resource => resource.featured)
}

export const getResourceById = (id: string): Resource | undefined => {
  return mockResources.find(resource => resource.id === id)
}