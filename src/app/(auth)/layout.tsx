'use client'

import Link from 'next/link'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
        {/* 左侧蓝色欢迎区域 */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600">
            {/* 装饰性图案 */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* 内容 */}
            <div className="relative h-full flex flex-col justify-center px-12 text-white text-right">
              <div className="max-w-md ml-auto">
                <h2 className="text-4xl font-bold mb-6">欢迎来到 MyCoding</h2>
                <p className="text-xl text-blue-50 mb-8">
                  您的编程学习和资源分享平台，与开发者社区一起成长
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-end space-x-3">
                    <span className="text-blue-50">丰富的编程资源和文章</span>
                    <div className="flex-shrink-0 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <span className="text-blue-50">活跃的开发者社区</span>
                    <div className="flex-shrink-0 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <span className="text-blue-50">个人学习进度跟踪</span>
                    <div className="flex-shrink-0 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部装饰 */}
              <div className="absolute bottom-8 left-12 right-12 text-right">
                <div className="border-t border-white/15 pt-6">
                  <p className="text-sm text-blue-100">
                    &ldquo;代码改变世界，学习成就未来&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧表单操作区域 */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-2">
                <span className="text-3xl">💻</span>
                <span className="text-2xl font-bold text-blue-600">
                  MyCoding
                </span>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
