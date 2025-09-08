import {
  LoginCredentials,
  RegisterData,
  AuthUser,
  AuthToken,
  ForgotPasswordData,
  AuthError,
} from './auth-types'
import { TokenManager } from './token-manager'

// Re-export AuthError for convenience
export { AuthError } from './auth-types'

// Mock user database (模拟用户数据库)
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: '1',
    name: '管理员',
    email: 'admin@mycoding.com',
    password: 'admin123', // 实际项目中应该是哈希值
    role: 'admin',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: '测试用户',
    email: 'user@test.com',
    password: 'test123',
    role: 'user',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// JWT Token 生成器（简化版）
function generateTokens(user: AuthUser): AuthToken {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24小时后过期
  }

  // 在实际项目中应该使用真正的JWT库
  const accessToken = `mock.${btoa(JSON.stringify(payload))}.signature`
  const refreshToken = `refresh.${btoa(JSON.stringify({ ...payload, type: 'refresh' }))}.signature`

  return {
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60, // 24小时（秒）
  }
}

// 解析Token（简化版）
function parseToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[0].startsWith('mock')) {
      throw new Error('Invalid token format')
    }
    return JSON.parse(atob(parts[1]))
  } catch {
    return null
  }
}

export class AuthService {
  // 登录
  static async login(
    credentials: LoginCredentials
  ): Promise<{ user: AuthUser; tokens: AuthToken }> {
    await delay(800) // 模拟网络延迟

    const user = MOCK_USERS.find(
      u =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    )

    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS', '邮箱或密码错误')
    }

    const { password, ...userWithoutPassword } = user
    const tokens = generateTokens(userWithoutPassword)

    return {
      user: userWithoutPassword,
      tokens,
    }
  }

  // 注册
  static async register(
    data: RegisterData
  ): Promise<{ user: AuthUser; tokens: AuthToken }> {
    await delay(1000) // 模拟网络延迟

    // 验证密码确认
    if (data.password !== data.confirmPassword) {
      throw new AuthError('PASSWORD_MISMATCH', '密码和确认密码不匹配')
    }

    // 检查邮箱是否已存在
    const existingUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    )

    if (existingUser) {
      throw new AuthError('EMAIL_EXISTS', '该邮箱已被注册')
    }

    // 创建新用户
    const newUser: AuthUser & { password: string } = {
      id: (MOCK_USERS.length + 1).toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // 添加到模拟数据库
    MOCK_USERS.push(newUser)

    const { password, ...userWithoutPassword } = newUser
    const tokens = generateTokens(userWithoutPassword)

    return {
      user: userWithoutPassword,
      tokens,
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<AuthUser> {
    await delay(500)

    const token = TokenManager.getAccessToken()
    if (!token) {
      throw new AuthError('NO_TOKEN', '未找到访问令牌')
    }

    const payload = parseToken(token)
    if (!payload) {
      throw new AuthError('INVALID_TOKEN', '无效的访问令牌')
    }

    const user = MOCK_USERS.find(u => u.id === payload.userId)
    if (!user) {
      throw new AuthError('USER_NOT_FOUND', '用户不存在')
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // 刷新Token
  static async refreshToken(): Promise<AuthToken> {
    await delay(300)

    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new AuthError('NO_REFRESH_TOKEN', '未找到刷新令牌')
    }

    const payload = parseToken(refreshToken)
    if (!payload || payload.type !== 'refresh') {
      throw new AuthError('INVALID_REFRESH_TOKEN', '无效的刷新令牌')
    }

    const user = MOCK_USERS.find(u => u.id === payload.userId)
    if (!user) {
      throw new AuthError('USER_NOT_FOUND', '用户不存在')
    }

    const { password, ...userWithoutPassword } = user
    return generateTokens(userWithoutPassword)
  }

  // 注销
  static async logout(): Promise<void> {
    await delay(200)
    TokenManager.clearTokens()
  }

  // 忘记密码
  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await delay(800)

    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    )

    if (!user) {
      throw new AuthError('USER_NOT_FOUND', '该邮箱未注册')
    }

    // 在实际项目中，这里会发送重置密码邮件
    console.log(`重置密码邮件已发送至: ${data.email}`)
  }

  // 验证Token有效性
  static async validateToken(token: string): Promise<boolean> {
    try {
      const payload = parseToken(token)
      if (!payload) return false

      // 检查是否过期
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) return false

      // 检查用户是否存在
      const user = MOCK_USERS.find(u => u.id === payload.userId)
      return !!user
    } catch {
      return false
    }
  }
}
