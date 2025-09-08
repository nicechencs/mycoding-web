# ⚡ 性能优化指南

> mycoding平台性能优化策略和最佳实践

## 🎯 性能目标

### Core Web Vitals指标

- **LCP (Largest Contentful Paint)**: ≤2.5s
- **FID (First Input Delay)**: ≤100ms
- **CLS (Cumulative Layout Shift)**: ≤0.1

### 自定义性能指标

- **FCP (First Contentful Paint)**: ≤1.8s
- **TTI (Time to Interactive)**: ≤3.8s
- **API响应时间**: ≤200ms (95th percentile)
- **数据库查询**: ≤50ms (平均)

## 🏗️ 前端优化 (Next.js 14)

### 1. 构建优化

#### Next.js配置优化

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产构建优化
  swcMinify: true,
  compiler: {
    removeadmin: process.env.NODE_ENV === 'production',
  },

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1年
  },

  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', 'lodash'],
  },

  // Bundle优化
  webpack: config => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }
    return config
  },
}
```

#### 代码分割策略

```javascript
// 路由级代码分割
const DashboardPage = dynamic(() => import('@/pages/dashboard'), {
  loading: () => <DashboardSkeleton />,
})

// 组件级代码分割
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  ssr: false, // 禁用SSR以避免水合不匹配
})

// 条件加载
const AdminPanel = dynamic(
  () => import('@/components/AdminPanel').then(mod => mod.AdminPanel),
  { ssr: false }
)
```

### 2. 渲染优化

#### SSR/SSG策略

```javascript
// 静态生成 (ISR)
export async function getStaticProps() {
  const data = await fetchStaticData()

  return {
    props: { data },
    revalidate: 3600, // 1小时重新生成
  }
}

// 服务端渲染 + 缓存
export async function getServerSideProps(context) {
  const data = await fetchDynamicData(context)

  // 设置缓存头
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  return { props: { data } }
}

// 流式SSR
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DynamicContent />
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  )
}
```

#### 组件优化

```javascript
// React.memo优化
const UserCard = React.memo(
  ({ user }) => {
    return <div>{user.name}</div>
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id
  }
)

// useMemo缓存计算结果
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: heavyComputation(item),
    }))
  }, [data])

  return <div>{processedData}</div>
}

// useCallback缓存函数
const ListComponent = ({ items }) => {
  const handleClick = useCallback(id => {
    // 处理点击事件
  }, [])

  return items.map(item => (
    <Item key={item.id} onClick={() => handleClick(item.id)} />
  ))
}
```

### 3. 资源优化

#### 图片优化

```javascript
// Next.js Image组件
import Image from 'next/image'

const OptimizedImage = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={600}
    height={400}
    priority={false} // 关键图片设为true
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    style={{
      width: '100%',
      height: 'auto',
    }}
  />
)

// 响应式图片
const ResponsiveImage = ({ src, alt }) => (
  <picture>
    <source
      media="(max-width: 768px)"
      srcSet={`${src}?w=400&h=300 1x, ${src}?w=800&h=600 2x`}
    />
    <source
      media="(max-width: 1200px)"
      srcSet={`${src}?w=600&h=400 1x, ${src}?w=1200&h=800 2x`}
    />
    <img src={`${src}?w=800&h=600`} alt={alt} loading="lazy" decoding="async" />
  </picture>
)
```

#### 字体优化

```javascript
// next/font优化
import { Inter, Fira_Code } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

#### CSS优化

```css
/* 关键CSS内联 */
@layer base {
  /* 基础样式 */
  body {
    font-family: var(--font-inter);
  }
}

@layer components {
  /* 组件样式 - 按需加载 */
  .btn {
    @apply px-4 py-2 rounded transition-colors;
  }
}

/* CSS容器查询 */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

### 4. 运行时优化

#### 虚拟滚动

```javascript
// 大列表虚拟滚动
import { VariableSizeList as List } from 'react-window'

