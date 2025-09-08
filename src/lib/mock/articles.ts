import { Article, Comment } from '@/types'
import { mockUsers } from './users'

// 文章评论数据
export const mockArticleComments: Comment[] = [
  {
    id: '1',
    content:
      '这篇关于Next.js 14的文章写得太好了！App Router确实是一个重大更新，对开发体验有很大提升。',
    author: mockUsers[1],
    createdAt: new Date('2024-08-21'),
    updatedAt: new Date('2024-08-21'),
  },
  {
    id: '2',
    content:
      '感谢作者的详细解析，特别是关于布局和加载状态的部分，对我的项目很有帮助。',
    author: mockUsers[2],
    createdAt: new Date('2024-08-22'),
    updatedAt: new Date('2024-08-22'),
  },
  {
    id: '3',
    content: '文章内容很详实，但希望能够有更多实际代码示例就更好了。',
    author: mockUsers[3],
    createdAt: new Date('2024-08-23'),
    updatedAt: new Date('2024-08-23'),
  },
  {
    id: '4',
    content:
      'React组件库的构建确实是一个复杂的话题，这篇文章提供了很好的思路。',
    author: mockUsers[4],
    createdAt: new Date('2024-08-19'),
    updatedAt: new Date('2024-08-19'),
  },
  {
    id: '5',
    content:
      'Storybook的集成部分写得特别棒，我按照文章的步骤成功搭建了自己的组件库。',
    author: mockUsers[0],
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
  },
]

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Next.js 14 App Router 深度解析',
    content: `# Next.js 14 App Router 深度解析

Next.js 14带来了全新的App Router，彻底改变了我们构建React应用的方式。这个新的路由系统基于React Server Components，为开发者提供了更强大的功能和更好的性能。

## App Router的主要特性

### 1. 基于文件系统的路由
App Router使用文件系统来定义路由结构，使得路由配置更加直观和简洁：

\`\`\`
app/
├── page.tsx          // 对应 /
├── about/
│   └── page.tsx      // 对应 /about
└── blog/
    ├── page.tsx      // 对应 /blog
    └── [slug]/
        └── page.tsx  // 对应 /blog/[slug]
\`\`\`

### 2. 布局系统（Layouts）
新的布局系统让我们能够在路由间共享UI，并且支持嵌套布局：

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>导航栏</header>
        {children}
        <footer>页脚</footer>
      </body>
    </html>
  )
}
\`\`\`

### 3. 加载状态（Loading States）
App Router提供了内置的加载状态处理：

\`\`\`tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">加载中...</div>
}
\`\`\`

### 4. 错误处理（Error Boundaries）
新增了错误边界处理机制：

\`\`\`tsx
// app/blog/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了!</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
\`\`\`

## 服务端组件 vs 客户端组件

### 服务端组件（默认）
- 在服务器上渲染
- 可以直接访问后端资源
- 更小的客户端包体积
- 更好的SEO

### 客户端组件
- 需要显式声明 'use client'
- 支持交互性和状态管理
- 可以使用浏览器API

\`\`\`tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  )
}
\`\`\`

## 数据获取

App Router简化了数据获取的流程：

\`\`\`tsx
// 服务端组件中的数据获取
async function getData() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function Blog() {
  const posts = await getData()
  
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
\`\`\`

## 路由组（Route Groups）

使用括号来创建路由组，不影响URL结构：

\`\`\`
app/
├── (marketing)/
│   ├── about/
│   └── contact/
└── (shop)/
    ├── checkout/
    └── products/
\`\`\`

## 并行路由（Parallel Routes）

支持在同一布局中同时渲染多个页面：

\`\`\`
app/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
└── @team/
    └── page.tsx
\`\`\`

## 拦截路由（Intercepting Routes）

可以拦截路由并在不同上下文中显示：

\`\`\`
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (..)photo/
        └── [id]/
            └── page.tsx
\`\`\`

## 性能优化

App Router带来了多项性能改进：

1. **自动代码分割**: 每个路由自动进行代码分割
2. **预加载**: 智能预加载可见链接
3. **流式渲染**: 支持React 18的并发特性
4. **部分预渲染**: 静态和动态内容的最佳结合

## 迁移策略

从Pages Router迁移到App Router的建议：

1. 采用增量迁移策略
2. 首先迁移简单页面
3. 处理共享组件
4. 更新数据获取逻辑
5. 测试和优化

## 总结

Next.js 14的App Router代表了React全栈开发的未来方向。通过Server Components、改进的路由系统和更好的开发体验，它为构建现代Web应用提供了强大的工具。

虽然学习曲线存在，但投资学习App Router将为你的项目带来长期的收益。建议在新项目中采用App Router，并逐步将现有项目迁移过来。`,
    excerpt:
      'Next.js 14的App Router引入了基于文件系统的路由、布局、加载状态等新特性，让我们一起深入了解这些变化。',
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
    content:
      '# 构建现代化的React组件库\n\n在这篇文章中，我们将学习如何从零开始构建一个现代化的React组件库...',
    excerpt:
      '学习如何使用TypeScript、Storybook和现代化工具链构建可复用的React组件库。',
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
    content:
      '# Node.js 微服务架构最佳实践\n\n微服务架构已经成为现代应用开发的主流选择...',
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
    content:
      '# Tailwind CSS 高级技巧与实战\n\nTailwind CSS不仅仅是一个工具类优先的CSS框架...',
    excerpt:
      '深入探讨Tailwind CSS的高级特性，包括自定义配置、组件提取和性能优化。',
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
    content:
      '# PostgreSQL 查询优化实战指南\n\n数据库查询性能优化是后端开发中的重要技能...',
    excerpt:
      '通过实际案例学习PostgreSQL查询优化技巧，包括索引设计和执行计划分析。',
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
    excerpt:
      'React Native应用的性能优化技巧，包括渲染优化、内存管理和包体积优化。',
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

// 获取文章评论
export const getArticleComments = (articleId: string): Comment[] => {
  // 模拟根据文章ID获取评论，这里返回前几个评论作为示例
  const commentMapping: { [key: string]: string[] } = {
    '1': ['1', '2', '3'], // Next.js文章的评论
    '2': ['4', '5'], // React组件库文章的评论
  }

  const commentIds = commentMapping[articleId] || []
  return mockArticleComments.filter(comment => commentIds.includes(comment.id))
}

// 获取相关文章
export const getRelatedArticles = (
  articleSlug: string,
  limit: number = 3
): Article[] => {
  const currentArticle = getArticleBySlug(articleSlug)
  if (!currentArticle) return []

  // 基于相同标签或分类推荐相关文章
  return mockArticles
    .filter(
      article =>
        article.slug !== articleSlug &&
        (article.category === currentArticle.category ||
          article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}
