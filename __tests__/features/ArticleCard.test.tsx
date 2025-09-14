import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Article } from '@/types'
import { ArticleCard } from '@/components/features/community/article-card'

// Mock profile hook used by ProfilePreviewModal
jest.mock('@/hooks/use-users', () => ({
  useUserProfile: jest.fn().mockReturnValue({
    user: {
      id: 'u1',
      name: 'Author A',
      email: 'author@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: null,
    },
    stats: {
      articlesCount: 2,
      resourcesCount: 1,
      vibesCount: 3,
      followersCount: 4,
      followingCount: 5,
      totalLikes: 10,
      totalViews: 100,
    },
    loading: false,
    error: null,
  }),
}));

describe('ArticleCard - profile preview', () => {
  const article: Article = {
    id: 'a1',
    title: 'Test Article',
    content: 'content',
    excerpt: 'excerpt',
    slug: 'test-article',
    author: {
      id: 'u1',
      name: 'Author A',
      email: 'author@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    category: '前端',
    tags: ['React', 'TypeScript'],
    viewCount: 10,
    likeCount: 2,
    commentCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('点击头像或名字应显示个人资料预览', () => {
    render(<ArticleCard article={article} />)

    // 点击作者名字
    fireEvent.click(screen.getByText('Author A'))

    // 预览弹层出现（检查通用按钮）
    expect(screen.getByText('关闭')).toBeInTheDocument()
  })
})

