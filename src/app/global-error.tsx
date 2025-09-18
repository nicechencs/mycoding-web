'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              应用遇到严重错误
            </h1>
            <p className="text-gray-600 mb-8">
              {error.message || '应用遇到了无法恢复的错误，请刷新页面或联系管理员'}
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}