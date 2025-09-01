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

### 工具函数

Hook 还提供了额外的工具函数：

```tsx
import { useResourceDetailUtils } from '@/hooks/use-resource-detail'

function Component() {
  const { 
    isFeaturedResource, 
    getPrimaryTags, 
    calculatePopularityScore,
    formatCount 
  } = useResourceDetailUtils()
  
  // 使用工具函数...
}
```

## 其他 Hooks

- `useLocalStorage` - 本地存储管理
- `useFilter` - 过滤功能管理  
- `useCategories` - 分类数据管理
- `useLike` - 点赞功能管理