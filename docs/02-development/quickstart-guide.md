# 快速开始指南

## 📋 前置要求

### 系统环境

- Node.js 18+ LTS
- pnpm 8.0+
- MySQL 8.0
- Redis (生产环境必需，开发环境可选)

### 开发工具

- VS Code (推荐)
- Prisma VS Code Extension
- Thunder Client 或 Postman (API测试)

## 🚀 项目初始化

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/mycoding.git
cd mycoding
```

### 2. 安装依赖

```bash
# 使用pnpm workspace安装所有依赖
pnpm install
```

### 3. 环境配置

#### 创建环境变量文件

```bash
# API服务配置
cp apps/api/.env.example apps/api/.env

# 用户前端配置
cp apps/web/.env.example apps/web/.env

# 管理后台配置
cp apps/admin/.env.example apps/admin/.env
```

#### 核心环境变量配置

**apps/api/.env**

```env
# 数据库连接
DATABASE_URL="mysql://root:password@localhost:3306/mycoding?schema=public"

# JWT密钥
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Redis配置 (开发环境可选)
REDIS_URL="redis://localhost:6379"

# API配置
PORT=3004
NODE_ENV=development
```

**apps/web/.env.local**

```env
# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth提供商
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API地址
NEXT_PUBLIC_API_URL=http://localhost:3004/api
```

**apps/admin/.env.local**

```env
# API地址
NEXT_PUBLIC_API_URL=http://localhost:3004/api

# 管理端JWT
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 4. 数据库初始化

```bash
# 进入API目录
cd apps/api

# 创建数据库（如果不存在）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mycoding;"

# 运行Prisma迁移
pnpm prisma migrate dev --name init

# 生成Prisma Client
pnpm prisma generate

# (可选) 填充测试数据
pnpm prisma db seed
```

### 5. 启动开发服务器

```bash
# 回到根目录
cd ../..

# 启动所有服务
pnpm dev

# 或者单独启动
pnpm dev:api     # API服务 (http://localhost:3004)
pnpm dev:web     # 用户前端 (http://localhost:3000)
pnpm dev:admin # 管理后台 (http://localhost:3001)
```

## 🏗️ 项目结构说明

### Monorepo架构

```
mycoding/
├── apps/                    # 应用程序
│   ├── api/                # Fastify API服务
│   ├── web/                # Next.js用户前端
│   └── admin/            # Next.js管理后台
├── packages/               # 共享包
│   ├── ui/                # 共享UI组件
│   ├── utils/             # 工具函数
│   └── types/             # TypeScript类型
├── prisma/                 # Prisma配置
├── docs/                   # 项目文档
└── scripts/                # 构建脚本
```

## 💻 开发指南

### 数据库管理

```bash
# 查看数据库
pnpm prisma studio

# 创建新迁移
pnpm prisma migrate dev --name your_migration_name

# 重置数据库
pnpm prisma migrate reset

# 格式化schema
pnpm prisma format
```

### API开发

#### 创建新模块

```typescript
// apps/api/src/modules/example/example.routes.ts
import { FastifyPluginAsync } from 'fastify'

const exampleRoutes: FastifyPluginAsync = async fastify => {
  // 路由定义
  fastify.get(
    '/examples',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: { $ref: 'ExampleSchema#' },
          },
        },
      },
      preHandler: [fastify.authenticate], // JWT认证
    },
    async (request, reply) => {
      const examples = await fastify.prisma.example.findMany()
      return examples
    }
  )
}

export default exampleRoutes
```

#### Prisma数据模型

```prisma
// apps/api/prisma/schema.prisma
model Example {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?  @db.Text
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 前端开发

#### 用户端页面 (Next.js App Router)

```tsx
// apps/web/src/app/examples/page.tsx
import { getExamples } from '@/lib/api'

export default async function ExamplesPage() {
  const examples = await getExamples()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Examples</h1>
      {/* 渲染示例列表 */}
    </div>
  )
}
```

#### 管理端表格 (TanStack Table)

```tsx
// apps/admin/src/components/examples-table.tsx
import { useTable } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'

export function ExamplesTable() {
  const { data: examples } = useQuery({
    queryKey: ['examples'],
    queryFn: fetchExamples,
  })

  // 表格配置和渲染
}
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行API测试
pnpm test:api

# 运行前端测试
pnpm test:web

# E2E测试
pnpm test:e2e
```

## 📦 构建部署

### 构建项目

```bash
# 构建所有应用
pnpm build

# 构建特定应用
pnpm build:api
pnpm build:web
pnpm build:admin
```

### Docker部署

```bash
# 构建Docker镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 🔧 常用命令

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 清理缓存
pnpm clean

# 更新依赖
pnpm update -r
```

## 🐛 故障排查

### 常见问题

#### 1. Prisma连接失败

```bash
# 检查数据库连接
pnpm prisma db pull

# 验证环境变量
echo $DATABASE_URL
```

#### 2. 端口占用

```bash
# 查找占用端口的进程
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# 修改端口
# 在.env文件中修改PORT变量
```

#### 3. 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 删除node_modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# 重新安装
pnpm install
```

## 📚 扩展阅读

- [Fastify文档](https://www.fastify.io/)
- [Prisma文档](https://www.prisma.io/docs)
- [Next.js 14文档](https://nextjs.org/docs)
- [NextAuth.js文档](https://next-auth.js.org/)
- [TanStack Query文档](https://tanstack.com/query)

## 🤝 获取帮助

- 查看 [完整文档](../README.md)
- 提交 [Issue](https://github.com/yourusername/mycoding/issues)
- 加入 [Discord社区](https://discord.gg/mycoding)

---

🚀 **祝你开发愉快！**
