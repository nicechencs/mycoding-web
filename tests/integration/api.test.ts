/**
 * API集成测试
 * 测试API端点的集成功能
 */

import { AuthService } from '@/lib/auth/auth-service'
import { TokenManager } from '@/lib/auth/token-manager'

// Mock fetch for testing
global.fetch = jest.fn()

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.MockedFunction<typeof fetch>).mockClear()
  })

  describe('Authentication API', () => {
    describe('登录API', () => {
      it('应该成功登录并返回用户信息和token', async () => {
        const mockResponse = {
          success: true,
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
            },
            tokens: {
              accessToken: 'access-token',
              refreshToken: 'refresh-token',
            },
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response)

        const result = await AuthService.login({
          email: 'test@example.com',
          password: 'password123',
        })

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/login'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
            }),
          })
        )

        expect(result.user).toEqual(mockResponse.data.user)
        expect(result.tokens).toEqual(mockResponse.data.tokens)
      })

      it('应该处理登录失败的情况', async () => {
        const mockErrorResponse = {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '用户名或密码错误',
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => mockErrorResponse,
        } as Response)

        await expect(
          AuthService.login({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
        ).rejects.toThrow('用户名或密码错误')
      })
    })

    describe('注册API', () => {
      it('应该成功注册新用户', async () => {
        const mockResponse = {
          success: true,
          data: {
            user: {
              id: '1',
              name: 'New User',
              email: 'newuser@example.com',
            },
            tokens: {
              accessToken: 'access-token',
              refreshToken: 'refresh-token',
            },
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
        } as Response)

        const result = await AuthService.register({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/register'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'New User',
              email: 'newuser@example.com',
              password: 'password123',
              confirmPassword: 'password123',
            }),
          })
        )

        expect(result.user).toEqual(mockResponse.data.user)
        expect(result.tokens).toEqual(mockResponse.data.tokens)
      })

      it('应该处理邮箱已存在的情况', async () => {
        const mockErrorResponse = {
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: '该邮箱已被注册',
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: async () => mockErrorResponse,
        } as Response)

        await expect(
          AuthService.register({
            name: 'Test User',
            email: 'existing@example.com',
            password: 'password123',
            confirmPassword: 'password123',
          })
        ).rejects.toThrow('该邮箱已被注册')
      })
    })

    describe('Token刷新API', () => {
      it('应该成功刷新token', async () => {
        const mockResponse = {
          success: true,
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        }

        // Mock TokenManager
        jest
          .spyOn(TokenManager, 'getRefreshToken')
          .mockReturnValue('old-refresh-token')
        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response)

        const result = await AuthService.refreshToken()

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/refresh'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: 'old-refresh-token',
            }),
          })
        )

        expect(result).toEqual(mockResponse.data)
      })

      it('应该处理无效refresh token的情况', async () => {
        jest
          .spyOn(TokenManager, 'getRefreshToken')
          .mockReturnValue('invalid-token')
        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({
            success: false,
            error: {
              code: 'INVALID_REFRESH_TOKEN',
              message: 'Refresh token已过期',
            },
          }),
        } as Response)

        await expect(AuthService.refreshToken()).rejects.toThrow(
          'Refresh token已过期'
        )
      })
    })

    describe('获取用户信息API', () => {
      it('应该成功获取当前用户信息', async () => {
        const mockResponse = {
          success: true,
          data: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://example.com/avatar.jpg',
          },
        }

        jest
          .spyOn(TokenManager, 'getAccessToken')
          .mockReturnValue('valid-access-token')
        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response)

        const result = await AuthService.getCurrentUser()

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/me'),
          expect.objectContaining({
            method: 'GET',
            headers: {
              Authorization: 'Bearer valid-access-token',
              'Content-Type': 'application/json',
            },
          })
        )

        expect(result).toEqual(mockResponse.data)
      })

      it('应该处理未认证的情况', async () => {
        jest
          .spyOn(TokenManager, 'getAccessToken')
          .mockReturnValue('invalid-token')
        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: '未授权访问',
            },
          }),
        } as Response)

        await expect(AuthService.getCurrentUser()).rejects.toThrow('未授权访问')
      })
    })
  })

  describe('Resources API', () => {
    describe('获取资源列表', () => {
      it('应该成功获取资源列表', async () => {
        const mockResponse = {
          success: true,
          data: {
            resources: [
              {
                id: '1',
                title: 'React官方文档',
                slug: 'react-docs',
                description: 'React官方文档',
                category: 'Frontend',
                tags: ['React', 'JavaScript'],
                author: 'React Team',
                rating: 4.8,
                viewCount: 1000,
                featured: true,
              },
            ],
            pagination: {
              currentPage: 1,
              totalPages: 10,
              totalItems: 95,
            },
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response)

        // 这里需要导入实际的resources service
        // const result = await ResourcesService.getResources({ page: 1, limit: 10 })

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/resources'),
          expect.objectContaining({
            method: 'GET',
          })
        )
      })
    })

    describe('获取资源详情', () => {
      it('应该成功获取单个资源详情', async () => {
        const mockResponse = {
          success: true,
          data: {
            id: '1',
            title: 'React官方文档',
            slug: 'react-docs',
            description: 'React官方文档详细描述',
            content: '# React官方文档\n\n详细内容...',
            category: 'Frontend',
            tags: ['React', 'JavaScript'],
            author: 'React Team',
            rating: 4.8,
            viewCount: 1000,
            featured: true,
          },
        }

        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response)

        // const result = await ResourcesService.getResource('react-docs')

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/resources/react-docs'),
          expect.objectContaining({
            method: 'GET',
          })
        )
      })

      it('应该处理资源不存在的情况', async () => {
        ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            success: false,
            error: {
              code: 'RESOURCE_NOT_FOUND',
              message: '资源不存在',
            },
          }),
        } as Response)

        // await expect(ResourcesService.getResource('nonexistent')).rejects.toThrow('资源不存在')
      })
    })
  })

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('Network error')
    })

    it('应该处理服务器内部错误', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: '服务器内部错误',
          },
        }),
      } as Response)

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('服务器内部错误')
    })

    it('应该处理超时错误', async () => {
      jest.setTimeout(10000)
      ;(fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 5000)
          })
      )

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('Request timeout')
    })
  })

  describe('请求拦截器', () => {
    it('应该在请求中包含正确的headers', async () => {
      jest.spyOn(TokenManager, 'getAccessToken').mockReturnValue('test-token')
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      } as Response)

      await AuthService.getCurrentUser()

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('应该在POST请求中包含CSRF token', async () => {
      // Mock CSRF token
      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockReturnValue({
          getAttribute: jest.fn().mockReturnValue('csrf-token'),
        }),
        writable: true,
      })
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      } as Response)

      await AuthService.login({
        email: 'test@example.com',
        password: 'password',
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-CSRF-Token': 'csrf-token',
          }),
        })
      )
    })
  })

  describe('响应拦截器', () => {
    it('应该自动处理401错误并尝试刷新token', async () => {
      // 第一次请求返回401
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({
            success: false,
            error: { code: 'UNAUTHORIZED', message: '未授权' },
          }),
        } as Response)
        // token刷新请求成功
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token',
            },
          }),
        } as Response)
        // 重试原始请求成功
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { id: '1', name: 'Test User' },
          }),
        } as Response)

      jest
        .spyOn(TokenManager, 'getAccessToken')
        .mockReturnValue('expired-token')
      jest
        .spyOn(TokenManager, 'getRefreshToken')
        .mockReturnValue('valid-refresh-token')
      jest.spyOn(TokenManager, 'setTokens').mockImplementation(() => {})

      const result = await AuthService.getCurrentUser()

      expect(fetch).toHaveBeenCalledTimes(3) // 原始请求 + 刷新token + 重试请求
      expect(TokenManager.setTokens).toHaveBeenCalledWith({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      })
      expect(result).toEqual({ id: '1', name: 'Test User' })
    })
  })
})
