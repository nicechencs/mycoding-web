'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          出现了一些问题
        </h1>
        <p className="text-gray-600 mb-8">
          {error.message || '应用遇到了意外错误'}
        </p>
        <button
          onClick={reset}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  )
}
