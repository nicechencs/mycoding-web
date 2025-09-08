# 🚀 快速开始指南

> 5分钟快速启动mycoding开发环境

## 📋 环境要求

- **Node.js**: 18+ LTS
- **pnpm**: 8.0+
- **MySQL**: 8.0+
- **Git**: 2.30+

## 🔧 快速安装

### 1. 克隆项目

```bash
git clone <repository-url>
cd mycoding
```

### 2. 安装依赖

```bash
# 安装所有依赖 (使用pnpm workspace)
pnpm install
```

### 3. 环境配置

```bash
# 复制配置模板
cd apps/api
cp .env.example .env.development

# 配置数据库连接
# 编辑 .env.development 文件
```

### 4. 初始化数据库

```bash
# 运行数据库迁移
pnpm --filter @apps/api prisma migrate dev

# 生成Prisma客户端
pnpm --filter @apps/api prisma generate

# 运行种子数据 (可选)
pnpm --filter @apps/api prisma db seed
```

## 🏃‍♂️ 启动服务

### 场景化启动 (推荐)

```bash
# 用户端开发 (Web前端 + API后端)
pnpm dev:user

# 管理端开发 (admin管理后台 + API后端)
pnpm dev:admin

# 全栈开发 (所有应用)
pnpm dev:full
```

### 单独启动

```bash
# 后端API (端口: 3004)
pnpm --filter @apps/api dev

# 前端Web (端口: 3000)
pnpm --filter @apps/web dev

# 管理后台admin (端口: 3001)
pnpm --filter @apps/admin dev
```

## 🌐 访问地址

启动完成后访问:

- **用户前端**: http://localhost:3000
- **管理后台**: http://localhost:3001
- **API服务**: http://localhost:3004
- **API文档**: http://localhost:3004/api-docs

## ✅ 验证安装

### 检查API服务

```bash
curl http://localhost:3004/health
# 预期返回: {"status": "ok", "timestamp": "..."}
```

### 检查数据库连接

```bash
# 在apps/api目录下
node scripts/check-database.js
```

## 🔑 默认账户

开发环境默认管理员账户:

- **用户名**: admin@example.com
- **密码**: admin123

## 📁 项目结构

```
mycoding/
├── apps/
│   ├── api/        # 后端API服务 (Fastify + Prisma)
│   ├── web/        # 用户前端应用 (Next.js 14)
│   └── admin/    # 管理后台应用 (Next.js 14)
├── packages/       # 共享包
│   ├── ui/        # 共享UI组件库
│   └── utils/     # 共享工具函数
├── docs/           # 项目文档
├── scripts/        # 工具脚本
├── package.json    # 根配置
├── pnpm-workspace.yaml
└── turbo.json      # 构建配置
```

## 🛠️ 开发工具

### 推荐IDE配置

- **VSCode**: 安装Next.js、React、TypeScript、ESLint、Prettier、Tailwind CSS插件
- **WebStorm**: 启用React、Next.js和Node.js支持

### 代码规范

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check
```

## 🧪 运行测试

```bash
# 全部测试
pnpm test

# 单元测试
pnpm test:unit

# 集成测试
pnpm test:integration
```

## 🐛 常见问题

### 1. 端口冲突

如果遇到端口占用，修改对应应用的配置文件中的端口设置。

### 2. 数据库连接失败

- 检查MySQL服务是否启动
- 验证.env文件中的数据库配置
- 确认数据库用户权限

### 3. 依赖安装失败

```bash
# 清除缓存重新安装
pnpm store prune
rm -rf node_modules
pnpm install
```

## 📖 下一步

- 📑 [项目概述](../01-architecture/project-overview.md) - 了解项目背景和特性
- 🏗️ [系统架构](../01-architecture/system-architecture.md) - 深入了解技术架构
- 🔧 [开发环境](./development-setup.md) - 详细开发环境搭建

---

🎯 **完成快速启动后，您可以开始探索mycoding的强大功能了！**