const VirtualizedList = ({ items }) => {
  const getItemSize = index => {
    // 根据内容动态计算高度
    return items[index].height || 80
  }

  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem data={items[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

#### 防抖和节流

```javascript
// 搜索防抖
import { useDeferredValue, useMemo } from 'react'

const SearchResults = ({ query }) => {
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    return searchItems(deferredQuery)
  }, [deferredQuery])

  return <ResultsList results={results} />
}

// 滚动节流
const useThrottledScroll = (callback, delay = 100) => {
  const throttledCallback = useCallback(throttle(callback, delay), [
    callback,
    delay,
  ])

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback)
    return () => window.removeEventListener('scroll', throttledCallback)
  }, [throttledCallback])
}
```

## 🔧 后端优化 (Node.js + Fastify)

### 1. 数据库优化

#### 查询优化

```javascript
// 索引策略
const createIndexes = async () => {
  // 复合索引
  await db.schema.raw(`
    CREATE INDEX CONCURRENTLY idx_posts_user_created 
    ON posts (user_id, created_at DESC)
  `)

  // 部分索引
  await db.schema.raw(`
    CREATE INDEX CONCURRENTLY idx_posts_published 
    ON posts (created_at) 
    WHERE status = 'published'
  `)

  // 全文搜索索引
  await db.schema.raw(`
    CREATE INDEX CONCURRENTLY idx_posts_search 
    ON posts USING gin(to_tsvector('english', title || ' ' || content))
  `)
}

// 查询优化
const getUserPosts = async (userId, options = {}) => {
  const query = db('posts')
    .where('user_id', userId)
    .where('status', 'published')

  // 分页
  if (options.page && options.limit) {
    query.offset((options.page - 1) * options.limit).limit(options.limit)
  }

  // 选择性字段
  query.select(['id', 'title', 'summary', 'created_at'])

  // 预加载关联数据
  query
    .leftJoin('users', 'posts.user_id', 'users.id')
    .select(['users.name as author_name'])

  return query
}
```

#### 缓存策略

```javascript
// Redis缓存
const cacheService = {
  async get(key) {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  },

  async set(key, data, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(data))
  },

  async del(key) {
    await redis.del(key)
  },
}

// 缓存装饰器
const withCache = (key, ttl = 3600) => {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value

    descriptor.value = async function (...args) {
      const cacheKey = `${key}:${JSON.stringify(args)}`

      let result = await cacheService.get(cacheKey)
      if (!result) {
        result = await method.apply(this, args)
        await cacheService.set(cacheKey, result, ttl)
      }

      return result
    }
  }
}

// 使用缓存
class PostService {
  @withCache('posts:trending', 1800) // 30分钟缓存
  async getTrendingPosts(limit = 10) {
    return db('posts')
      .where('status', 'published')
      .orderBy('view_count', 'desc')
      .limit(limit)
  }
}
```

### 2. API优化

#### 批量请求

```javascript
// GraphQL DataLoader
const DataLoader = require('dataloader')

const userLoader = new DataLoader(async userIds => {
  const users = await db('users').whereIn('id', userIds)
  return userIds.map(id => users.find(user => user.id === id))
})

// REST API批量端点
app.post('/api/users/batch', async (req, res) => {
  const { userIds } = req.body

  if (!userIds || userIds.length === 0) {
    return res.json([])
  }

  // 限制批量大小
  if (userIds.length > 100) {
    return res.status(400).json({ error: 'Too many users requested' })
  }

  const users = await userLoader.loadMany(userIds)
  res.json(users)
})
```

#### 响应优化

```javascript
// 压缩中间件
const compression = require('compression')
app.use(
  compression({
    threshold: 0,
    level: 6,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    },
  })
)

// ETags缓存
app.use((req, res, next) => {
  res.setHeader('ETag', `W/"${Date.now()}"`)
  next()
})

// 分页响应
const paginatedResponse = (data, page, limit, total) => ({
  data,
  pagination: {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
})
```

### 3. 内存和CPU优化

#### 连接池配置

```javascript
// 数据库连接池
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 20,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
})

// Redis连接池
const Redis = require('ioredis')
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
})
```

#### 进程管理

```javascript
// PM2配置
module.exports = {
  apps: [
    {
      name: 'mycoding-api',
      script: 'dist/server.js',
      instances: 'max', // 使用所有CPU核心
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      time: true,
    },
  ],
}
```

## 📊 监控和测量

### 1. 性能监控

#### Web Vitals监控

```javascript
// 客户端监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const sendToAnalytics = metric => {
  // 发送到分析服务
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  })
}

// 监控所有核心指标
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

#### API性能监控

```javascript
// 响应时间中间件
const responseTime = require('response-time')

app.use(
  responseTime((req, res, time) => {
    // 记录慢查询
    if (time > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} - ${time}ms`)
    }

    // 发送到监控服务
    metrics.histogram('api_response_time', time, {
      method: req.method,
      route: req.route?.path || req.url,
      status_code: res.statusCode,
    })
  })
)
```

### 2. 性能测试

#### 负载测试

```javascript
// K6负载测试脚本
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // 上升至100用户
    { duration: '5m', target: 100 }, // 保持100用户
    { duration: '2m', target: 200 }, // 上升至200用户
    { duration: '5m', target: 200 }, // 保持200用户
    { duration: '2m', target: 0 }, // 下降至0用户
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99%请求<1.5s
    http_req_failed: ['rate<0.1'], // 错误率<10%
  },
}

export default function () {
  const response = http.get('http://localhost:3004/api/posts')

  check(response, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500,
  })

  sleep(1)
}
```

#### Lighthouse CI

```yaml
# .github/workflows/performance.yml
name: Performance Tests
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: pnpm install
      - name: Build app
        run: pnpm build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## 🚀 部署优化

### 1. CDN配置

```javascript
// Cloudflare配置
const cdnConfig = {
  // 静态资源缓存
  'Cache-Control': 'public, max-age=31536000, immutable',

  // HTML缓存
  'Cache-Control': 'public, max-age=0, must-revalidate',

  // API缓存
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
}
```

### 2. 服务器配置

```nginx
# Nginx配置
server {
  listen 80;
  server_name mycoding.com;

  # Gzip压缩
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml+rss;

  # 静态资源缓存
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options nosniff;
  }

  # API代理
  location /api/ {
    proxy_pass http://localhost:3004;
    proxy_cache_valid 200 5m;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 📈 性能优化检查清单

### 前端优化清单

- [ ] 启用Next.js SWC编译器
- [ ] 配置适当的缓存策略
- [ ] 实现代码分割
- [ ] 优化图片加载
- [ ] 使用Web字体优化
- [ ] 实现虚拟滚动
- [ ] 添加Service Worker
- [ ] 监控Core Web Vitals

### 后端优化清单

- [ ] 数据库索引优化
- [ ] 实现Redis缓存
- [ ] API响应压缩
- [ ] 连接池配置
- [ ] 批量操作优化
- [ ] 内存使用监控
- [ ] 慢查询日志
- [ ] 负载测试通过

### 部署优化清单

- [ ] CDN静态资源分发
- [ ] 服务器压缩配置
- [ ] HTTP/2推送
- [ ] 预加载关键资源
- [ ] 监控和告警配置
- [ ] 自动扩容配置

---

⚡ **性能优化是一个持续的过程，需要不断监控、测量和改进！**
