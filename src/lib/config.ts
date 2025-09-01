import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'MyCoding',
  description: '基于 Next.js 14 构建的现代化Web应用',
  url: 'https://mycoding-web.vercel.app',
  ogImage: 'https://mycoding-web.vercel.app/og.jpg',
  links: {
    github: 'https://github.com/yourusername/mycoding-web',
  },
}

export const navConfig = {
  mainNav: [
    {
      title: '首页',
      href: '/',
    },
    {
      title: '资源导航',
      href: '/resources',
    },
    {
      title: '文章',
      href: '/posts',
    },
    {
      title: 'Vibe',
      href: '/vibes',
    },
  ],
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  DATABASE_URL: process.env.DATABASE_URL,
} as const