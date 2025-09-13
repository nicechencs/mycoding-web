import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  ResourceStats,
  createStatsConfig,
} from '@/components/ui/resource-stats'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Eye: ({ className }: any) => (
    <div data-testid="eye-icon" className={className} />
  ),
  MessageSquare: ({ className }: any) => (
    <div data-testid="message-icon" className={className} />
  ),
  Star: ({ className }: any) => (
    <div data-testid="star-icon" className={className} />
  ),
  Heart: ({ className }: any) => (
    <div data-testid="heart-icon" className={className} />
  ),
}))

describe('ResourceStats Component', () => {
  // 测试数据
  const mockStatsConfig = [
    {
      key: 'views',
      value: 1500,
      label: '浏览',
      icon: 'Eye' as const,
      interactive: true,
    },
    {
      key: 'comments',
      value: 25,
      label: '评论',
      icon: 'MessageSquare' as const,
      interactive: true,
    },
    {
      key: 'rating',
      value: 4.5,
      label: '评分',
      icon: 'Star' as const,
      interactive: false,
    },
  ]

  describe('基础渲染测试', () => {
    it('应该正确渲染统计数据', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      // 验证数字显示
      expect(screen.getByText('1500')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('4.5')).toBeInTheDocument()

      // 验证标签显示
      expect(screen.getByText('浏览')).toBeInTheDocument()
      expect(screen.getByText('评论')).toBeInTheDocument()
      expect(screen.getByText('评分')).toBeInTheDocument()

      // 验证图标渲染
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
      expect(screen.getByTestId('message-icon')).toBeInTheDocument()
      expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    })

    it('应该处理空统计数据', () => {
      render(<ResourceStats stats={[]} />)

      // 验证容器存在但没有内容
      const container = document.querySelector('.flex.items-center.gap-4')
      expect(container).toBeInTheDocument()
      expect(container?.children.length).toBe(0)
    })

    it('应该正确处理undefined值', () => {
      const statsWithUndefined = [
        {
          key: 'views',
          value: undefined as any,
          label: '浏览',
          icon: 'Eye' as const,
        },
      ]

      render(<ResourceStats stats={statsWithUndefined} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('emoji变体渲染测试', () => {
    it('应该在emoji变体中显示emoji而不是图标', () => {
      const emojiStats = [
        {
          key: 'views',
          value: 1500,
          label: '浏览',
          icon: 'Eye' as const,
          emoji: '👀',
        },
        {
          key: 'likes',
          value: 120,
          label: '点赞',
          icon: 'Heart' as const,
          emoji: '❤️',
        },
      ]

      render(<ResourceStats stats={emojiStats} variant="emoji" />)

      // 验证emoji显示
      expect(screen.getByText('👀')).toBeInTheDocument()
      expect(screen.getByText('❤️')).toBeInTheDocument()
      expect(screen.getByText('1500')).toBeInTheDocument()
      expect(screen.getByText('120')).toBeInTheDocument()
    })
  })

  describe('数字格式化测试', () => {
    it('应该正确格式化大数字', () => {
      const largeNumberStats = [
        {
          key: 'views',
          value: 123456,
          label: '浏览',
          icon: 'Eye' as const,
        },
        {
          key: 'comments',
          value: 9999,
          label: '评论',
          icon: 'MessageSquare' as const,
        },
      ]

      render(<ResourceStats stats={largeNumberStats} />)

      expect(screen.getByText('123456')).toBeInTheDocument()
      expect(screen.getByText('9999')).toBeInTheDocument()
    })

    it('应该正确处理小数', () => {
      const decimalStats = [
        {
          key: 'rating',
          value: 3.14159,
          label: '评分',
          icon: 'Star' as const,
        },
      ]

      render(<ResourceStats stats={decimalStats} />)
      expect(screen.getByText('3.1')).toBeInTheDocument()
    })
  })

  describe('样式变体测试', () => {
    it('应该应用默认变体样式', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      const container = document.querySelector('.flex.items-center.gap-4')
      expect(container).toHaveClass('text-sm')
    })

    it('应该应用compact变体样式', () => {
      render(<ResourceStats stats={mockStatsConfig} variant="compact" />)

      const items = document.querySelectorAll('.flex.items-center.gap-1')
      expect(items.length).toBeGreaterThan(0)
    })

    it('应该应用default变体样式条于例外', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      const container = document.querySelector('.flex.items-center.gap-6')
      expect(container).toBeInTheDocument()
    })
  })

  describe('交互功能测试', () => {
    it('应该处理可交互项目的点击', () => {
      const mockOnInteraction = jest.fn()
      const statsWithHandlers = [
        {
          key: 'views',
          value: 999,
          label: '浏览',
          icon: 'Eye' as const,
          interactive: true,
          onClick: mockOnInteraction,
        },
        {
          key: 'comments',
          value: 15,
          label: '评论',
          icon: 'MessageSquare' as const,
          interactive: true,
          onClick: mockOnInteraction,
        },
      ]

      render(<ResourceStats stats={statsWithHandlers} />)

      // 点击第一个统计项
      const viewsItem = screen.getByText('999').closest('div')
      fireEvent.click(viewsItem!)

      expect(mockOnInteraction).toHaveBeenCalledTimes(1)

      // 点击第二个统计项
      const commentsItem = screen.getByText('15').closest('div')
      fireEvent.click(commentsItem!)

      expect(mockOnInteraction).toHaveBeenCalledTimes(2)
    })

    it('不应该为非交互项目添加点击处理', () => {
      const mockOnInteraction = jest.fn()
      const statsWithHandlers = [
        {
          key: 'views',
          value: 999,
          label: '浏览',
          icon: 'Eye' as const,
          interactive: true,
          onClick: mockOnInteraction,
        },
        {
          key: 'comments',
          value: 15,
          label: '评论',
          icon: 'MessageSquare' as const,
          interactive: false,
          onClick: mockOnInteraction,
        },
      ]

      render(<ResourceStats stats={statsWithHandlers} />)

      // 点击非交互项目
      const commentsItem = screen.getByText('15').closest('div')
      fireEvent.click(commentsItem!)

      // 不应该触发回调
      expect(mockOnInteraction).not.toHaveBeenCalled()

      // 点击交互项目
      const viewsItem = screen.getByText('999').closest('div')
      fireEvent.click(viewsItem!)

      // 应该触发回调
      expect(mockOnInteraction).toHaveBeenCalledTimes(1)
    })
  })

  describe('响应式尺寸测试', () => {
    it('应该应用xs尺寸类', () => {
      render(<ResourceStats stats={mockStatsConfig} size="xs" />)

      const container = document.querySelector('.flex.items-center')
      expect(container).toHaveClass('gap-3', 'text-xs')
    })

    it('应该应用sm尺寸类', () => {
      render(<ResourceStats stats={mockStatsConfig} size="sm" />)

      const container = document.querySelector('.flex.items-center')
      expect(container).toHaveClass('gap-4', 'text-sm')
    })

    it('应该应用md尺寸类', () => {
      render(<ResourceStats stats={mockStatsConfig} size="md" />)

      const container = document.querySelector('.flex.items-center')
      expect(container).toHaveClass('gap-5', 'text-base')
    })

    it('应该应用md尺寸类', () => {
      render(<ResourceStats stats={mockStatsConfig} size="md" />)

      const container = document.querySelector('.flex.items-center')
      expect(container).toHaveClass('gap-5', 'text-base')
    })
  })

  describe('自定义className测试', () => {
    it('应该应用自定义className', () => {
      render(
        <ResourceStats
          stats={mockStatsConfig}
          className="custom-class text-purple-500"
        />
      )

      const container = document.querySelector('.flex.items-center')
      expect(container).toHaveClass('custom-class', 'text-purple-500')
    })
  })

  describe('边界条件测试', () => {
    it('应该处理超长文本', () => {
      const longTextStats = [
        {
          key: 'long',
          value: 42,
          label: '这是一个非常非常长的标签文本用于测试',
          icon: 'Eye' as const,
        },
      ]

      render(<ResourceStats stats={longTextStats} />)
      expect(
        screen.getByText('这是一个非常非常长的标签文本用于测试')
      ).toBeInTheDocument()
    })

    it('应该处理多个统计项', () => {
      const manyStats = Array.from({ length: 10 }, (_, i) => ({
        key: `stat-${i}`,
        value: i * 100,
        label: `统计${i}`,
        icon: 'Eye' as const,
      }))

      render(<ResourceStats stats={manyStats} />)

      manyStats.forEach(stat => {
        expect(screen.getByText(stat.value.toString())).toBeInTheDocument()
        expect(screen.getByText(stat.label)).toBeInTheDocument()
      })
    })
  })

  describe('分隔符测试', () => {
    it('应该在统计项之间显示分隔符', () => {
      render(
        <ResourceStats
          stats={[
            {
              key: 'views',
              value: 500,
              label: '浏览',
              icon: 'Eye' as const,
            },
            {
              key: 'likes',
              value: 100,
              label: '点赞',
              icon: 'Heart' as const,
            },
            {
              key: 'comments',
              value: 20,
              label: '评论',
              icon: 'MessageSquare' as const,
            },
          ]}
        />
      )

      // 应该有2个分隔符（3个项目之间）
      const separators = document.querySelectorAll('.mx-2.text-gray-300')
      expect(separators).toHaveLength(2)
      separators.forEach(separator => {
        expect(separator.textContent).toBe('·')
      })
    })
  })
})

describe('createStatsConfig函数', () => {
  const mockResource = {
    viewCount: 1500,
    commentCount: 25,
    rating: 4.5,
    likeCount: 120,
  }

  describe('资源类型配置', () => {
    it('应该为resource类型创建正确的配置', () => {
      const config = createStatsConfig('resource', mockResource)

      expect(config).toHaveLength(3)
      expect(config[0]).toMatchObject({
        key: 'views',
        value: 1500,
        label: '浏览',
        icon: 'Eye',
        interactive: true,
      })
      expect(config[1]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论',
        icon: 'MessageSquare',
        interactive: true,
      })
      expect(config[2]).toMatchObject({
        key: 'rating',
        value: 4.5,
        label: '评分',
        icon: 'Star',
        interactive: false,
      })
    })

    it('应该正确处理resource的数值', () => {
      const config = createStatsConfig('resource', mockResource)

      // 测试值是否正确
      expect(config[0].value).toBe(1500)
      expect(config[1].value).toBe(25)
      expect(config[2].value).toBe(4.5)
    })
  })

  describe('文章类型配置', () => {
    it('应该为article类型创建正确的配置', () => {
      const config = createStatsConfig('article', mockResource)

      expect(config).toHaveLength(3)
      expect(config[0]).toMatchObject({
        key: 'views',
        value: 1500,
        label: '浏览',
      })
      expect(config[1]).toMatchObject({
        key: 'likes',
        value: 120,
        label: '点赞',
      })
      expect(config[2]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论',
      })
    })
  })

  describe('动态类型配置', () => {
    it('应该为vibe类型创建正确的配置', () => {
      const config = createStatsConfig('vibe', mockResource)

      expect(config).toHaveLength(2)
      expect(config[0]).toMatchObject({
        key: 'likes',
        value: 120,
        label: '点赞',
      })
      expect(config[1]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论',
      })
    })
  })
})
