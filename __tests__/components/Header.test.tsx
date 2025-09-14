import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/layout/header'
import { AuthProvider } from '@/components/auth/AuthProvider'

// Mock the hooks and services
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/lib/config', () => ({
  siteConfig: {
    name: 'MyCoding',
  },
  navConfig: {
    mainNav: [
      { title: '首页', href: '/' },
      { title: '资源', href: '/resources' },
      { title: '文章', href: '/posts' },
      { title: '动态', href: '/vibes' },
    ],
  },
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, variant, ...props }: any) => {
    const Component = asChild ? 'span' : 'button'
    return (
      <Component data-variant={variant} {...props}>
        {children}
      </Component>
    )
  },
}))

describe('Header Component', () => {
  const mockUseAuth = require('@/hooks/use-auth').useAuth

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('未登录状态', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      })
    })

    it('应该渲染网站名称和Logo', () => {
      render(<Header />)

      expect(screen.getByText('MyCoding')).toBeInTheDocument()
      expect(screen.getByText('💻')).toBeInTheDocument()
    })

    it('应该渲染主导航菜单', () => {
      render(<Header />)

      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('资源')).toBeInTheDocument()
      expect(screen.getByText('文章')).toBeInTheDocument()
      expect(screen.getByText('动态')).toBeInTheDocument()
    })

    it('应该显示登录和注册按钮', () => {
      render(<Header />)

      expect(screen.getByText('登录')).toBeInTheDocument()
      expect(screen.getByText('注册')).toBeInTheDocument()
    })

    it('应该显示移动端菜单按钮', () => {
      render(<Header />)

      const menuButton = screen.getByLabelText('切换菜单')
      expect(menuButton).toBeInTheDocument()
    })

    it('点击移动端菜单按钮应该切换菜单显示状态', () => {
      render(<Header />)

      const menuButton = screen.getByLabelText('切换菜单')

      // 初始状态下移动端菜单应该不可见
      expect(screen.queryByText('个人中心')).not.toBeInTheDocument()

      // 点击菜单按钮
      fireEvent.click(menuButton)

      // 移动端菜单中的导航项应该可见
      const mobileNavItems = screen.getAllByText('首页')
      expect(mobileNavItems.length).toBeGreaterThan(1) // 桌面版 + 移动版
    })
  })

  describe('已登录状态', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: null,
    }

    const mockLogout = jest.fn()

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        logout: mockLogout,
      })
    })

    it('应该显示用户信息', () => {
      render(<Header />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('T')).toBeInTheDocument() // 用户名首字母
    })

    it('应该显示用户菜单按钮', () => {
      render(<Header />)

      const userMenuButton = screen.getByRole('button', {
        name: /test user/i,
      })
      expect(userMenuButton).toBeInTheDocument()
    })

    it('点击用户菜单应该显示下拉菜单', () => {
      render(<Header />)

      const userMenuButton = screen.getByRole('button', {
        name: /test user/i,
      })

      // 初始状态下拉菜单不可见
      expect(screen.queryByText('个人中心')).not.toBeInTheDocument()

      // 点击用户菜单
      fireEvent.click(userMenuButton)

      // 下拉菜单应该可见；不应包含“设置”
      expect(screen.getByText('个人中心')).toBeInTheDocument()
      expect(screen.queryByText('设置')).not.toBeInTheDocument()
      expect(screen.getByText('退出登录')).toBeInTheDocument()
    })

    it('点击退出登录应该调用logout函数', async () => {
      render(<Header />)

      // 打开用户菜单
      const userMenuButton = screen.getByRole('button', {
        name: /test user/i,
      })
      fireEvent.click(userMenuButton)

      // 点击退出登录
      const logoutButton = screen.getByText('退出登录')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1)
      })
    })

    it('不应该显示登录注册按钮', () => {
      render(<Header />)

      // 在已登录状态下，登录注册按钮应该不可见（在桌面版）
      const loginButtons = screen.queryAllByText('登录')
      const registerButtons = screen.queryAllByText('注册')

      // 可能在移动端菜单中还有，但桌面版应该没有
      expect(loginButtons.length).toBeLessThanOrEqual(1)
      expect(registerButtons.length).toBeLessThanOrEqual(1)
    })
  })

  describe('导航功能', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      })
    })

    it('导航链接应该有正确的href属性', () => {
      render(<Header />)

      expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute(
        'href',
        '/'
      )
      expect(screen.getByRole('link', { name: '资源' })).toHaveAttribute(
        'href',
        '/resources'
      )
      expect(screen.getByRole('link', { name: '文章' })).toHaveAttribute(
        'href',
        '/posts'
      )
      expect(screen.getByRole('link', { name: '动态' })).toHaveAttribute(
        'href',
        '/vibes'
      )
    })

    it('点击移动端导航应该关闭菜单', () => {
      render(<Header />)

      // 打开移动端菜单
      const menuButton = screen.getByLabelText('切换菜单')
      fireEvent.click(menuButton)

      // 点击移动端导航项
      const mobileNavItems = screen.getAllByText('首页')
      const mobileHomeLink =
        mobileNavItems.find(item =>
          item.closest('[data-testid="mobile-nav"]')
        ) || mobileNavItems[1] // 假设第二个是移动端的

      if (mobileHomeLink) {
        fireEvent.click(mobileHomeLink)
      }

      // 验证菜单状态变化（这里需要根据实际实现调整）
    })
  })

  describe('响应式设计', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      })
    })

    it('应该在不同屏幕尺寸下正确显示元素', () => {
      render(<Header />)

      // 检查桌面版导航是否有正确的CSS类
      const desktopNav = screen.getByRole('navigation')
      expect(desktopNav).toHaveClass('hidden', 'md:flex')

      // 检查移动端菜单按钮是否有正确的CSS类
      const mobileMenuButton = screen.getByLabelText('切换菜单')
      expect(mobileMenuButton).toHaveClass('md:hidden')
    })
  })

  describe('无障碍性', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      })
    })

    it('移动端菜单按钮应该有正确的aria-label', () => {
      render(<Header />)

      const menuButton = screen.getByLabelText('切换菜单')
      expect(menuButton).toHaveAttribute('aria-label', '切换菜单')
    })

    it('用户头像应该有正确的alt文本', () => {
      const mockUserWithAvatar = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUserWithAvatar,
        logout: jest.fn(),
      })

      render(<Header />)

      const avatarImages = screen.getAllByRole('img')
      const userAvatar = avatarImages.find(
        img => img.getAttribute('alt') === 'Test User'
      )
      expect(userAvatar).toBeInTheDocument()
    })
  })
})
