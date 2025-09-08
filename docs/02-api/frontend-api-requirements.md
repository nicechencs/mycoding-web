# MyCoding Web 前端 API 需求文档

> 生成时间：2025-09-08  
> 项目路径：D:\web\MyCoding\mycoding-web  
> 分析深度：全面代码扫描 + 业务逻辑分析

## 📊 项目概况

### 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Hooks
- **当前数据层**: Mock数据（待替换为真实API）

### 功能模块
- 资源管理（技术资源展示、评分、评论）
- 文章社区（技术文章发布、阅读、评论）
- Vibe动态（动态发布、互动）
- 用户系统（认证、个人信息管理）
- 分类标签（内容分类组织）

## 🔑 API 模块清单

### 1. 用户认证与管理 API

#### 1.1 认证接口
| 方法 | 端点 | 描述 | 请求体示例 | 响应示例 |
|------|------|------|------------|----------|
| POST | `/api/auth/login` | 用户登录 | `{email, password}` | `{token, user}` |
| POST | `/api/auth/register` | 用户注册 | `{email, password, name}` | `{token, user}` |
| POST | `/api/auth/logout` | 用户登出 | - | `{message}` |
| POST | `/api/auth/refresh-token` | 刷新令牌 | `{refreshToken}` | `{token}` |
| GET | `/api/auth/profile` | 获取当前用户信息 | - | `{user}` |

#### 1.2 用户管理接口
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/users/profile` | 获取当前用户详细信息 | - |
| PUT | `/api/users/profile` | 更新用户信息 | `{name, bio, avatar}` |
| POST | `/api/users/avatar` | 上传用户头像 | FormData |
| GET | `/api/users/{id}` | 获取指定用户信息 | userId |
| GET | `/api/users/{id}/resources` | 获取用户创建的资源 | userId, page, limit |
| GET | `/api/users/{id}/articles` | 获取用户发布的文章 | userId, page, limit |
| GET | `/api/users/{id}/vibes` | 获取用户的动态 | userId, page, limit |

#### 1.3 用户关注系统
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/users/{id}/followers` | 获取用户粉丝列表 | userId, page, limit |
| GET | `/api/users/{id}/following` | 获取用户关注列表 | userId, page, limit |
| POST | `/api/users/{id}/follow` | 关注用户 | userId |
| DELETE | `/api/users/{id}/follow` | 取消关注 | userId |
| GET | `/api/users/{id}/follow-status` | 获取关注状态 | userId |

### 2. 资源管理 API

#### 2.1 资源CRUD操作
| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/resources` | 获取资源列表 | page, limit, category, tags, search, sortBy, featured |
| GET | `/api/resources/featured` | 获取精选资源 | limit |
| GET | `/api/resources/categories` | 获取资源分类列表 | - |
| GET | `/api/resources/{id}` | 获取资源详情 | resourceId |
| GET | `/api/resources/slug/{slug}` | 通过slug获取资源 | slug |
| POST | `/api/resources` | 创建新资源 | `{title, description, category, tags, url, image}` |
| PUT | `/api/resources/{id}` | 更新资源信息 | resourceId, updateData |
| DELETE | `/api/resources/{id}` | 删除资源 | resourceId |
| GET | `/api/resources/{id}/related` | 获取相关资源 | resourceId, limit |

#### 2.2 资源评分与评价
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/resources/{id}/ratings` | 获取资源评分列表 | resourceId, page, limit |
| POST | `/api/resources/{id}/ratings` | 提交资源评分 | resourceId, `{rating, comment}` |
| GET | `/api/resources/{id}/rating-distribution` | 获取评分分布 | resourceId |
| PUT | `/api/resources/ratings/{ratingId}` | 更新评分 | ratingId, `{rating, comment}` |
| DELETE | `/api/resources/ratings/{ratingId}` | 删除评分 | ratingId |

