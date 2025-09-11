/**
 * API集成测试
 * 测试API端点的集成功能
 */

import { AuthService, AuthError } from '@/lib/auth/auth-service'
import { TokenManager } from '@/lib/auth/token-manager'

// Mock TokenManager for testing
jest.mock('@/lib/auth/token-manager', () => ({
  TokenManager: {
    hasValidToken: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setTokens: jest.fn(),
    clearTokens: jest.fn(),
    getTimeUntilExpiry: jest.fn(),
  },
}))

const MockedTokenManager = TokenManager as jest.Mocked<typeof TokenManager>

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset all mocks
    MockedTokenManager.hasValidToken.mockReturnValue(false)
    MockedTokenManager.getAccessToken.mockReturnValue(null)
    MockedTokenManager.getRefreshToken.mockReturnValue(null)
  })

  describe('Authentication API', () => {
    describe('登录API', () => {
      it('应该成功登录并返回用户信息和token', async () => {
        const result = await AuthService.login({
          email: 'admin@mycoding.com',
          password: 'admin123',
        })

        expect(result.user).toHaveProperty('id')
        expect(result.user).toHaveProperty('name')
        expect(result.user).toHaveProperty('email', 'admin@mycoding.com')
        expect(result.tokens).toHaveProperty('accessToken')
        expect(result.tokens).toHaveProperty('refreshToken')
        expect(result.tokens).toHaveProperty('expiresIn')
      })

      it('应该处理登录失败的情况', async () => {
        await expect(
          AuthService.login({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
        ).rejects.toThrow('邮箱或密码错误')
      })
    })

    describe('注册API', () => {
      it('应该成功注册新用户', async () => {
        const result = await AuthService.register({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })

        expect(result.user).toHaveProperty('id')
        expect(result.user).toHaveProperty('name', 'New User')
        expect(result.user).toHaveProperty('email', 'newuser@example.com')
        expect(result.tokens).toHaveProperty('accessToken')
        expect(result.tokens).toHaveProperty('refreshToken')
        expect(result.tokens).toHaveProperty('expiresIn')
      })

      it('应该处理邮箱已存在的情况', async () => {
        await expect(
          AuthService.register({
            name: 'Test User',
            email: 'admin@mycoding.com', // 使用已存在的邮箱
            password: 'password123',
            confirmPassword: 'password123',
          })
        ).rejects.toThrow('该邮箱已被注册')
      })
    })

    describe('Token刷新API', () => {
      it('应该成功刷新token', async () => {
        // 模拟有效的refresh token（使用正确的格式）
        const validRefreshToken = 'refresh.eyJ1c2VySWQiOiIxIiwidHlwZSI6InJlZnJlc2gifQ==.signature'
        MockedTokenManager.getRefreshToken.mockReturnValue(validRefreshToken)

        const result = await AuthService.refreshToken()

        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('refreshToken')
        expect(result).toHaveProperty('expiresIn')
      })

      it('应该处理无效refresh token的情况', async () => {
        MockedTokenManager.getRefreshToken.mockReturnValue('invalid-token')

        await expect(AuthService.refreshToken()).rejects.toThrow(
          '无效的刷新令牌'
        )
      })
    })

    describe('获取用户信息API', () => {
      it('应该成功获取当前用户信息', async () => {
        // 模拟有效的access token
        MockedTokenManager.getAccessToken.mockReturnValue('mock.eyJ1c2VySWQiOiIxIn0=.signature')

        const result = await AuthService.getCurrentUser()

        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('email')
      })

      it('应该处理未认证的情况', async () => {
        MockedTokenManager.getAccessToken.mockReturnValue('invalid-token')

        await expect(AuthService.getCurrentUser()).rejects.toThrow('无效的访问令牌')
      })
    })
  })

  // Resources API 测试留待未来实现
  // 目前只测试认证相关功能

  describe('错误处理', () => {
    it('应该处理登录失败', async () => {
      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('邮箱或密码错误')
    })

    it('应该处理密码不匹配错误', async () => {
      await expect(
        AuthService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'different_password',
        })
      ).rejects.toThrow('密码和确认密码不匹配')
    })

    it('应该处理token缺失错误', async () => {
      MockedTokenManager.getAccessToken.mockReturnValue(null)

      await expect(AuthService.getCurrentUser()).rejects.toThrow('未找到访问令牌')
    })
  })

  describe('认证流程测试', () => {
    it('应该正确处理登录流程', async () => {
      const result = await AuthService.login({
        email: 'admin@mycoding.com',
        password: 'admin123',
      })

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('tokens')
      expect(result.user.email).toBe('admin@mycoding.com')
    })

    it('应该正确处理注册流程', async () => {
      const result = await AuthService.register({
        name: 'New Test User',
        email: 'newtest@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('tokens')
      expect(result.user.name).toBe('New Test User')
      expect(result.user.email).toBe('newtest@example.com')
    })
  })

  describe('Token管理测试', () => {
    it('应该正确处理token刷新', async () => {
      // 模拟有效的refresh token（使用正确的格式）
      const validRefreshToken = 'refresh.eyJ1c2VySWQiOiIxIiwidHlwZSI6InJlZnJlc2gifQ==.signature'
      MockedTokenManager.getRefreshToken.mockReturnValue(validRefreshToken)

      const result = await AuthService.refreshToken()

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result).toHaveProperty('expiresIn')
    })
  })
})
