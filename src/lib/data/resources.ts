// 资源模拟数据
import { Resource, ResourceComment, ResourceRating } from '@/types/resource'

export const mockResources: Resource[] = [
  {
    id: '1',
    slug: 'react-developer-tools',
    title: 'React Developer Tools',
    description: '用于调试React应用的浏览器扩展，提供组件树查看、状态检查等功能',
    detailedDescription: `React Developer Tools 是 Facebook 官方推出的浏览器扩展工具，专门用于调试 React 应用程序。

主要功能：
• 组件树查看：可视化展示组件层级结构
• Props 和 State 检查：实时查看和编辑组件属性和状态
• 性能分析：识别渲染瓶颈和优化机会
• Hooks 调试：查看 Hooks 的调用顺序和值
• 搜索功能：快速定位特定组件

支持平台：
• Chrome、Firefox、Edge 等主流浏览器
• 支持 React 16+ 和 React Native
• 可用于生产和开发环境

使用技巧：
1. 使用 Profiler 标签页分析性能问题
2. 通过 Components 标签页实时编辑 props 进行调试
3. 利用搜索功能快速定位深层嵌套的组件`,
    url: 'https://react.dev/learn/react-developer-tools',
    category: '前端开发',
    tags: ['React', '调试工具', '浏览器扩展', '开发工具'],
    author: 'Meta',
    authorId: 'meta',
    authorAvatar: '/avatars/meta.png',
    rating: 4.8,
    ratingCount: 2456,
    ratingDistribution: {
      5: 1800,
      4: 456,
      3: 150,
      2: 30,
      1: 20
    },
    viewCount: 45000,
    likeCount: 3200,
    commentCount: 89,
    downloadCount: 15000,
    featured: true,
    screenshots: ['/screenshots/react-devtools-1.png', '/screenshots/react-devtools-2.png'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    slug: 'vscode-es7-snippets',
    title: 'ES7+ React/Redux/React-Native Snippets',
    description: 'VS Code扩展，提供ES7+语法的React/Redux代码片段',
    detailedDescription: `这个VS Code扩展为React、Redux和React Native开发提供了大量实用的代码片段，极大提高开发效率。

核心特性：
• 100+ 代码片段模板
• 支持 ES7+ 最新语法
• 函数组件和类组件快速生成
• Redux 相关代码片段
• React Native 专用片段

常用片段：
• rafce → React Arrow Function Component Export
• rcc → React Class Component
• useState → React useState Hook
• useEffect → React useEffect Hook
• redux → Redux Action Creator

安装方法：
1. 打开 VS Code
2. 进入扩展市场
3. 搜索 "ES7+ React/Redux/React-Native snippets"
4. 点击安装即可使用`,
    url: 'https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets',
    category: '前端开发',
    tags: ['VSCode', 'React', 'Redux', '代码片段', '效率工具'],
    author: 'dsznajder',
    authorId: 'dsznajder',
    rating: 4.6,
    ratingCount: 1234,
    ratingDistribution: {
      5: 800,
      4: 300,
      3: 100,
      2: 20,
      1: 14
    },
    viewCount: 28000,
    likeCount: 2100,
    commentCount: 56,
    downloadCount: 8900,
    featured: true,
    screenshots: ['/screenshots/vscode-snippets-1.png'],
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: '3',
    slug: 'postman-api-testing',
    title: 'Postman',
    description: 'API开发和测试平台，支持REST、GraphQL、WebSocket等',
    detailedDescription: `Postman 是全球最流行的 API 开发协作平台，让 API 开发更简单、更快速。

主要功能：
• API 请求构建和测试
• 自动化测试脚本
• 团队协作和共享
• API 文档自动生成
• Mock 服务器
• 监控和性能测试

适用场景：
• RESTful API 测试
• GraphQL 查询
• WebSocket 连接
• SOAP 请求
• gRPC 调用

高级特性：
• 环境变量管理
• 数据驱动测试
• CI/CD 集成
• Newman CLI 工具
• API 版本控制`,
    url: 'https://www.postman.com/',
    category: '后端开发',
    tags: ['API测试', 'REST', 'GraphQL', '自动化测试'],
    author: 'Postman Inc.',
    authorId: 'postman',
    rating: 4.7,
    ratingCount: 3456,
    ratingDistribution: {
      5: 2500,
      4: 700,
      3: 200,
      2: 40,
      1: 16
    },
    viewCount: 67000,
    likeCount: 4500,
    commentCount: 123,
    downloadCount: 25000,
    featured: true,
    screenshots: ['/screenshots/postman-1.png', '/screenshots/postman-2.png'],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-12-05')
  }
]

export const mockComments: ResourceComment[] = [
  {
    id: 'c1',
    resourceId: '1',
    userId: 'u1',
    userName: '张三',
    userAvatar: '/avatars/user1.png',
    content: '非常好用的调试工具，帮我解决了很多React组件的问题。特别是Profiler功能，对性能优化帮助很大！',
    rating: 5,
    likeCount: 15,
    isLiked: false,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    replies: [
      {
        id: 'c1-r1',
        resourceId: '1',
        userId: 'u2',
        userName: '李四',
        content: '同意！Profiler真的很实用，我用它找出了好几个性能瓶颈。',
        likeCount: 3,
        isLiked: false,
        parentId: 'c1',
        createdAt: new Date('2024-12-02'),
        updatedAt: new Date('2024-12-02')
      }
    ]
  },
  {
    id: 'c2',
    resourceId: '1',
    userId: 'u3',
    userName: '王五',
    content: '组件树查看功能很直观，但是在大型项目中有时会有点卡顿。',
    rating: 4,
    likeCount: 8,
    isLiked: true,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: 'c3',
    resourceId: '1',
    userId: 'u4',
    userName: '赵六',
    content: 'Hooks调试功能是我最喜欢的部分，可以清楚地看到每个Hook的值变化。',
    rating: 5,
    likeCount: 12,
    isLiked: false,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25')
  }
]

export const mockRatings: ResourceRating[] = [
  {
    id: 'r1',
    resourceId: '1',
    userId: 'u1',
    userName: '张三',
    rating: 5,
    review: '功能强大，是React开发必备工具',
    helpful: 23,
    createdAt: new Date('2024-12-01')
  },
  {
    id: 'r2',
    resourceId: '1',
    userId: 'u3',
    userName: '王五',
    rating: 4,
    review: '很好用，但在大项目中性能需要优化',
    helpful: 15,
    createdAt: new Date('2024-11-28')
  }
]

// 数据获取函数（模拟API）
export async function getResourceById(id: string): Promise<Resource | null> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockResources.find(r => r.id === id) || null
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockResources.find(r => r.slug === slug) || null
}

export async function getResourceComments(resourceId: string): Promise<ResourceComment[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockComments.filter(c => c.resourceId === resourceId)
}

export async function getResourceRatings(resourceId: string): Promise<ResourceRating[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockRatings.filter(r => r.resourceId === resourceId)
}

export async function getRelatedResources(resourceId: string, limit: number = 3): Promise<Resource[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const currentResource = mockResources.find(r => r.id === resourceId)
  if (!currentResource) return []
  
  // 根据类别和标签查找相关资源
  return mockResources
    .filter(r => r.id !== resourceId && 
      (r.category === currentResource.category || 
       r.tags.some(tag => currentResource.tags.includes(tag))))
    .slice(0, limit)
}