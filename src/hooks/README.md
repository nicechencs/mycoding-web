# Custom Hooks

这个目录包含项目中使用的自定义 React Hooks。

## useResourceDetail

优化的资源详情数据管理 Hook，用于统一管理资源详情页面的数据获取、状态管理和错误处理。

### 基本用法

```tsx
import { useResourceDetail } from '@/hooks/use-resource-detail'

function ResourceDetailPage({ slug }: { slug: string }) {
  const { 
    resource, 
    comments, 
    relatedResources, 
    ratingDistribution,
    loading, 
    error, 
    refresh 
  } = useResourceDetail(slug)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!resource) return <div>Resource not found</div>

  return (
    <div>
      <h1>{resource.title}</h1>
      <p>{resource.description}</p>
      <button onClick={refresh}>刷新数据</button>
      
      {/* 评论列表 */}
      <div>
        {comments.map(comment => (
          <div key={comment.id}>{comment.content}</div>
        ))}
      </div>

      {/* 相关资源 */}
      <div>
        {relatedResources.map(related => (
          <div key={related.id}>{related.title}</div>
        ))}
      </div>
    </div>
  )
}
```

### 特性

- ✅ 统一的数据获取逻辑
- ✅ 完整的 loading/error 状态管理
- ✅ 智能错误处理和重试机制
- ✅ 类型安全的 TypeScript 支持
- ✅ 性能优化（useCallback、useMemo）
- ✅ 数据刷新功能
- ✅ 并行数据获取提升性能

### API

```typescript
interface UseResourceDetailReturn {
  // 数据
  resource: Resource | null
  comments: ResourceComment[]
  relatedResources: Resource[]
  ratingDistribution: ResourceRatingDistribution | null
  
  // 状态
  loading: boolean
  error: string | null
  
  // 操作
  refresh: () => void
}
```

### 配套工具函数

资源相关的工具函数已迁移到独立模块中：

```tsx
import { ResourceUtils } from '@/lib/utils/resource-utils'
// 或导入特定函数
import { isFeatured, formatCount, calculatePopularityScore } from '@/lib/utils/resource-utils'

function Component({ resource }: { resource: Resource }) {
  // 使用工具函数
  const isResourceFeatured = ResourceUtils.isFeatured(resource)
  const primaryTags = ResourceUtils.getPrimaryTags(resource, 3)
  const popularityScore = ResourceUtils.calculatePopularityScore(resource)
  const formattedCount = ResourceUtils.formatCount(resource.viewCount)
  
  // 或直接使用导入的函数
  const featured = isFeatured(resource)
  const count = formatCount(resource.viewCount)
}
```

可用的工具函数：
- `isFeatured(resource)` - 检查是否为精选资源
- `getPrimaryTags(resource, limit)` - 获取主要标签
- `calculatePopularityScore(resource)` - 计算受欢迎度评分
- `formatCount(count)` - 格式化数字显示
- `calculateQualityScore(resource)` - 计算质量评分
- `isTrending(resource)` - 检查是否为热门资源
- `getStatusLabels(resource)` - 获取状态标签

## 其他 Hooks

- `useLocalStorage` - 本地存储管理
- `useFilter` - 过滤功能管理  
- `useCategories` - 分类数据管理
- `useLike` - 点赞功能管理