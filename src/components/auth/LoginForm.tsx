'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { AuthError } from '@/lib/auth/auth-service'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})

  const { login, error, clearError } = useAuth()
  const router = useRouter()

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }))

      // 清除字段错误
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined,
        }))
      }

      // 清除全局错误
      if (error) {
        clearError()
      }
    }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData)
      router.push('/settings')
    } catch (error) {
      // 错误已在AuthProvider中处理
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password })
    setIsSubmitting(true)

    try {
      await login({ email, password })
      router.push('/settings')
    } catch (error) {
      console.error('Demo login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">登录账户</h2>
        <p className="mt-2 text-gray-600">欢迎回来！请输入您的登录信息</p>
      </div>

      {/* 演示账户 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-800">演示账户:</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin@mycoding.com', 'admin123')}
            disabled={isSubmitting}
            className="text-xs"
          >
            管理员 (admin@mycoding.com)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('user@test.com', 'test123')}
            disabled={isSubmitting}
            className="text-xs"
          >
            用户 (user@test.com)
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="邮箱地址"
          placeholder="请输入您的邮箱"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          type="password"
          label="密码"
          placeholder="请输入您的密码"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          disabled={isSubmitting}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '登录中...' : '登录'}
        </Button>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            忘记密码？
          </Link>
        </div>

        <div className="text-center">
          <span className="text-gray-600">还没有账户？</span>
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium ml-1"
          >
            立即注册
          </Link>
        </div>
      </form>
    </div>
  )
}
