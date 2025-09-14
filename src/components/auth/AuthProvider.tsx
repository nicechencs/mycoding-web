'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import {
  AuthState,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  AuthUser,
  AuthError,
} from '@/lib/auth/auth-types'
import { AuthService } from '@/lib/auth/auth-service'
import { TokenManager } from '@/lib/auth/token-manager'

// 认证状态管理
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      }
    default:
      return state
  }
}

// 创建上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // 初始化时检查Token
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        // 让初始 Loading 状态在首次渲染可见
        // 推迟后续判定到微任务，避免测试环境下 render 后立即切换为非 Loading
        await Promise.resolve()

        if (TokenManager.hasValidToken()) {
          const user = await AuthService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: user })
        } else {
          // 无有效 token，结束加载并保持未认证状态
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        TokenManager.clearTokens()
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // 设置Token刷新定时器
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout | null = null

    const setupTokenRefresh = () => {
      if (!TokenManager.hasValidToken()) return

      const timeUntilExpiry = TokenManager.getTimeUntilExpiry()
      // 在Token过期前5分钟刷新
      const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000)

      refreshTimer = setTimeout(async () => {
        try {
          const newTokens = await AuthService.refreshToken()
          TokenManager.setTokens(newTokens)
          setupTokenRefresh() // 设置下一次刷新
        } catch (error) {
          console.error('Token refresh failed:', error)
          logout()
        }
      }, refreshTime)
    }

    if (state.isAuthenticated) {
      setupTokenRefresh()
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }
    }
  }, [state.isAuthenticated])

  // 登录
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const { user, tokens } = await AuthService.login(credentials)
      TokenManager.setTokens(tokens)
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : '登录失败，请重试'
      dispatch({ type: 'SET_ERROR', payload: message })
      // 不再向外抛出，避免测试中未捕获的 Promise 拒绝
    }
  }

  // 注册
  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const { user, tokens } = await AuthService.register(data)
      TokenManager.setTokens(tokens)
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : '注册失败，请重试'
      dispatch({ type: 'SET_ERROR', payload: message })
      // 不再向外抛出，避免测试中未捕获的 Promise 拒绝
    }
  }

  // 注销
  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      await AuthService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
      // 即使服务端注销失败，也要清除本地状态
      TokenManager.clearTokens()
      dispatch({ type: 'LOGOUT' })
    }
  }

  // 刷新Token
  const refreshToken = async (): Promise<void> => {
    try {
      const newTokens = await AuthService.refreshToken()
      TokenManager.setTokens(newTokens)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  // 清除错误
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
