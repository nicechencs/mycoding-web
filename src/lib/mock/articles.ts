import { Article } from '@/types'
import { mockUsers } from './users'

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Next.js 14 App Router 深度解析',
    content: '# Next.js 14 App Router 深度解析\n\nNext.js 14带来了全新的App Router，彻底改变了我们构建React应用的方式...',
    excerpt: 'Next.js 14的App Router引入了基于文件系统的路由、布局、加载状态等新特性，让我们一起深入了解这些变化。',
    slug: 'nextjs-14-app-router-deep-dive',
    author: mockUsers[0],
    category: '前端开发',
    tags: ['Next.js', 'App Router', 'React'],
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-25'),
    featured: true,
  },
  {
    id: '2',
    title: '构建现代化的React组件库',
    content: '# 构建现代化的React组件库\n\n在这篇文章中，我们将学习如何从零开始构建一个现代化的React组件库...',
    excerpt: '学习如何使用TypeScript、Storybook和现代化工具链构建可复用的React组件库。',
    slug: 'building-modern-react-component-library',
    author: mockUsers[1],
    category: '前端开发',
    tags: ['React', '组件库', 'TypeScript', 'Storybook'],
    viewCount: 980,
    likeCount: 67,
    commentCount: 15,
    createdAt: new Date('2024-08-18'),
    updatedAt: new Date('2024-08-20'),
    featured: true,
  },
  {
    id: '3',
    title: 'Node.js 微服务架构最佳实践',
    content: '# Node.js 微服务架构最佳实践\n\n微服务架构已经成为现代应用开发的主流选择...',
    excerpt: '探讨Node.js微服务架构的设计原则、服务拆分策略和运维最佳实践。',
    slug: 'nodejs-microservices-best-practices',
    author: mockUsers[2],
    category: '后端开发',
    tags: ['Node.js', '微服务', '架构设计'],
    viewCount: 756,
    likeCount: 45,
    commentCount: 12,
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-16'),
  },
  {
    id: '4',
    title: 'Tailwind CSS 高级技巧与实战',
    content: '# Tailwind CSS 高级技巧与实战\n\nTailwind CSS不仅仅是一个工具类优先的CSS框架...',
    excerpt: '深入探讨Tailwind CSS的高级特性，包括自定义配置、组件提取和性能优化。',
    slug: 'tailwind-css-advanced-tips-and-tricks',
    author: mockUsers[3],
    category: '前端开发',
    tags: ['Tailwind CSS', 'CSS', '性能优化'],
    viewCount: 642,
    likeCount: 38,
    commentCount: 8,
    createdAt: new Date('2024-08-12'),
    updatedAt: new Date('2024-08-13'),
  },
  {
    id: '5',
    title: 'PostgreSQL 查询优化实战指南',
    content: '# PostgreSQL 查询优化实战指南\n\n数据库查询性能优化是后端开发中的重要技能...',
    excerpt: '通过实际案例学习PostgreSQL查询优化技巧，包括索引设计和执行计划分析。',
    slug: 'postgresql-query-optimization-guide',
    author: mockUsers[4],
    category: '数据库',
    tags: ['PostgreSQL', '查询优化', '数据库'],
    viewCount: 523,
    likeCount: 31,
    commentCount: 7,
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-11'),
    featured: true,
  },
  {
    id: '6',
    title: 'React Native 性能优化策略',
    content: '# React Native 性能优化策略\n\n移动应用的性能直接影响用户体验...',
    excerpt: 'React Native应用的性能优化技巧，包括渲染优化、内存管理和包体积优化。',
    slug: 'react-native-performance-optimization',
    author: mockUsers[0],
    category: '移动开发',
    tags: ['React Native', '性能优化', '移动开发'],
    viewCount: 445,
    likeCount: 28,
    commentCount: 6,
    createdAt: new Date('2024-08-08'),
    updatedAt: new Date('2024-08-09'),
  },
]

export const getFeaturedArticles = (): Article[] => {
  return mockArticles.filter(article => article.featured)
}

export const getArticlesByCategory = (category: string): Article[] => {
  return mockArticles.filter(article => article.category === category)
}

export const getArticleBySlug = (slug: string): Article | undefined => {
  return mockArticles.find(article => article.slug === slug)
}

export const getLatestArticles = (limit: number = 6): Article[] => {
  return mockArticles
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}