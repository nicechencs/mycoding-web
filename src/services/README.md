# 统一数据服务架构

本文档介绍完整的统一数据服务架构的使用方法和最佳实践。

## 架构概述

### 三层架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        业务层 (Components)                  │
├─────────────────────────────────────────────────────────────┤
│                       数据层 (Hooks + SWR)                   │
├─────────────────────────────────────────────────────────────┤
│                      服务层 (Services)                       │
├─────────────────────────────────────────────────────────────┤
│                  基础设施层 (API Client + Cache)             │
└─────────────────────────────────────────────────────────────┘
```

- **基础设施层**: HTTP客户端、缓存管理、类型定义
- **服务层**: 具体业务服务（文章、资源、动态、用户）
- **数据层**: SWR Hooks，提供数据获取和状态管理
- **业务层**: React组件，消费数据和处理用户交互

## 快速开始

### 1. 基本使用

```tsx
import { useArticles, useUser } from '@/hooks'

function ArticlesList() {
  // 获取文章列表
  const { articles, loading, error } = useArticles({
    page: 1,
    limit: 10,
    sortBy: 'latest',
  })

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

### 2. 搜索和筛选

```tsx
import { useSearchResources } from '@/hooks'

function ResourcesSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const { resources, loading } = useSearchResources(query, {
    filters: { category: category !== 'all' ? category : undefined },
    sortBy: 'rating',
  })

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="搜索资源..."
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">所有分类</option>
        <option value="frontend">前端开发</option>
        <option value="backend">后端开发</option>
      </select>

      {loading ? (
        <div>搜索中...</div>
      ) : (
        resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))
      )}
    </div>
  )
}
```

### 3. 用户操作

```tsx
import { useUserActions, useCurrentUser } from '@/hooks'

function UserProfile() {
  const { user, loading } = useCurrentUser()
  const { updateUser } = useUserActions()

  const handleUpdateProfile = async data => {
    try {
      const result = await updateUser(user.id, data)
      if (result.success) {
        toast.success('更新成功')
      }
    } catch (error) {
      toast.error('更新失败')
    }
  }

  return <div>{/* 用户资料表单 */}</div>
}
```

## 核心特性

### 1. 环境适配

系统自动检测环境并切换数据源：

- **开发模式**: 使用Mock数据，无需后端API
- **生产模式**: 调用真实API接口

```typescript
// 自动环境检测
if (isDevelopment()) {
  // 使用Mock数据
  const articles = getFeaturedArticles()
  return { success: true, data: articles }
} else {
  // 调用API
  const response = await this.apiClient.get('/articles/featured')
  return response
}
```

### 2. 智能缓存

多层缓存策略：

```typescript
// 内存缓存
const cached = this.cache.get(cacheKey)
if (cached) return cached

// SWR缓存
const { data } = useSWR(cacheKey, fetcher, {
  refreshInterval: 5 * 60 * 1000, // 5分钟
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
})
```

### 3. 类型安全

完整的TypeScript类型支持：

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

### 4. 错误处理

统一的错误处理机制：

```typescript
const { data, error, loading } = useArticles()

// error 包含了所有可能的错误信息
if (error) {
  // 网络错误、API错误、业务逻辑错误等
  console.error('获取文章失败:', error)
}
```

## 最佳实践

### 1. 组合Hooks

对于需要多个数据源的组件，使用组合hooks：

```tsx
function ArticleDetailPage({ slug }: { slug: string }) {
  const { article, loading: articleLoading } = useArticle(slug)
  const { comments, loading: commentsLoading } = useArticleComments(
    article?.id || ''
  )
  const { articles: related, loading: relatedLoading } =
    useRelatedArticles(slug)

  const loading = articleLoading || commentsLoading || relatedLoading

  if (loading) return <Loading />

  return (
    <div>
      <ArticleContent article={article} />
      <Comments comments={comments} />
      <RelatedArticles articles={related} />
    </div>
  )
}
```

### 2. 预加载数据

在用户可能访问的页面预加载数据：

```tsx
import { prefetchArticle } from '@/hooks'

function ArticleLink({ slug, children }) {
  const handleMouseEnter = () => {
    // 鼠标悬停时预加载文章数据
    prefetchArticle(slug)
  }

  return (
    <Link href={`/articles/${slug}`} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  )
}
```

### 3. 乐观更新

对于用户操作提供即时反馈：

```tsx
function LikeButton({ articleId, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked)

  const handleLike = async () => {
    // 乐观更新UI
    setLiked(!liked)

    try {
      await likeArticle(articleId)
      // 成功，UI已经更新
    } catch (error) {
      // 失败，回滚UI状态
      setLiked(liked)
      toast.error('操作失败')
    }
  }

  return <button onClick={handleLike}>{liked ? '❤️' : '🤍'}</button>
}
```

### 4. 条件数据获取

根据条件决定是否获取数据：

```tsx
function UserProfile({ userId }: { userId?: string }) {
  // 只有userId存在时才获取数据
  const { user, loading } = useUser(userId || '', {
    suspense: false, // 避免在userId为空时报错
  })

  if (!userId) {
    return <div>请先登录</div>
  }

  if (loading) return <Loading />

  return <UserCard user={user} />
}
```

## 性能优化

### 1. 请求去重

SWR自动处理相同请求的去重：

```typescript
// 这两个组件会共享同一个请求
function Header() {
  const { user } = useCurrentUser();
  return <UserAvatar user={user} />;
}

function Sidebar() {
  const { user } = useCurrentUser(); // 不会发送重复请求
  return <UserMenu user={user} />;
}
```

### 2. 缓存策略

根据数据特性设置不同的缓存策略：

```typescript
// 用户信息 - 缓存时间长
const { user } = useUser(id, {
  refreshInterval: 10 * 60 * 1000, // 10分钟
})

// 实时动态 - 缓存时间短
const { vibes } = useLatestVibes(10, {
  refreshInterval: 30 * 1000, // 30秒
})

// 静态资源 - 长期缓存
const { categories } = useResourceCategories({
  refreshInterval: 30 * 60 * 1000, // 30分钟
})
```

### 3. 按需加载

使用Suspense和lazy loading：

```tsx
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  )
}
```

## 调试和监控

### 1. 开发模式日志

开发模式下自动启用详细日志：

```typescript
// 在浏览器控制台中可以看到：
[API Client - REQUEST] { method: 'GET', url: '/api/articles' }
[API Client - RESPONSE] { url: '/api/articles', result: {...} }
[Cache Manager] Set cache: articles:list:{"page":1}
```

### 2. 缓存统计

获取缓存使用情况：

```typescript
import { ServiceManager } from '@/services'

// 获取缓存统计信息
const stats = ServiceManager.getCacheStats()
console.log('缓存统计:', stats)
// { totalItems: 25, expiredItems: 3, activeItems: 22, maxSize: 100 }

// 清理过期缓存
const cleanedCount = ServiceManager.cleanupCache()
console.log('清理了', cleanedCount, '个过期缓存项')
```

### 3. 错误监控

集成错误监控服务：

```typescript
// 在错误拦截器中上报错误
apiClient.addErrorInterceptor(async error => {
  // 上报到错误监控服务
  errorReportingService.captureException(error)
  return error
})
```

## 扩展指南

### 1. 添加新服务

1. 创建服务类：

```typescript
// src/services/new-service.service.ts
export class NewService {
  // 实现INewService接口
}
export const newService = new NewService()
```

2. 创建对应的Hooks：

```typescript
// src/hooks/use-new-service.ts
export function useNewData() {
  return useSWR('new-data', () => newService.getData())
}
```

3. 在索引文件中导出：

```typescript
// src/services/index.ts
export { NewService, newService } from './new-service.service'
```

### 2. 自定义缓存策略

```typescript
// 创建专用缓存实例
const customCache = new CacheManager({
  ttl: 30 * 60 * 1000, // 30分钟
  maxSize: 50,
  enabled: true,
})

// 在服务中使用
export class CustomService {
  constructor() {
    this.cache = customCache
  }
}
```

### 3. 添加中间件

```typescript
// 添加请求拦截器
apiClient.addRequestInterceptor(config => {
  // 添加认证头
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

// 添加响应拦截器
apiClient.addResponseInterceptor(response => {
  // 处理特殊响应
  if (response.data?.needsRefresh) {
    refreshToken()
  }
  return response
})
```

## 常见问题

### Q: 如何切换到生产环境？

A: 设置环境变量：

```bash
# .env.local
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.yoursite.com
```

### Q: 如何自定义缓存时间？

A: 在Hook中传入选项：

```typescript
const { data } = useArticles(
  {},
  {
    refreshInterval: 2 * 60 * 1000, // 2分钟
  }
)
```

### Q: 如何处理认证？

A: 在API客户端中添加认证拦截器：

```typescript
apiClient.addRequestInterceptor(config => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Q: 如何实现无限滚动？

A: 使用SWR的无限加载功能：

```typescript
import useSWRInfinite from 'swr/infinite'

function useInfiniteArticles() {
  const { data, error, size, setSize } = useSWRInfinite(
    index => ['articles:list', { page: index + 1 }],
    ([_, params]) => articlesService.getArticles(params)
  )

  const articles = data ? data.flatMap(page => page.data) : []
  const isLoading = !data && !error
  const hasMore = data?.[data.length - 1]?.pagination?.hasNext ?? true

  return {
    articles,
    isLoading,
    hasMore,
    loadMore: () => setSize(size + 1),
  }
}
```

## 总结

这个统一数据服务架构提供了：

- ✅ **环境适配**: 开发和生产环境无缝切换
- ✅ **类型安全**: 完整的TypeScript支持
- ✅ **智能缓存**: 多层缓存提升性能
- ✅ **错误处理**: 统一的错误处理机制
- ✅ **数据同步**: SWR提供的数据同步和重新验证
- ✅ **开发体验**: 丰富的调试信息和工具

通过这个架构，你可以快速构建高性能、可维护的数据驱动应用。