#### 2.3 资源评论
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/resources/{id}/comments` | 获取资源评论 | resourceId, page, limit |
| POST | `/api/resources/{id}/comments` | 发表评论 | resourceId, `{content}` |
| PUT | `/api/resources/comments/{id}` | 更新评论 | commentId, `{content}` |
| DELETE | `/api/resources/comments/{id}` | 删除评论 | commentId |
| POST | `/api/resources/comments/{id}/replies` | 回复评论 | commentId, `{content}` |
| POST | `/api/resources/comments/{id}/like` | 点赞评论 | commentId |
| DELETE | `/api/resources/comments/{id}/like` | 取消点赞评论 | commentId |

#### 2.4 资源交互
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| POST | `/api/resources/{id}/favorite` | 收藏资源 | resourceId |
| DELETE | `/api/resources/{id}/favorite` | 取消收藏 | resourceId |
| POST | `/api/resources/{id}/view` | 记录浏览量 | resourceId |
| GET | `/api/resources/{id}/stats` | 获取资源统计 | resourceId |

#### 2.5 资源批量操作
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| POST | `/api/resources/batch` | 批量操作资源 | `{action, resourceIds}` |
| DELETE | `/api/resources/batch` | 批量删除资源 | `{resourceIds}` |
| PUT | `/api/resources/batch/category` | 批量更新分类 | `{resourceIds, categoryId}` |
| PUT | `/api/resources/batch/tags` | 批量更新标签 | `{resourceIds, tags}` |

### 3. 文章/社区 API

#### 3.1 文章管理
| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/articles` | 获取文章列表 | page, limit, category, tags, search |
| GET | `/api/articles/featured` | 获取精选文章 | limit |
| GET | `/api/articles/{id}` | 获取文章详情 | articleId |
| GET | `/api/articles/slug/{slug}` | 通过slug获取文章 | slug |
| POST | `/api/articles` | 创建文章 | `{title, content, summary, tags, coverImage}` |
| PUT | `/api/articles/{id}` | 更新文章 | articleId, updateData |
| DELETE | `/api/articles/{id}` | 删除文章 | articleId |
| GET | `/api/articles/{id}/related` | 获取相关文章 | articleId, limit |

#### 3.2 文章评论
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/articles/{id}/comments` | 获取文章评论 | articleId, page, limit |
| POST | `/api/articles/{id}/comments` | 发表评论 | articleId, `{content}` |
| PUT | `/api/articles/comments/{id}` | 更新评论 | commentId, `{content}` |
| DELETE | `/api/articles/comments/{id}` | 删除评论 | commentId |

#### 3.3 文章交互
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| POST | `/api/articles/{id}/like` | 点赞文章 | articleId |
| DELETE | `/api/articles/{id}/like` | 取消点赞 | articleId |
| POST | `/api/articles/{id}/view` | 记录浏览 | articleId |

#### 3.4 文章草稿管理
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/articles/drafts` | 获取草稿列表 | page, limit |
| GET | `/api/articles/drafts/{id}` | 获取草稿详情 | draftId |
| POST | `/api/articles/drafts` | 保存草稿 | `{title, content, summary, tags}` |
| PUT | `/api/articles/drafts/{id}` | 更新草稿 | draftId, updateData |
| DELETE | `/api/articles/drafts/{id}` | 删除草稿 | draftId |
| POST | `/api/articles/drafts/{id}/publish` | 发布草稿为文章 | draftId |

### 4. Vibe动态 API

#### 4.1 动态管理
| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/vibes` | 获取动态列表 | page, limit |
| GET | `/api/vibes/{id}` | 获取动态详情 | vibeId |
| POST | `/api/vibes` | 发布动态 | `{content, images, tags}` |
| PUT | `/api/vibes/{id}` | 更新动态 | vibeId, updateData |
| DELETE | `/api/vibes/{id}` | 删除动态 | vibeId |
| GET | `/api/vibes/user/{userId}` | 获取用户动态 | userId, page, limit |
| GET | `/api/vibes/{id}/related` | 获取相关动态 | vibeId, limit |

#### 4.2 动态评论
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/vibes/{id}/comments` | 获取动态评论 | vibeId, page, limit |
| POST | `/api/vibes/{id}/comments` | 评论动态 | vibeId, `{content}` |
| PUT | `/api/vibes/comments/{id}` | 更新评论 | commentId, `{content}` |
| DELETE | `/api/vibes/comments/{id}` | 删除评论 | commentId |

