import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider, AuthContext } from '@/components/auth/AuthProvider'
import { AuthService } from '@/lib/auth/auth-service'
import { TokenManager } from '@/lib/auth/token-manager'
import { AuthUser, AuthToken } from '@/lib/auth/auth-types'

// Mock dependencies
jest.mock('@/lib/auth/auth-service')
jest.mock('@/lib/auth/token-manager')

const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>
const MockedTokenManager = TokenManager as jest.Mocked<typeof TokenManager>

// Test component to access context
const TestComponent = () => {
  const context = React.useContext(AuthContext)

  if (!context) {
    return <div>No auth context</div>
  }

  const {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  } = context

  return (
    <div>
      <div data-testid="auth-status">
        {isLoading
          ? 'Loading'
          : isAuthenticated
            ? 'Authenticated'
            : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `User: ${user.name}` : 'No User'}
      </div>
      <div data-testid="error-info">{error || 'No Error'}</div>
      <button
        data-testid="login-button"
        onClick={() => login({ email: 'test@test.com', password: 'password' })}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => logout()}>
        Logout
      </button>
      <button
        data-testid="register-button"
        onClick={() =>
          register({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password',
            confirmPassword: 'password',
          })
        }
      >
        Register
      </button>
      <button data-testid="clear-error-button" onClick={() => clearError()}>
        Clear Error
      </button>
    </div>
  )
}

