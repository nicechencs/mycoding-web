import { renderHook, act } from '@testing-library/react'
import { useResourceCard } from '@/hooks/use-resource-card'
import { Resource } from '@/types/resource'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('useResourceCard', () => {
  const mockResource: Resource = {
    id: '1',
    title: 'Test Resource',
    slug: 'test-resource',
    description: 'Test description',
    category: 'Frontend',
    tags: ['React'],
    author: 'Test Author',
    authorId: 'author-1',
    rating: 4.5,
    ratingCount: 100,
    viewCount: 1500,
    likeCount: 120,
    commentCount: 25,
    featured: false,
    url: 'https://example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该返回正确的处理函数', () => {
    const { result } = renderHook(() => useResourceCard(mockResource))

    expect(result.current).toHaveProperty('handleCardClick')
    expect(result.current).toHaveProperty('handleActionClick')
    expect(typeof result.current.handleCardClick).toBe('function')
    expect(typeof result.current.handleActionClick).toBe('function')
  })

  it('handleCardClick 应该导航到正确的路径', () => {
    const { result } = renderHook(() => useResourceCard(mockResource))

    act(() => {
      result.current.handleCardClick()
    })

    expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')
  })

  it('handleActionClick 应该导航到正确的路径', () => {
    const { result } = renderHook(() => useResourceCard(mockResource))
    const mockEvent = {
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleActionClick(mockEvent)
    })

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')
  })

  it('应该根据resource.slug的变化更新导航路径', () => {
    const { result, rerender } = renderHook(
      ({ resource }) => useResourceCard(resource),
      { initialProps: { resource: mockResource } }
    )

    // 测试初始资源的导航
    act(() => {
      result.current.handleCardClick()
    })
    expect(mockPush).toHaveBeenCalledWith('/resources/test-resource')

    // 使用不同slug的资源
    const differentResource = { ...mockResource, slug: 'different-slug' }
    rerender({ resource: differentResource })

    // 清除之前的调用记录
    mockPush.mockClear()

    // 测试更新后的导航路径
    act(() => {
      result.current.handleCardClick()
    })
    expect(mockPush).toHaveBeenCalledWith('/resources/different-slug')
  })
})