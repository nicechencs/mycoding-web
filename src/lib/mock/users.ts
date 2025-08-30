import { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '/avatars/user1.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-20'),
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: '/avatars/user2.jpg',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-08-19'),
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    avatar: '/avatars/user3.jpg',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-08-18'),
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    avatar: '/avatars/user4.jpg',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-08-17'),
  },
  {
    id: '5',
    name: '陈七',
    email: 'chenqi@example.com',
    avatar: '/avatars/user5.jpg',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-08-16'),
  },
]

export const getCurrentUser = (): User => mockUsers[0]