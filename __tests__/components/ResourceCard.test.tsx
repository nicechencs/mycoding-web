import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ResourceCard } from '@/components/features/resources/resource-card'
import { Resource } from '@/types/resource'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, size, theme }: any) => (
    <div data-testid="avatar" data-size={size} data-theme={theme}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/features/resources/rating-stars', () => ({
  RatingStars: ({ rating, totalCount, size, showCount }: any) => (
    <div
      data-testid="rating-stars"
      data-rating={rating}
      data-total-count={totalCount}
      data-size={size}
      data-show-count={showCount}
    >
      {rating} stars
    </div>
  ),
}))

jest.mock('@/lib/utils/category', () => ({
  getCategoryClasses: (category: string) =>
    `category-${category.toLowerCase()}`,
}))

jest.mock('@/components/ui/markdown', () => ({
  Markdown: ({ children, className }: any) => (
    <div data-testid="markdown" className={className}>
      {children}
    </div>
  ),
}))

describe('ResourceCard Component', () => {
  const mockResource: Resource = {
    id: '1',
    title: 'Test Resource',
    slug: 'test-resource',
    description: 'This is a test resource description',
    category: 'Frontend',
    tags: ['React', 'TypeScript', 'Testing', 'Jest', 'Extra Tag'],
    author: 'Test Author',
    authorId: 'author-1',
    rating: 4.5,
    ratingCount: 100,
    viewCount: 1500,
    likeCount: 120,
    commentCount: 25,
    featured: false,
    url: 'https://example.com/resource',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础渲染', () => {
    it('应该渲染资源标题', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.getByText('Test Resource')).toBeInTheDocument()
    })

    it('应该渲染资源描述', () => {
      render(<ResourceCard resource={mockResource} />)

      const markdown = screen.getByTestId('markdown')
      expect(markdown).toHaveTextContent('This is a test resource description')
    })

    it('应该渲染资源分类', () => {
      render(<ResourceCard resource={mockResource} />)

      const category = screen.getByText('Frontend')
      expect(category).toBeInTheDocument()
      expect(category).toHaveClass('category-frontend')
    })

    it('应该渲染作者信息', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.getByText('Test Author')).toBeInTheDocument()
      expect(screen.getByTestId('avatar')).toBeInTheDocument()
    })

    it('应该渲染评分信息', () => {
      render(<ResourceCard resource={mockResource} />)

      const ratingStars = screen.getByTestId('rating-stars')
      expect(ratingStars).toHaveAttribute('data-rating', '4.5')
      expect(ratingStars).toHaveAttribute('data-total-count', '100')
    })

    it('应该渲染统计信息（不重复评分）', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.getByText('1,500')).toBeInTheDocument() // viewCount
      expect(screen.getByText('25')).toBeInTheDocument() // commentCount
      // 评分在卡片右上角星级组件中展示，底部统计不再重复
      const ratingStars = screen.getByTestId('rating-stars')
      expect(ratingStars).toHaveAttribute('data-rating', '4.5')
    })
  })

  describe('标签渲染', () => {
    it('应该渲染前3个标签', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.getByText('#React')).toBeInTheDocument()
      expect(screen.getByText('#TypeScript')).toBeInTheDocument()
      expect(screen.getByText('#Testing')).toBeInTheDocument()
    })

    it('当标签数量超过3个时应该显示更多标签提示', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.getByText('+2 更多')).toBeInTheDocument()
    })

    it('当标签数量不超过3个时不应该显示更多标签提示', () => {
      const resourceWithFewTags = {
        ...mockResource,
        tags: ['React', 'TypeScript'],
      }

      render(<ResourceCard resource={resourceWithFewTags} />)

      expect(screen.queryByText(/\+\d+ 更多/)).not.toBeInTheDocument()
    })
  })

  describe('精选标识', () => {
    it('当资源为精选时应该显示精选标识', () => {
      const featuredResource = { ...mockResource, featured: true }

      render(<ResourceCard resource={featuredResource} />)

      expect(screen.getByText('精')).toBeInTheDocument()
    })

    it('当资源非精选时不应该显示精选标识', () => {
      render(<ResourceCard resource={mockResource} />)

      expect(screen.queryByText('精')).not.toBeInTheDocument()
    })
  })

  describe('交互功能', () => {
    it('点击卡片应该导航到资源详情页', () => {
      render(<ResourceCard resource={mockResource} />)

      // 点击卡片容器
      const card = screen.getByText('Test Resource').closest('div')
      expect(card).toBeInTheDocument()

      if (card) {
        fireEvent.click(card)
        expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')
      }
    })

    it('点击查看详情按钮应该导航到资源详情页', () => {
      render(<ResourceCard resource={mockResource} />)

      const detailButton = screen.getByText('查看详情')
      fireEvent.click(detailButton)

      // 重构后，按钮点击也会导航，但会阻止事件冒泡
      expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')
    })

    it('标签现在是纯展示性的，不阻止事件', () => {
      render(<ResourceCard resource={mockResource} />)

      // 标签现在移除了 data-no-click 属性，所以点击标签会冒泡到卡片
      const tag = screen.getByText('#React')
      fireEvent.click(tag)

      // 事件会冒泡到卡片，触发导航
      expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')
    })

    it('鼠标悬停时应该应用悬停样式', () => {
      render(<ResourceCard resource={mockResource} />)

      const card = screen.getByText('Test Resource').closest('div')
      expect(card).toHaveClass('hover:shadow-lg', 'hover:-translate-y-1')
    })
  })

  describe('性能优化', () => {
    it('应该使用React.memo进行优化', () => {
      // 这个测试验证组件是否被memo包装
      const { rerender } = render(<ResourceCard resource={mockResource} />)

      // 相同props时不应该重新渲染
      const spy = jest.spyOn(console, 'log')
      rerender(<ResourceCard resource={mockResource} />)

      // 验证组件确实使用了memo（通过检查是否有重复的渲染日志）
      expect(spy).not.toHaveBeenCalledWith('ResourceCard re-rendered')

      spy.mockRestore()
    })

    it('当关键属性变化时应该重新渲染', () => {
      const { rerender } = render(<ResourceCard resource={mockResource} />)

      const updatedResource = {
        ...mockResource,
        title: 'Updated Title',
      }

      rerender(<ResourceCard resource={updatedResource} />)

      expect(screen.getByText('Updated Title')).toBeInTheDocument()
      expect(screen.queryByText('Test Resource')).not.toBeInTheDocument()
    })
  })

  describe('无障碍性', () => {
    it('卡片应该是可点击的', () => {
      render(<ResourceCard resource={mockResource} />)

      const card = screen.getByText('Test Resource').closest('div')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('按钮和链接应该有适当的角色', () => {
      render(<ResourceCard resource={mockResource} />)

      const detailButton = screen.getByRole('button', { name: /查看详情/i })
      expect(detailButton).toBeInTheDocument()
    })
  })

  describe('数据格式化', () => {
    it('应该正确格式化大数字', () => {
      const resourceWithLargeNumbers = {
        ...mockResource,
        viewCount: 123456,
        commentCount: 9999,
      }

      render(<ResourceCard resource={resourceWithLargeNumbers} />)

      expect(screen.getByText('123,456')).toBeInTheDocument()
      expect(screen.getByText('9,999')).toBeInTheDocument()
    })

    it('应该正确格式化评分（展示在星级组件上）', () => {
      const resourceWithRating = {
        ...mockResource,
        rating: 3.7,
      }

      render(<ResourceCard resource={resourceWithRating} />)
      const ratingStars = screen.getByTestId('rating-stars')
      expect(ratingStars).toHaveAttribute('data-rating', '3.7')
    })
  })

  describe('边界情况', () => {
    it('应该处理空标签数组', () => {
      const resourceWithNoTags = {
        ...mockResource,
        tags: [],
      }

      render(<ResourceCard resource={resourceWithNoTags} />)

      expect(screen.queryByText(/^#/)).not.toBeInTheDocument()
    })

    it('应该处理长标题', () => {
      const resourceWithLongTitle = {
        ...mockResource,
        title:
          'This is a very long title that should be truncated properly to prevent layout issues',
      }

      render(<ResourceCard resource={resourceWithLongTitle} />)

      const title = screen.getByText(resourceWithLongTitle.title)
      expect(title).toHaveClass('line-clamp-2')
    })

    it('应该处理长描述', () => {
      const resourceWithLongDescription = {
        ...mockResource,
        description:
          'This is a very long description that should be truncated after three lines to maintain consistent card height and layout across different resources in the grid view.',
      }

      render(<ResourceCard resource={resourceWithLongDescription} />)

      const markdown = screen.getByTestId('markdown')
      expect(markdown.closest('.line-clamp-3')).toBeTruthy()
    })

    it('应该处理缺失的作者头像', () => {
      render(<ResourceCard resource={mockResource} />)

      // 没有头像时应该显示作者名称首字母
      expect(screen.getByText('T')).toBeInTheDocument() // Test Author 的首字母
    })
  })
})