describe('AuthProvider Component', () => {
  const mockUser: AuthUser = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    role: 'user',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  }

  const mockTokens: AuthToken = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Default mocks
    MockedTokenManager.hasValidToken.mockReturnValue(false)
    MockedTokenManager.getTimeUntilExpiry.mockReturnValue(300000) // 5 minutes
    MockedTokenManager.setTokens.mockImplementation(() => {})
    MockedTokenManager.clearTokens.mockImplementation(() => {})

    MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
    MockedAuthService.login.mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    })
    MockedAuthService.register.mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    })
    MockedAuthService.logout.mockResolvedValue(undefined)
    MockedAuthService.refreshToken.mockResolvedValue(mockTokens)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('初始化状态', () => {
    it('应该渲染loading状态', () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Loading')
    })

    it('当没有有效token时应该设置为未认证状态', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent('No User')
    })

    it('当有有效token时应该获取用户信息', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: Test User'
      )
      expect(MockedAuthService.getCurrentUser).toHaveBeenCalledTimes(1)
    })

    it('当获取用户信息失败时应该清除token', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedAuthService.getCurrentUser.mockRejectedValue(
        new Error('Unauthorized')
      )

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      expect(MockedTokenManager.clearTokens).toHaveBeenCalledTimes(1)
    })
  })

  describe('登录功能', () => {
    it('成功登录应该设置用户状态', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)
      MockedAuthService.login.mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // 等待初始化完成
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      // 执行登录
      const loginButton = screen.getByTestId('login-button')
      await act(async () => {
        fireEvent.click(loginButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: Test User'
      )
      expect(MockedTokenManager.setTokens).toHaveBeenCalledWith(mockTokens)
    })

    it('登录失败应该设置错误状态', async () => {
      const loginError = new Error('Invalid credentials')
      MockedTokenManager.hasValidToken.mockReturnValue(false)
      MockedAuthService.login.mockRejectedValue(loginError)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      const loginButton = screen.getByTestId('login-button')
      await act(async () => {
        fireEvent.click(loginButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error-info')).toHaveTextContent(
          '登录失败，请重试'
        )
      })

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated'
      )
    })
  })

  describe('注册功能', () => {
    it('成功注册应该设置用户状态', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)
      MockedAuthService.register.mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      const registerButton = screen.getByTestId('register-button')
      await act(async () => {
        fireEvent.click(registerButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: Test User'
      )
      expect(MockedTokenManager.setTokens).toHaveBeenCalledWith(mockTokens)
    })

    it('注册失败应该设置错误状态', async () => {
      const registerError = new Error('Email already exists')
      MockedTokenManager.hasValidToken.mockReturnValue(false)
      MockedAuthService.register.mockRejectedValue(registerError)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      const registerButton = screen.getByTestId('register-button')
      await act(async () => {
        fireEvent.click(registerButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error-info')).toHaveTextContent(
          '注册失败，请重试'
        )
      })

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated'
      )
    })
  })

  describe('注销功能', () => {
    it('成功注销应该清除用户状态', async () => {
      // 先设置为已认证状态
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
      MockedAuthService.logout.mockResolvedValue(undefined)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      const logoutButton = screen.getByTestId('logout-button')
      await act(async () => {
        fireEvent.click(logoutButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent('No User')
      expect(MockedAuthService.logout).toHaveBeenCalledTimes(1)
    })

    it('注销失败也应该清除本地状态', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
      MockedAuthService.logout.mockRejectedValue(new Error('Logout failed'))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      const logoutButton = screen.getByTestId('logout-button')
      await act(async () => {
        fireEvent.click(logoutButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      expect(MockedTokenManager.clearTokens).toHaveBeenCalledTimes(1)
    })
  })

  describe('错误处理', () => {
    it('clearError应该清除错误状态', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)
      MockedAuthService.login.mockRejectedValue(new Error('Login failed'))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      // 触发错误
      const loginButton = screen.getByTestId('login-button')
      await act(async () => {
        fireEvent.click(loginButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error-info')).toHaveTextContent(
          '登录失败，请重试'
        )
      })

      // 清除错误
      const clearErrorButton = screen.getByTestId('clear-error-button')
      await act(async () => {
        fireEvent.click(clearErrorButton)
      })

      expect(screen.getByTestId('error-info')).toHaveTextContent('No Error')
    })
  })

  describe('Token刷新', () => {
    it('应该在token快过期时自动刷新', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedTokenManager.getTimeUntilExpiry.mockReturnValue(240000) // 4 minutes
      MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
      MockedAuthService.refreshToken.mockResolvedValue(mockTokens)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      // 快进时间触发token刷新 (4分钟 - 5分钟缓冲 = -1分钟，应该立即触发)
      await act(async () => {
        jest.advanceTimersByTime(1000) // 1 second to trigger immediate refresh
      })

      await waitFor(() => {
        expect(MockedAuthService.refreshToken).toHaveBeenCalled()
      })

      expect(MockedTokenManager.setTokens).toHaveBeenCalledWith(mockTokens)
    })

    it('token刷新失败应该注销用户', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(true)
      MockedTokenManager.getTimeUntilExpiry.mockReturnValue(240000)
      MockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
      MockedAuthService.refreshToken.mockRejectedValue(
        new Error('Refresh failed')
      )
      MockedAuthService.logout.mockResolvedValue(undefined)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        )
      })

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })
    })
  })

  describe('Context提供', () => {
    it('应该抛出错误当在Provider外使用Context时', () => {
      // 这个测试需要一个使用useAuth hook的组件来验证
      const TestHookComponent = () => {
        try {
          const context = React.useContext(AuthContext)
          if (!context) {
            throw new Error('useAuth must be used within an AuthProvider')
          }
          return <div>Context available</div>
        } catch (error) {
          return <div>Error: {(error as Error).message}</div>
        }
      }

      render(<TestHookComponent />)

      expect(screen.getByText('No auth context')).toBeInTheDocument()
    })

    it('应该提供正确的context值', async () => {
      MockedTokenManager.hasValidToken.mockReturnValue(false)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated'
        )
      })

      // 验证所有按钮都存在（证明所有方法都被提供了）
      expect(screen.getByTestId('login-button')).toBeInTheDocument()
      expect(screen.getByTestId('logout-button')).toBeInTheDocument()
      expect(screen.getByTestId('register-button')).toBeInTheDocument()
      expect(screen.getByTestId('clear-error-button')).toBeInTheDocument()
    })
  })
})
