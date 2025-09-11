import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ResourceStats, createStatsConfig } from '@/components/ui/resource-stats'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Eye: ({ className }: any) => <div data-testid="eye-icon" className={className} />,
  MessageSquare: ({ className }: any) => <div data-testid="message-icon" className={className} />,
  Star: ({ className }: any) => <div data-testid="star-icon" className={className} />,
  Heart: ({ className }: any) => <div data-testid="heart-icon" className={className} />,
}))

describe('ResourceStats Component', () => {
  // 测试数据
  const mockStatsConfig = [
    {
      key: 'views',
      value: 1500,
      label: '浏览',
      icon: 'Eye',
      formatter: (value: number) => value.toLocaleString(),
      interactive: true
    },
    {
      key: 'comments',
      value: 25,
      label: '评论',
      icon: 'MessageSquare',
      formatter: (value: number) => value.toString(),
      interactive: true
    },
    {
      key: 'rating',
      value: 4.5,
      label: '评分',
      icon: 'Star',
      formatter: (value: number) => value.toFixed(1),
      interactive: false
    }
  ]

  describe('基础渲染测试', () => {
    it('应该正确渲染统计数据', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      // 验证数字显示
      expect(screen.getByText('1,500')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('4.5')).toBeInTheDocument()

      // 验证图标
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
      expect(screen.getByTestId('message-icon')).toBeInTheDocument()
      expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    })

    it('应该应用默认样式类', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      const container = screen.getByRole('group', { name: /统计数据/i })
      expect(container).toHaveClass('flex', 'items-center', 'gap-3', 'text-xs', 'text-gray-500')
    })

    it('应该应用自定义className', () => {
      render(<ResourceStats stats={mockStatsConfig} className="custom-class" />)

      const container = screen.getByRole('group', { name: /统计数据/i })
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('变体样式测试', () => {
    it('应该正确渲染compact变体', () => {
      render(<ResourceStats stats={mockStatsConfig} variant="compact" />)

      const container = screen.getByRole('group', { name: /统计数据/i })
      expect(container).toHaveClass('gap-2', 'text-xs')
    })

    it('应该正确渲染emoji变体', () => {
      const emojiStats = [
        {
          key: 'views',
          value: 1500,
          label: '浏览',
          emoji: '👀',
          formatter: (value: number) => value.toLocaleString()
        },
        {
          key: 'likes',
          value: 120,
          label: '点赞',
          emoji: '❤️',
          formatter: (value: number) => value.toString()
        }
      ]

      render(<ResourceStats stats={emojiStats} variant="emoji" />)

      // 验证emoji显示
      expect(screen.getByText('👀')).toBeInTheDocument()
      expect(screen.getByText('❤️')).toBeInTheDocument()
      expect(screen.getByText('1,500')).toBeInTheDocument()
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
          icon: 'Eye',
          formatter: (value: number) => value.toLocaleString()
        },
        {
          key: 'comments',
          value: 9999,
          label: '评论',
          icon: 'MessageSquare',
          formatter: (value: number) => value.toString()
        }
      ]

      render(<ResourceStats stats={largeNumberStats} />)

      expect(screen.getByText('123,456')).toBeInTheDocument()
      expect(screen.getByText('9999')).toBeInTheDocument()
    })

    it('应该正确格式化小数', () => {
      const decimalStats = [
        {
          key: 'rating',
          value: 3.14159,
          label: '评分',
          icon: 'Star',
          formatter: (value: number) => value.toFixed(2)
        }
      ]

      render(<ResourceStats stats={decimalStats} />)

      expect(screen.getByText('3.14')).toBeInTheDocument()
    })

    it('应该处理零值', () => {
      const zeroStats = [
        {
          key: 'comments',
          value: 0,
          label: '评论',
          icon: 'MessageSquare',
          formatter: (value: number) => value.toString()
        }
      ]

      render(<ResourceStats stats={zeroStats} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('交互性测试', () => {
    it('应该处理可交互统计项的点击', () => {
      const onInteraction = jest.fn()

      render(
        <ResourceStats 
          stats={mockStatsConfig} 
          onInteraction={onInteraction}
        />
      )

      // 点击可交互的浏览统计
      const viewsItem = screen.getByText('1,500').closest('span')
      expect(viewsItem).toHaveClass('cursor-pointer', 'hover:text-blue-600')
      
      fireEvent.click(viewsItem!)

      expect(onInteraction).toHaveBeenCalledWith('views', 1500)
    })

    it('应该处理不可交互统计项', () => {
      const onInteraction = jest.fn()

      render(
        <ResourceStats 
          stats={mockStatsConfig} 
          onInteraction={onInteraction}
        />
      )

      // 点击不可交互的评分统计
      const ratingItem = screen.getByText('4.5').closest('span')
      expect(ratingItem).not.toHaveClass('cursor-pointer')
      
      fireEvent.click(ratingItem!)

      // 不可交互项不应该触发回调
      expect(onInteraction).not.toHaveBeenCalledWith('rating', 4.5)
    })

    it('应该在没有onInteraction回调时正常工作', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      const viewsItem = screen.getByText('1,500').closest('span')
      
      expect(() => {
        fireEvent.click(viewsItem!)
      }).not.toThrow()
    })
  })

  describe('边界条件测试', () => {
    it('应该处理空的统计配置', () => {
      render(<ResourceStats stats={[]} />)

      const container = screen.getByRole('group', { name: /统计数据/i })
      expect(container).toBeInTheDocument()
      expect(container.children).toHaveLength(0)
    })

    it('应该处理缺少formatter的统计项', () => {
      const statsWithoutFormatter = [
        {
          key: 'views',
          value: 1500,
          label: '浏览',
          icon: 'Eye'
          // 缺少formatter
        }
      ]

      render(<ResourceStats stats={statsWithoutFormatter as any} />)

      // 应该显示原始数值
      expect(screen.getByText('1500')).toBeInTheDocument()
    })

    it('应该处理负数', () => {
      const negativeStats = [
        {
          key: 'change',
          value: -50,
          label: '变化',
          icon: 'Eye',
          formatter: (value: number) => value.toString()
        }
      ]

      render(<ResourceStats stats={negativeStats} />)

      expect(screen.getByText('-50')).toBeInTheDocument()
    })
  })

  describe('性能优化测试', () => {
    it('应该使用React.memo进行优化', () => {
      const { rerender } = render(<ResourceStats stats={mockStatsConfig} />)

      // 使用相同props重新渲染，应该被memo优化
      const spy = jest.spyOn(console, 'log')
      rerender(<ResourceStats stats={mockStatsConfig} />)

      // 验证没有重复渲染日志
      expect(spy).not.toHaveBeenCalledWith('ResourceStats re-rendered')

      spy.mockRestore()
    })

    it('应该在stats变化时重新渲染', () => {
      const { rerender } = render(<ResourceStats stats={mockStatsConfig} />)

      const updatedStats = [...mockStatsConfig]
      updatedStats[0] = { ...updatedStats[0], value: 2000 }

      rerender(<ResourceStats stats={updatedStats} />)

      expect(screen.getByText('2,000')).toBeInTheDocument()
      expect(screen.queryByText('1,500')).not.toBeInTheDocument()
    })
  })

  describe('可访问性测试', () => {
    it('应该具有适当的ARIA属性', () => {
      render(<ResourceStats stats={mockStatsConfig} />)

      const container = screen.getByRole('group', { name: /统计数据/i })
      expect(container).toBeInTheDocument()
    })

    it('可交互元素应该是可访问的', () => {
      const onInteraction = jest.fn()

      render(
        <ResourceStats 
          stats={mockStatsConfig} 
          onInteraction={onInteraction}
        />
      )

      // 可交互元素应该有适当的角色
      const interactiveItems = screen.getAllByRole('button')
      expect(interactiveItems).toHaveLength(2) // views 和 comments 是可交互的
    })
  })
})

// createStatsConfig 工厂函数测试
describe('createStatsConfig Function', () => {
  const mockResource = {
    viewCount: 1500,
    commentCount: 25,
    rating: 4.5,
    likeCount: 120
  }

  describe('资源类型配置', () => {
    it('应该为resource类型创建正确的配置', () => {
      const config = createStatsConfig(mockResource, 'resource')

      expect(config).toHaveLength(3)
      expect(config[0]).toMatchObject({
        key: 'views',
        value: 1500,
        label: '浏览',
        icon: 'Eye',
        interactive: true
      })
      expect(config[1]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论',
        icon: 'MessageSquare',
        interactive: true
      })
      expect(config[2]).toMatchObject({
        key: 'rating',
        value: 4.5,
        label: '评分',
        icon: 'Star',
        interactive: false
      })
    })

    it('应该正确格式化resource的数值', () => {
      const config = createStatsConfig(mockResource, 'resource')
      
      // 测试格式化函数
      expect(config[0].formatter(1500)).toBe('1,500')
      expect(config[1].formatter(25)).toBe('25')
      expect(config[2].formatter(4.5)).toBe('4.5')
    })
  })

  describe('文章类型配置', () => {
    it('应该为article类型创建正确的配置', () => {
      const config = createStatsConfig(mockResource, 'article')

      expect(config).toHaveLength(3)
      expect(config[0]).toMatchObject({
        key: 'views',
        value: 1500,
        label: '浏览'
      })
      expect(config[1]).toMatchObject({
        key: 'likes',
        value: 120,
        label: '点赞'
      })
      expect(config[2]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论'
      })
    })
  })

  describe('动态类型配置', () => {
    it('应该为vibe类型创建正确的配置', () => {
      const config = createStatsConfig(mockResource, 'vibe')

      expect(config).toHaveLength(2)
      expect(config[0]).toMatchObject({
        key: 'likes',
        value: 120,
        label: '点赞'
      })
      expect(config[1]).toMatchObject({
        key: 'comments',
        value: 25,
        label: '评论'
      })
    })
  })

  describe('边界条件', () => {
    it('应该处理缺失的字段', () => {
      const incompleteResource = {
        viewCount: 1500
        // 缺少其他字段
      }

      const config = createStatsConfig(incompleteResource, 'resource')

      expect(config[0].value).toBe(1500)
      expect(config[1].value).toBe(0) // commentCount 默认为0
      expect(config[2].value).toBe(0) // rating 默认为0
    })

    it('应该处理未知的数据类型', () => {
      const config = createStatsConfig(mockResource, 'unknown' as any)

      // 应该返回空配置
      expect(config).toEqual([])
    })
  })
})