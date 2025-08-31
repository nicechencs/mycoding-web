import { Resource, ResourceCategory, ResourceComment, ResourceRating, User, ResourceRatingDistribution } from '@/types'

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

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-08-01'),
  },
]

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Next.js 14 官方文档',
    description: 'Next.js 14的完整官方文档，包含App Router、Server Components等新特性的详细说明。这是学习现代React开发的必备资源，涵盖了从基础概念到高级特性的全面内容。',
    url: 'https://nextjs.org/docs',
    category: '前端开发',
    tags: ['Next.js', 'React', '官方文档'],
    rating: 4.9,
    ratingCount: 1250,
    author: 'Vercel团队',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-08-15'),
    featured: true,
    image: 'https://nextjs.org/static/twitter-cards/nextjs.jpg',
    viewCount: 15600,
    likeCount: 890,
    commentCount: 156,
  },
  {
    id: '2',
    title: 'React 18 新特性详解',
    description: 'React 18引入的并发特性、Suspense、自动批处理等新功能的深入解析。全面解释了React 18的核心改进和性能优化策略。',
    url: 'https://react.dev/blog/2022/03/29/react-v18',
    category: '前端开发',
    tags: ['React', 'React 18', '并发特性'],
    rating: 4.8,
    ratingCount: 980,
    author: 'React团队',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-08-10'),
    featured: true,
    image: 'https://react.dev/images/blog/react-18-launch/react-18-launch.png',
    viewCount: 12400,
    likeCount: 720,
    commentCount: 89,
  },
  {
    id: '3',
    title: 'TypeScript 5.0 新功能',
    description: 'TypeScript 5.0版本的新增功能、性能改进和重大变更。包含装饰器、const assertion、模板字面量类型等重要特性。',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html',
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    rating: 4.7,
    ratingCount: 765,
    author: 'Microsoft',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-08-05'),
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png',
    viewCount: 8900,
    likeCount: 456,
    commentCount: 67,
  },
  {
    id: '4',
    title: 'Tailwind CSS 实用指南',
    description: '从基础到高级的Tailwind CSS实用教程，涵盖响应式设计和自定义配置。全面讲解实用工具类的使用方法和最佳实践。',
    url: 'https://tailwindcss.com/docs',
    category: '前端开发',
    tags: ['Tailwind CSS', 'CSS', '响应式设计'],
    rating: 4.6,
    ratingCount: 652,
    author: 'Tailwind团队',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-07-30'),
    image: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.79614a5f61617ba49a0891494521226b.svg',
    viewCount: 7300,
    likeCount: 389,
    commentCount: 45,
  },
  {
    id: '5',
    title: 'Node.js 性能优化指南',
    description: 'Node.js应用的性能监控、内存管理和并发优化最佳实践。详细介绍了性能分析工具和优化技巧。',
    url: 'https://nodejs.org/en/docs/guides/simple-profiling',
    category: '后端开发',
    tags: ['Node.js', '性能优化', '监控'],
    rating: 4.5,
    ratingCount: 543,
    author: 'Node.js社区',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-07-25'),
    image: 'https://nodejs.org/static/images/logo.svg',
    viewCount: 6100,
    likeCount: 298,
    commentCount: 34,
  },
  {
    id: '6',
    title: 'PostgreSQL 高级特性',
    description: 'PostgreSQL数据库的高级特性：索引优化、分区表、窗口函数等。包含JSON支持、全文搜索和高级查询优化。',
    url: 'https://www.postgresql.org/docs/current/',
    category: '数据库',
    tags: ['PostgreSQL', '数据库', '索引优化'],
    rating: 4.4,
    ratingCount: 421,
    author: 'PostgreSQL团队',
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-07-20'),
    image: 'https://www.postgresql.org/media/img/about/press/elephant.png',
    viewCount: 5200,
    likeCount: 267,
    commentCount: 28,
  },
  {
    id: '7',
    title: 'React Native 开发实战',
    description: 'React Native跨平台移动应用开发的完整指南和最佳实践。包括组件开发、导航系统和原生模块集成。',
    url: 'https://reactnative.dev/docs/getting-started',
    category: '移动开发',
    tags: ['React Native', '移动开发', '跨平台'],
    rating: 4.3,
    ratingCount: 378,
    author: 'Meta团队',
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2024-07-15'),
    image: 'https://reactnative.dev/img/header_logo.svg',
    viewCount: 4800,
    likeCount: 234,
    commentCount: 22,
  },
  {
    id: '8',
    title: 'Python机器学习入门',
    description: '使用Python进行机器学习的基础教程，包含scikit-learn和pandas。从数据预处理到模型训练和评估的全流程指导。',
    url: 'https://scikit-learn.org/stable/tutorial/index.html',
    category: '人工智能',
    tags: ['Python', '机器学习', 'scikit-learn'],
    rating: 4.7,
    ratingCount: 892,
    author: 'scikit-learn团队',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-28'),
    featured: true,
    image: 'https://scikit-learn.org/stable/_static/scikit-learn-logo-small.png',
    viewCount: 9800,
    likeCount: 567,
    commentCount: 78,
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

// Mock comments
export const mockResourceComments: ResourceComment[] = [
  {
    id: '1',
    resourceId: '1',
    content: 'Next.js 14 的 App Router 确实是一个革命性的改进，让组件级别的数据获取变得更加直观。文档写得很详细，特别是对于新手来说非常友好。',
    author: mockUsers[0],
    likeCount: 24,
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
    isLiked: false,
  },
  {
    id: '2',
    resourceId: '1',
    content: '同意楼上的观点！另外 Server Components 的概念也很棒，能显著提升性能。不过学习曲线还是有点陡峭的。',
    author: mockUsers[1],
    likeCount: 12,
    createdAt: new Date('2024-08-22'),
    updatedAt: new Date('2024-08-22'),
    isLiked: true,
  },
  {
    id: '3',
    resourceId: '1',
    content: '有没有人知道 App Router 和传统的 Pages Router 在性能上的具体差异？',
    author: mockUsers[2],
    parentId: '1',
    likeCount: 8,
    createdAt: new Date('2024-08-23'),
    updatedAt: new Date('2024-08-23'),
    isLiked: false,
  },
  {
    id: '4',
    resourceId: '2',
    content: 'React 18 的并发特性真的很强大，特别是对于大型应用的性能优化效果明显。Suspense 的改进也让数据加载变得更加优雅。',
    author: mockUsers[1],
    likeCount: 18,
    createdAt: new Date('2024-08-21'),
    updatedAt: new Date('2024-08-21'),
    isLiked: false,
  },
  {
    id: '5',
    resourceId: '3',
    content: 'TypeScript 5.0 的装饰器支持终于稳定了，这对于使用类组件和依赖注入的项目来说是个好消息。',
    author: mockUsers[0],
    likeCount: 15,
    createdAt: new Date('2024-08-19'),
    updatedAt: new Date('2024-08-19'),
    isLiked: true,
  },
]

// Mock ratings
export const mockResourceRatings: ResourceRating[] = [
  { id: '1', resourceId: '1', userId: '1', rating: 5, createdAt: new Date('2024-08-20') },
  { id: '2', resourceId: '1', userId: '2', rating: 5, createdAt: new Date('2024-08-21') },
  { id: '3', resourceId: '1', userId: '3', rating: 4, createdAt: new Date('2024-08-22') },
  { id: '4', resourceId: '2', userId: '1', rating: 5, createdAt: new Date('2024-08-20') },
  { id: '5', resourceId: '2', userId: '3', rating: 4, createdAt: new Date('2024-08-21') },
  { id: '6', resourceId: '3', userId: '2', rating: 5, createdAt: new Date('2024-08-19') },
]

// Helper functions
export const getResourceComments = (resourceId: string): ResourceComment[] => {
  const comments = mockResourceComments.filter(comment => 
    comment.resourceId === resourceId && !comment.parentId
  )
  
  return comments.map(comment => ({
    ...comment,
    replies: mockResourceComments.filter(reply => reply.parentId === comment.id)
  }))
}

export const getResourceRatings = (resourceId: string): ResourceRating[] => {
  return mockResourceRatings.filter(rating => rating.resourceId === resourceId)
}

export const getResourceRatingDistribution = (resourceId: string): ResourceRatingDistribution => {
  const ratings = getResourceRatings(resourceId)
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  ratings.forEach(rating => {
    distribution[rating.rating as keyof ResourceRatingDistribution]++
  })
  
  return distribution
}

export const getRelatedResources = (resourceId: string, limit: number = 4): Resource[] => {
  const currentResource = getResourceById(resourceId)
  if (!currentResource) return []
  
  return mockResources
    .filter(resource => 
      resource.id !== resourceId && 
      (resource.category === currentResource.category || 
       resource.tags.some(tag => currentResource.tags.includes(tag)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}