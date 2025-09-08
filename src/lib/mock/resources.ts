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
    slug: 'nextjs-14-docs',
    description: 'Next.js 14的完整官方文档，包含App Router、Server Components等新特性的详细说明。这是学习现代React开发的必备资源，涵盖了从基础概念到高级特性的全面内容。',
    detailedDescription: `
      Next.js 14 是一个强大的 React 框架，提供了出色的开发体验和生产优化。这份官方文档涵盖了框架的所有方面，是学习和掌握 Next.js 的最权威资源。
      
      ## 主要特性
      
      ### App Router
      全新的基于文件系统的路由器，支持布局、嵌套路由、加载状态、错误处理等功能。它建立在 React Server Components 之上，提供了更强大和灵活的路由能力。
      
      ### Server Components
      默认情况下，组件在服务器上渲染，这带来了更小的客户端包大小和更快的页面加载速度。你可以在需要时轻松地选择客户端渲染。
      
      ### 数据获取
      新的数据获取方法使得在组件级别获取数据变得简单直观。支持静态生成、服务器端渲染和客户端获取的混合使用。
      
      ### 优化功能
      内置的图像、字体和脚本优化功能，确保应用程序获得最佳性能。自动代码分割和预取功能让应用加载更快。
      
      ## 适合人群
      - React 开发者想要构建生产级应用
      - 全栈开发者需要一个完整的解决方案
      - 团队寻找具有良好开发体验的框架
      - 任何想要学习现代 Web 开发最佳实践的人
      
      ## 学习路径
      1. 从基础概念开始，理解 Next.js 的核心思想
      2. 学习 App Router 的使用方法
      3. 掌握数据获取和缓存策略
      4. 了解优化和部署最佳实践
      5. 探索高级特性如中间件、国际化等
    `,
    url: 'https://nextjs.org/docs',
    category: '前端开发',
    tags: ['Next.js', 'React', '官方文档'],
    rating: 4.9,
    ratingCount: 1250,
    ratingDistribution: { 5: 1080, 4: 150, 3: 15, 2: 3, 1: 2 },
    author: 'Vercel团队',
    authorId: 'vercel',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vercel',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-08-15'),
    featured: true,
    screenshots: [
      'https://nextjs.org/static/images/learn/foundations/next-app.png',
      'https://nextjs.org/static/images/learn/data-fetching/static-site-generation.png',
      'https://nextjs.org/static/images/learn/seo/how-googlebot-works.png'
    ],
    viewCount: 15600,
    likeCount: 890,
    commentCount: 156,
    downloadCount: 0
  },
  {
    id: '2',
    title: 'React 18 新特性详解',
    slug: 'react-18-features',
    description: 'React 18引入的并发特性、Suspense、自动批处理等新功能的深入解析。全面解释了React 18的核心改进和性能优化策略。',
    detailedDescription: `
      React 18 是 React 的重大版本更新，引入了许多期待已久的特性和改进。这个版本专注于改善用户体验和开发者体验，特别是在处理大型应用时的性能问题。
      
      ## 核心新特性
      
      ### 并发渲染（Concurrent Rendering）
      React 18 最重要的特性是并发渲染。它允许 React 同时准备多个版本的 UI，可以中断渲染来处理更紧急的更新，然后恢复之前的工作。这使得应用能够保持响应，即使在进行大量计算时。
      
      ### 自动批处理（Automatic Batching）
      React 18 扩展了批处理的范围，现在 Promise、setTimeout、原生事件处理器等场景下的状态更新都会自动批处理。这意味着更少的渲染次数和更好的性能。
      
      ### Suspense 的改进
      Suspense 现在支持服务器端渲染和并发特性。你可以使用 Suspense 来声明式地处理加载状态，让代码更清晰。
      
      ### 新的 Hooks
      - useId: 生成唯一 ID，支持服务器端渲染
      - useTransition: 标记非紧急更新
      - useDeferredValue: 延迟更新某个值
      - useSyncExternalStore: 订阅外部数据源
      
      ## 性能优化
      
      React 18 通过以下方式提升性能：
      - 更智能的更新调度
      - 减少不必要的渲染
      - 更好的内存管理
      - 改进的 Hydration 过程
      
      ## 迁移指南
      
      从 React 17 迁移到 React 18 相对简单：
      1. 更新依赖版本
      2. 使用新的 createRoot API
      3. 逐步采用新特性
      4. 测试并优化性能
    `,
    url: 'https://react.dev/blog/2022/03/29/react-v18',
    category: '前端开发',
    tags: ['React', 'React 18', '并发特性'],
    rating: 4.8,
    ratingCount: 980,
    ratingDistribution: { 5: 780, 4: 150, 3: 35, 2: 10, 1: 5 },
    author: 'React团队',
    authorId: 'react-team',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-08-10'),
    featured: true,
    screenshots: [
      'https://react.dev/images/docs/diagrams/use_client_module_dependency.png',
      'https://react.dev/images/docs/diagrams/use_client_render_tree.png'
    ],
    viewCount: 12400,
    likeCount: 720,
    commentCount: 89,
    downloadCount: 0
  },
  {
    id: '3',
    title: 'TypeScript 5.0 新功能',
    slug: 'typescript-5-features',
    description: 'TypeScript 5.0版本的**新增功能**、性能改进和重大变更。包含**装饰器**、const assertion、模板字面量类型等重要特性。支持`ES2022装饰器`提案。',
    detailedDescription: `
      TypeScript 5.0 是一个重要的版本更新，带来了许多令人兴奋的新特性和改进。这个版本专注于提升开发者体验和代码质量。

      ## 主要新特性

      ### 装饰器（Decorators）正式支持
      TypeScript 5.0 正式支持了 ES2022 装饰器提案，这是一个等待已久的功能：

      \`\`\`typescript
      function logged<T extends Record<string, (...args: unknown[]) => unknown>>(
        target: T, 
        key: keyof T, 
        descriptor: PropertyDescriptor
      ) {
        const original = descriptor.value;
        descriptor.value = function(...args: unknown[]) {
          // 日志装饰器示例 - 实际使用时可用更适合的日志工具
          return original.apply(this, args);
        };
      }

      class Calculator {
        @logged
        add(a: number, b: number) {
          return a + b;
        }
      }
      \`\`\`

      ### const 断言的增强
      现在可以在更多场景中使用 const 断言，提供更精确的类型推断：

      \`\`\`typescript
      const routes = [
        { path: '/home', component: 'Home' },
        { path: '/about', component: 'About' }
      ] as const;
      // routes 的类型现在是只读的元组类型
      \`\`\`

      ### 模板字面量类型改进
      模板字面量类型现在支持更复杂的模式匹配：

      \`\`\`typescript
      type EventName<T extends string> = \`on\${Capitalize<T>}\`;
      type ClickEvent = EventName<'click'>; // "onClick"
      \`\`\`

      ## 性能优化

      - **更快的类型检查**: 编译器性能提升 10-20%
      - **更小的内存占用**: 减少了内存使用
      - **改进的增量编译**: 更智能的缓存策略

      ## 破坏性变更

      ### 严格的 null 检查改进
      对 null 和 undefined 的检查更加严格，可能需要更新现有代码。

      ### 更严格的函数类型检查
      函数参数和返回值的类型检查更加严格。

      ## 升级建议

      1. **渐进式升级**: 不要一次性升级所有代码
      2. **使用 TypeScript 迁移工具**: 自动化处理大部分升级工作
      3. **更新类型定义**: 确保第三方库的类型定义兼容
      4. **测试覆盖**: 升级后进行充分的测试

      这个版本为 TypeScript 生态系统带来了显著的改进，是值得升级的重要版本。
    `,
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html',
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    rating: 4.7,
    ratingCount: 765,
    ratingDistribution: { 5: 500, 4: 200, 3: 50, 2: 10, 1: 5 },
    author: 'Microsoft',
    authorId: 'microsoft',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-08-05'),
    screenshots: [],
    viewCount: 8900,
    likeCount: 456,
    commentCount: 67,
    downloadCount: 0,
    featured: false
  },
  {
    id: '4',
    title: 'Tailwind CSS 实用指南',
    slug: 'tailwind-css-guide',
    description: '从基础到高级的Tailwind CSS实用教程，涵盖响应式设计和自定义配置。全面讲解实用工具类的使用方法和最佳实践。',
    url: 'https://tailwindcss.com/docs',
    category: '前端开发',
    tags: ['Tailwind CSS', 'CSS', '响应式设计'],
    rating: 4.6,
    ratingCount: 652,
    ratingDistribution: { 5: 400, 4: 180, 3: 50, 2: 15, 1: 7 },
    author: 'Tailwind团队',
    authorId: 'tailwind',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tailwind',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-07-30'),
    screenshots: [],
    viewCount: 7300,
    likeCount: 389,
    commentCount: 45,
    downloadCount: 0,
    featured: false
  },
  {
    id: '5',
    title: 'Node.js 性能优化指南',
    slug: 'nodejs-performance-guide',
    description: 'Node.js应用的性能监控、内存管理和并发优化最佳实践。详细介绍了性能分析工具和优化技巧。',
    url: 'https://nodejs.org/en/docs/guides/simple-profiling',
    category: '后端开发',
    tags: ['Node.js', '性能优化', '监控'],
    rating: 4.5,
    ratingCount: 543,
    ratingDistribution: { 5: 300, 4: 180, 3: 40, 2: 15, 1: 8 },
    author: 'Node.js社区',
    authorId: 'nodejs',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nodejs',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-07-25'),
    screenshots: [],
    viewCount: 6100,
    likeCount: 298,
    commentCount: 34,
    downloadCount: 0,
    featured: false
  },
  {
    id: '6',
    title: 'PostgreSQL 高级特性',
    slug: 'postgresql-advanced',
    description: 'PostgreSQL数据库的高级特性：索引优化、分区表、窗口函数等。包含JSON支持、全文搜索和高级查询优化。',
    url: 'https://www.postgresql.org/docs/current/',
    category: '数据库',
    tags: ['PostgreSQL', '数据库', '索引优化'],
    rating: 4.4,
    ratingCount: 421,
    ratingDistribution: { 5: 200, 4: 150, 3: 50, 2: 15, 1: 6 },
    author: 'PostgreSQL团队',
    authorId: 'postgresql',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=postgresql',
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-07-20'),
    screenshots: [],
    viewCount: 5200,
    likeCount: 267,
    commentCount: 28,
    downloadCount: 0,
    featured: false
  },
  {
    id: '7',
    title: 'React Native 开发实战',
    slug: 'react-native-guide',
    description: 'React Native跨平台移动应用开发的完整指南和最佳实践。包括组件开发、导航系统和原生模块集成。',
    url: 'https://reactnative.dev/docs/getting-started',
    category: '移动开发',
    tags: ['React Native', '移动开发', '跨平台'],
    rating: 4.3,
    ratingCount: 378,
    ratingDistribution: { 5: 180, 4: 120, 3: 50, 2: 20, 1: 8 },
    author: 'Meta团队',
    authorId: 'meta',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meta',
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2024-07-15'),
    screenshots: [],
    viewCount: 4800,
    likeCount: 234,
    commentCount: 22,
    downloadCount: 0,
    featured: false
  },
  {
    id: '8',
    title: 'Python机器学习入门',
    slug: 'python-ml-intro',
    description: '使用Python进行机器学习的基础教程，包含scikit-learn和pandas。从数据预处理到模型训练和评估的全流程指导。',
    url: 'https://scikit-learn.org/stable/tutorial/index.html',
    category: '人工智能',
    tags: ['Python', '机器学习', 'scikit-learn'],
    rating: 4.7,
    ratingCount: 892,
    ratingDistribution: { 5: 600, 4: 200, 3: 60, 2: 20, 1: 12 },
    author: 'scikit-learn团队',
    authorId: 'sklearn',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sklearn',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-28'),
    featured: true,
    screenshots: [],
    viewCount: 9800,
    likeCount: 567,
    commentCount: 78,
    downloadCount: 0
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

