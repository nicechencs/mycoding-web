# MyCoding Frontend

## 📋 概述

MyCoding Web前端是基于 **Next.js 14** 构建的现代化编程社区平台，提供优秀的用户体验和SEO优化。

## 🚀 技术栈

- **框架**: Next.js 14 - React全栈框架
- **UI库**: React 18+ - 用户界面库
- **样式**: Tailwind CSS 3.x - 原子化CSS框架
- **动画**: Framer Motion - 动画库
- **语言**: TypeScript - 类型安全
- **性能优化**:
  - 图片懒加载 - Intersection Observer API
  - 代码分割 - Dynamic Imports + Suspense
  - 性能监控 - Core Web Vitals跟踪

## 📦 项目结构

```
web/
├── src/
│   ├── app/                # App Router (Next.js 14)
│   │   ├── (auth)/        # 认证页面组
│   │   ├── (main)/        # 主要页面组
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 首页
│   ├── components/         # React组件
│   │   ├── ui/            # 基础UI组件
│   │   ├── features/      # 功能组件
│   │   └── layout/        # 布局组件
│   ├── lib/               # 工具函数
│   ├── hooks/             # 自定义Hooks
│   ├── stores/            # Zustand状态
│   └── types/             # TypeScript类型
├── public/                # 静态资源
└── docs/                  # 技术文档
```

## 🔧 快速开始

### 环境要求

- Node.js 18+ LTS
- pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 环境配置

创建 `.env.local` 文件：

```bash
# API配置
NEXT_PUBLIC_API_URL=http://localhost:3004/api/v1

# 认证配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth配置
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

### 启动开发服务器

```bash
# 开发模式
pnpm dev

# 打开浏览器访问
http://localhost:3000
```

### 构建生产版本

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 🎨 UI/UX特性

### 核心功能

- **资源**: 编程资源分类浏览
- **文章**: 发布文章、评论互动
- **个人中心**: 用户资料、收藏管理
- **搜索功能**: 全站内容搜索
- **响应式设计**: 适配多端设备

### 设计系统

- **主题切换**: 支持亮色/暗色主题
- **组件库**: 基于shadcn/ui的统一组件
- **动画效果**: 流畅的页面过渡
- **无障碍**: WCAG 2.1 AA级标准

## 📊 性能优化

### 渲染策略

- **SSG**: 静态页面生成
- **ISR**: 增量静态再生
- **SSR**: 服务端渲染
- **CSR**: 客户端渲染

### 优化措施

- **图片优化**: Next.js Image组件
- **代码分割**: 自动路由分割
- **懒加载**: 组件按需加载
- **缓存策略**: 浏览器缓存优化

### 性能指标

- 首屏加载时间 < 2秒
- Lighthouse分数 > 90
- Core Web Vitals优化

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行E2E测试
pnpm test:e2e

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 🚀 部署

### Vercel部署 (推荐)

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker部署

```bash
# 构建镜像
docker build -t mycoding-web .

# 运行容器
docker run -p 3000:3000 mycoding-web
```

### 静态导出

```bash
# 生成静态文件
pnpm build
pnpm export

# 部署到任何静态服务器
```

## 🔒 安全措施

- **内容安全策略 (CSP)**: XSS防护
- **HTTPS强制**: 安全传输
- **认证保护**: NextAuth.js集成
- **输入验证**: 客户端和服务端双重验证
- **CSRF防护**: 自动令牌验证

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari
- Chrome for Android

## 📖 相关文档

- [系统架构](./docs/01-architecture/system-architecture.md)
- [开发指南](./docs/02-development/quickstart.md)
- [组件文档](./docs/03-components/user-guide.md)
- [性能优化](./docs/04-optimization/performance.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

[MIT License](LICENSE)
