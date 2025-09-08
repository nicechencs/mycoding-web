'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthService } from '@/lib/auth/auth-service'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value })
    setEmailError(null)
    setError(null)
  }

  const validateForm = (): boolean => {
    if (!formData.email) {
      setEmailError('请输入邮箱地址')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('邮箱格式不正确')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await AuthService.forgotPassword(formData)
      setIsSuccess(true)
    } catch (error: any) {
      setError(error.message || '发送重置邮件失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">重置邮件已发送</h2>
          <p className="mt-2 text-gray-600">
            我们已向 <strong className="text-gray-900">{formData.email}</strong>{' '}
            发送了密码重置链接
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            请检查您的邮箱（包括垃圾邮件文件夹），点击邮件中的链接重置密码。
            如果几分钟内未收到邮件，请重新尝试。
          </p>
        </div>

        <div className="text-center space-y-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsSuccess(false)
              setFormData({ email: '' })
            }}
            className="w-full"
          >
            重新发送
          </Button>

          <Link
            href="/login"
            className="block text-sm text-blue-600 hover:text-blue-500"
          >
            返回登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">重置密码</h2>
        <p className="mt-2 text-gray-600">
          输入您的邮箱地址，我们将发送重置密码的链接
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="邮箱地址"
          placeholder="请输入您的邮箱"
          value={formData.email}
          onChange={handleInputChange}
          error={emailError || undefined}
          disabled={isSubmitting}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '发送中...' : '发送重置链接'}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            返回登录
          </Link>
        </div>
      </form>
    </div>
  )
}