export const getResourceBySlug = (slug: string): Resource | undefined => {
  return mockResources.find(resource => resource.slug === slug)
}

// Mock comments
export const mockResourceComments: ResourceComment[] = [
  {
    id: '1',
    resourceId: '1',
    userId: mockUsers[0].id,
    userName: mockUsers[0].name,
    userAvatar: mockUsers[0].avatar,
    content: 'Next.js 14 的 App Router 确实是一个革命性的改进，让组件级别的数据获取变得更加直观。文档写得很详细，特别是对于新手来说非常友好。',
    rating: 5,
    likeCount: 24,
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
    isLiked: false,
  },
  {
    id: '2',
    resourceId: '1',
    userId: mockUsers[1].id,
    userName: mockUsers[1].name,
    userAvatar: mockUsers[1].avatar,
    content: '同意楼上的观点！另外 Server Components 的概念也很棒，能显著提升性能。不过学习曲线还是有点陡峭的。',
    rating: 4,
    likeCount: 12,
    createdAt: new Date('2024-08-22'),
    updatedAt: new Date('2024-08-22'),
    isLiked: true,
  },
  {
    id: '3',
    resourceId: '1',
    userId: mockUsers[2].id,
    userName: mockUsers[2].name,
    userAvatar: mockUsers[2].avatar,
    content: '有没有人知道 App Router 和传统的 Pages Router 在性能上的具体差异？',
    parentId: '1',
    likeCount: 8,
    createdAt: new Date('2024-08-23'),
    updatedAt: new Date('2024-08-23'),
    isLiked: false,
  },
  {
    id: '4',
    resourceId: '2',
    userId: mockUsers[1].id,
    userName: mockUsers[1].name,
    userAvatar: mockUsers[1].avatar,
    content: 'React 18 的并发特性真的很强大，特别是对于大型应用的性能优化效果明显。Suspense 的改进也让数据加载变得更加优雅。',
    rating: 5,
    likeCount: 18,
    createdAt: new Date('2024-08-21'),
    updatedAt: new Date('2024-08-21'),
    isLiked: false,
  },
  {
    id: '5',
    resourceId: '3',
    userId: mockUsers[0].id,
    userName: mockUsers[0].name,
    userAvatar: mockUsers[0].avatar,
    content: 'TypeScript 5.0 的装饰器支持终于稳定了，这对于使用类组件和依赖注入的项目来说是个好消息。',
    rating: 5,
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