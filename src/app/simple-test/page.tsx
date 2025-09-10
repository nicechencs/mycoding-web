'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SimpleTestPage() {
  const router = useRouter()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">简单导航测试</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold mb-2">使用 Link 组件:</h2>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 hover:underline">
              首页
            </Link>
            <Link href="/resources" className="text-blue-600 hover:underline">
              资源
            </Link>
            <Link href="/posts" className="text-blue-600 hover:underline">
              文章
            </Link>
            <Link href="/vibes" className="text-blue-600 hover:underline">
              Vibe
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">使用 router.push:</h2>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              首页
            </button>
            <button
              onClick={() => router.push('/resources')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              资源
            </button>
            <button
              onClick={() => router.push('/posts')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              文章
            </button>
            <button
              onClick={() => router.push('/vibes')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Vibe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
