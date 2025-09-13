'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { RegisterData } from '@/lib/auth/auth-types'

interface RegisterFormData extends RegisterData {}

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [acceptTerms, setAcceptTerms] = useState(false)

  const { register, error, clearError } = useAuth()
  const router = useRouter()

  const handleInputChange =
    (field: keyof RegisterFormData) =>
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
    const newErrors: Partial<RegisterFormData> = {}

    // 姓名验证
    if (!formData.name) {
      newErrors.name = '请输入姓名'
    } else if (formData.name.length < 2) {
      newErrors.name = '姓名长度至少2位'
    } else if (formData.name.length > 50) {
      newErrors.name = '姓名长度不能超过50位'
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位'
    } else if (formData.password.length > 128) {
      newErrors.password = '密码长度不能超过128位'
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = '密码必须包含字母和数字'
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '密码和确认密码不匹配'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!acceptTerms) {
      alert('请先同意服务条款和隐私政策')
      return
    }

    setIsSubmitting(true)

    try {
      await register(formData)
      router.push('/settings')
    } catch (error) {
      // 错误已在AuthProvider中处理
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">创建账户</h2>
        <p className="mt-2 text-gray-600">加入MyCoding，开启您的编程之旅</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="姓名"
          placeholder="请输入您的姓名"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          disabled={isSubmitting}
        />

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
          placeholder="请输入密码（至少6位，包含字母和数字）"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          disabled={isSubmitting}
          helperText={
            !errors.password ? '密码应包含字母和数字，长度6-128位' : undefined
          }
        />

        <Input
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="accept-terms"
            checked={acceptTerms}
            onChange={e => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="accept-terms" className="text-sm text-gray-600">
            我已阅读并同意
            <Link href="#" className="text-blue-600 hover:text-blue-500 mx-1">
              服务条款
            </Link>
            和
            <Link href="#" className="text-blue-600 hover:text-blue-500 mx-1">
              隐私政策
            </Link>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !acceptTerms}
        >
          {isSubmitting ? '注册中...' : '创建账户'}
        </Button>

        <div className="text-center">
          <span className="text-gray-600">已有账户？</span>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-medium ml-1"
          >
            立即登录
          </Link>
        </div>
      </form>
    </div>
  )
}