#### 4.3 动态交互
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| POST | `/api/vibes/{id}/like` | 点赞动态 | vibeId |
| DELETE | `/api/vibes/{id}/like` | 取消点赞 | vibeId |
| POST | `/api/vibes/{id}/share` | 分享动态 | vibeId |

### 5. 文件上传 API

| 方法 | 端点 | 描述 | 请求格式 |
|------|------|------|----------|
| POST | `/api/upload/image` | 上传单张图片 | FormData |
| POST | `/api/upload/images` | 上传多张图片 | FormData |
| POST | `/api/upload/avatar` | 上传头像 | FormData |
| DELETE | `/api/upload/{fileId}` | 删除文件 | fileId |

### 6. 分类与标签 API

#### 6.1 分类管理
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/categories` | 获取所有分类 | - |
| GET | `/api/categories/{type}` | 获取指定类型分类 | type: resource/article |
| POST | `/api/categories` | 创建分类 | `{name, type, description}` |
| PUT | `/api/categories/{id}` | 更新分类 | categoryId, updateData |
| DELETE | `/api/categories/{id}` | 删除分类 | categoryId |

#### 6.2 标签管理
| 方法 | 端点 | 描述 | 请求参数 |
|------|------|------|----------|
| GET | `/api/tags` | 获取标签列表 | page, limit |
| GET | `/api/tags/popular` | 获取热门标签 | limit |
| POST | `/api/tags` | 创建标签 | `{name}` |

### 7. 搜索与统计 API

#### 7.1 搜索功能
| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/search` | 全局搜索 | q, type, page, limit |
| GET | `/api/search/resources` | 搜索资源 | q, page, limit |
| GET | `/api/search/articles` | 搜索文章 | q, page, limit |
| GET | `/api/search/suggestions` | 搜索建议 | q, limit |

#### 7.2 统计分析
| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/stats/overview` | 总体统计 | - |
| GET | `/api/stats/resources` | 资源统计 | dateRange |
| GET | `/api/stats/articles` | 文章统计 | dateRange |
| GET | `/api/stats/users` | 用户统计 | dateRange |

### 8. 通知系统 API

| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/api/notifications` | 获取通知列表 | page, limit, status |
| GET | `/api/notifications/unread-count` | 获取未读通知数量 | - |
| PUT | `/api/notifications/{id}/read` | 标记通知为已读 | notificationId |
| PUT | `/api/notifications/read-all` | 标记所有通知为已读 | - |
| DELETE | `/api/notifications/{id}` | 删除通知 | notificationId |
| POST | `/api/notifications/settings` | 更新通知设置 | `{email, push, inApp}` |

## 📐 API 设计规范

### 统一响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}
```

#### 分页响应
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  }
}
```

### 请求限制

```yaml
请求频率限制:
  默认限制: 100次/分钟
  认证用户: 300次/分钟
  VIP用户: 1000次/分钟
  
文件上传限制:
  图片大小: 最大10MB
  图片格式: jpg, jpeg, png, gif, webp
  批量上传: 最多10张
  总大小限制: 50MB
  
请求体限制:
  JSON请求体: 最大1MB
  URL长度: 最大2048字符
  查询参数数量: 最多20个
  
分页限制:
  默认每页: 20条
  最大每页: 100条
  最大页数: 1000页
```

### 复杂查询示例

