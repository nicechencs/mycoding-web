import { Vibe } from '@/types'
import { mockUsers } from './users'

export const mockVibes: Vibe[] = [
  {
    id: '1',
    content: '刚完成了一个使用Next.js 14的项目，App Router真的太香了！服务端组件和客户端组件的分离让性能提升了不少 🚀',
    author: mockUsers[0],
    tags: ['Next.js', 'App Router', '项目分享'],
    likeCount: 24,
    commentCount: 8,
    shareCount: 3,
    createdAt: new Date('2024-08-30T10:30:00'),
    isLiked: false,
  },
  {
    id: '2',
    content: '今天学习了Tailwind CSS的自定义配置，发现可以通过plugin系统扩展很多功能。分享一个我写的渐变背景插件 ✨',
    author: mockUsers[1],
    images: ['/vibes/tailwind-plugin-demo.jpg'],
    tags: ['Tailwind CSS', 'Plugin', '学习笔记'],
    likeCount: 18,
    commentCount: 5,
    shareCount: 2,
    createdAt: new Date('2024-08-30T09:15:00'),
    isLiked: true,
  },
  {
    id: '3',
    content: '正在重构一个老项目，从JavaScript迁移到TypeScript。类型安全真的能避免很多运行时错误，强烈推荐！',
    author: mockUsers[2],
    tags: ['TypeScript', '重构', '最佳实践'],
    likeCount: 31,
    commentCount: 12,
    shareCount: 5,
    createdAt: new Date('2024-08-30T08:45:00'),
    isLiked: false,
  },
  {
    id: '4',
    content: '分享一个Node.js性能监控的小技巧：使用clinic.js工具可以很直观地看到应用的性能瓶颈。附上我的监控截图 📊',
    author: mockUsers[3],
    images: ['/vibes/nodejs-performance.jpg', '/vibes/clinic-js-report.jpg'],
    tags: ['Node.js', '性能监控', 'clinic.js'],
    likeCount: 22,
    commentCount: 7,
    shareCount: 4,
    createdAt: new Date('2024-08-30T07:20:00'),
    isLiked: true,
  },
  {
    id: '5',
    content: '刚看完React 18的文档，并发特性真的很强大。Suspense和useTransition的组合让用户体验提升了一个档次 💫',
    author: mockUsers[4],
    tags: ['React 18', '并发特性', 'Suspense'],
    likeCount: 15,
    commentCount: 4,
    shareCount: 1,
    createdAt: new Date('2024-08-30T06:30:00'),
    isLiked: false,
  },
  {
    id: '6',
    content: '今天尝试了一下新的CSS Grid布局技巧，用subgrid实现了复杂的响应式布局。CSS的发展真的越来越强大了 🎨',
    author: mockUsers[0],
    images: ['/vibes/css-grid-demo.jpg'],
    tags: ['CSS Grid', '响应式设计', 'CSS'],
    likeCount: 19,
    commentCount: 6,
    shareCount: 2,
    createdAt: new Date('2024-08-29T16:45:00'),
    isLiked: true,
  },
  {
    id: '7',
    content: '正在学习PostgreSQL的窗口函数，功能真的很强大！可以轻松实现复杂的数据分析查询。附上我的学习笔记 📚',
    author: mockUsers[1],
    tags: ['PostgreSQL', '窗口函数', '数据库'],
    likeCount: 13,
    commentCount: 3,
    shareCount: 1,
    createdAt: new Date('2024-08-29T15:20:00'),
    isLiked: false,
  },
  {
    id: '8',
    content: '用React Native开发的APP终于上线了！跨平台开发真的能节省很多时间，虽然也有一些坑要踩 📱',
    author: mockUsers[2],
    images: ['/vibes/react-native-app.jpg'],
    tags: ['React Native', '移动开发', '项目发布'],
    likeCount: 27,
    commentCount: 9,
    shareCount: 6,
    createdAt: new Date('2024-08-29T14:10:00'),
    isLiked: true,
  },
]

export const getLatestVibes = (limit: number = 10): Vibe[] => {
  return mockVibes
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export const getVibeById = (id: string): Vibe | undefined => {
  return mockVibes.find(vibe => vibe.id === id)
}

export const getVibesByUser = (userId: string): Vibe[] => {
  return mockVibes.filter(vibe => vibe.author.id === userId)
}