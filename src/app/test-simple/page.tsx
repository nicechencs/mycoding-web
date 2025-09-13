'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SimpleTest() {
  const router = useRouter()

  // 尝试直接在渲染时调用，看是否有问题
  const handleClick = () => {
    console.log('开始导航...')
    console.log('router:', router)
    console.log('router.push:', router.push)

    try {
      // 测试不同的调用方式
      const result = router.push('/resources')
      console.log('router.push 返回值:', result)
    } catch (error) {
      console.error('router.push 错误:', error)
    }
  }

  // 使用 setTimeout 延迟调用
  const handleDelayedClick = () => {
    console.log('延迟导航...')
    setTimeout(() => {
      console.log('执行延迟导航')
      router.push('/resources')
    }, 100)
  }

  // 使用 Promise
  const handleAsyncClick = async () => {
    console.log('异步导航...')
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('执行异步导航')
    router.push('/resources')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">简单导航测试</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold mb-2">1. Link 组件（应该正常）</h2>
          <Link href="/resources" className="text-blue-600 hover:underline">
            使用 Link 跳转到 /resources
          </Link>
        </div>

        <div>
          <h2 className="font-semibold mb-2">2. router.push 直接调用</h2>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            router.push('/resources')
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">3. 延迟调用 router.push</h2>
          <button
            onClick={handleDelayedClick}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            setTimeout 后调用
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">4. 异步调用 router.push</h2>
          <button
            onClick={handleAsyncClick}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            async/await 后调用
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">5. 内联调用</h2>
          <button
            onClick={() => {
              console.log('内联调用 router.push')
              router.push('/resources')
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
          >
            内联 router.push
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          请打开浏览器控制台查看日志输出。
        </p>
      </div>
    </div>
  )
}