```typescript
// 资源复杂查询示例
GET /api/resources?category=frontend&tags=react,nextjs&sortBy=rating&order=desc&page=1&limit=20

// 响应示例
{
  "success": true,
  "data": [
    {
      "id": "resource-1",
      "title": "Next.js 14 完全指南",
      "category": "frontend",
      "tags": ["react", "nextjs"],
      "rating": 4.8,
      // ...其他字段
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}

// 错误响应示例
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "limit": "Limit must be between 1 and 100"
    }
  }
}
```

### HTTP 状态码使用

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功获取数据 |
| 201 | Created | 成功创建资源 |
| 204 | No Content | 成功删除资源 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 数据验证失败 |
| 429 | Too Many Requests | 请求频率限制 |
| 500 | Internal Server Error | 服务器错误 |

### 认证方案

#### JWT Token 结构
```typescript
interface JWTPayload {
  userId: string
  email: string
  role: string
  exp: number
  iat: number
}
```

#### 请求头格式
```
Authorization: Bearer <access_token>
```

#### Token 刷新机制
- Access Token 有效期：15分钟
- Refresh Token 有效期：7天
- 自动刷新：在Access Token过期前5分钟自动刷新

### 请求参数验证

#### 分页参数
```typescript
interface PaginationParams {
  page: number      // 默认: 1, 最小: 1
  limit: number     // 默认: 20, 最大: 100
}
```

#### 排序参数
```typescript
interface SortParams {
  sortBy: 'latest' | 'popular' | 'rating' | 'views'
  order: 'asc' | 'desc'  // 默认: desc
}
```

#### 时间范围参数
```typescript
interface DateRangeParams {
  startDate: string  // ISO 8601格式
  endDate: string    // ISO 8601格式
}
```

## 🚀 实施计划

### 第一阶段：核心功能（2周）
1. **用户认证系统** - 注册、登录、Token管理
2. **资源基础CRUD** - 资源的增删改查
3. **文件上传服务** - 支持图片上传
4. **分类标签系统** - 基础分类和标签

### 第二阶段：交互功能（2周）
5. **评分评论系统** - 资源和文章的评分评论
6. **点赞收藏功能** - 用户交互行为
7. **搜索功能** - 基础搜索实现
8. **用户个人中心** - 个人信息管理

### 第三阶段：社区功能（2周）
9. **文章发布系统** - 完整的文章CRUD
10. **Vibe动态系统** - 动态发布和互动
11. **消息通知** - 站内通知系统
12. **数据统计** - 基础数据分析

### 第四阶段：优化完善（1周）
13. **性能优化** - 缓存、分页优化
14. **安全加固** - 防注入、限流
15. **API文档** - Swagger文档完善
16. **单元测试** - API测试覆盖

## 🛠 技术实现建议

### 后端技术栈
```yaml
Runtime: Node.js 20+ / Bun
Framework: Express.js / Fastify / Hono
Database: PostgreSQL 15+
Cache: Redis 7+
ORM: Prisma / Drizzle
Validation: Zod
Auth: JWT + Passport.js
Storage: AWS S3 / Cloudinary
Search: PostgreSQL全文搜索 / Elasticsearch
Queue: Bull / BullMQ
Logger: Winston / Pino
```

### 数据库设计要点
- 使用UUID作为主键
- 添加created_at、updated_at时间戳
- 软删除机制（deleted_at）
- 合理使用索引优化查询
- 考虑分表存储大量数据

### 安全措施
- 输入验证和清理
- SQL注入防护
- XSS防护
- CSRF防护
- 速率限制
- 敏感数据加密

### 性能优化
- Redis缓存热点数据
- 数据库查询优化
- 图片CDN加速
- API响应压缩
- 分页查询优化

## 📝 注意事项

1. **向后兼容**：API版本管理，确保向后兼容
2. **错误处理**：统一的错误处理和日志记录
3. **监控告警**：API调用监控和异常告警
4. **文档维护**：API文档与代码同步更新
5. **测试覆盖**：单元测试和集成测试覆盖率>80%

## 🔄 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2025-09-08 | 初始版本，定义完整API规范 |

---

*本文档将随项目发展持续更新和完善*