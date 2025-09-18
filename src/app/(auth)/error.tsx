'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          认证服务遇到问题
        </h1>
        <p className="text-gray-600 mb-8">
          {error.message || '登录系统遇到了意外错误，请稍后重试'}
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            重试
          </button>
          <a
            href="/"
            className="block text-blue-600 hover:text-blue-800 text-sm"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}