'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function NavigationTest() {
  const router = useRouter()
  const pathname = usePathname()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ])
  }

  const testRoutes = [
    { name: '首页', href: '/' },
    { name: '资源', href: '/resources' },
    { name: '文章', href: '/posts' },
    { name: 'Vibe', href: '/vibes' },
    { name: '登录', href: '/login' },
    { name: '注册', href: '/register' },
  ]

  const testLinkClick = (route: { name: string; href: string }) => {
    addResult(`Link点击测试 - ${route.name} (${route.href})`)
    try {
      // Link组件会自动处理导航
    } catch (error) {
      addResult(`Link点击失败: ${error}`)
    }
  }

  const testRouterPush = (route: { name: string; href: string }) => {
    addResult(`Router.push测试 - ${route.name} (${route.href})`)
    try {
      router.push(route.href)
      addResult(`Router.push调用成功`)
    } catch (error) {
      addResult(`Router.push失败: ${error}`)
    }
  }

  const testRouterReplace = (route: { name: string; href: string }) => {
    addResult(`Router.replace测试 - ${route.name} (${route.href})`)
    try {
      router.replace(route.href)
      addResult(`Router.replace调用成功`)
    } catch (error) {
      addResult(`Router.replace失败: ${error}`)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🧪 导航功能测试页面
        </h1>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">当前状态</h2>
          <p>
            <strong>当前路径:</strong>{' '}
            <code className="bg-blue-200 px-2 py-1 rounded">{pathname}</code>
          </p>
          <p>
            <strong>服务器:</strong>{' '}
            <code className="bg-blue-200 px-2 py-1 rounded">
              http://localhost:3003
            </code>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Link 组件测试 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📎 Link 组件测试
            </h2>
            <p className="text-sm text-gray-600">
              使用Next.js Link组件进行导航
            </p>
            <div className="space-y-2">
              {testRoutes.map(route => (
                <Link
                  key={`link-${route.href}`}
                  href={route.href}
                  onClick={() => testLinkClick(route)}
                  className="block w-full p-3 text-left bg-green-100 hover:bg-green-200 rounded border transition-colors"
                >
                  🔗 Link: {route.name} ({route.href})
                </Link>
              ))}
            </div>
          </div>

          {/* Router.push 测试 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              🎯 Router.push 测试
            </h2>
            <p className="text-sm text-gray-600">
              使用useRouter().push()进行导航
            </p>
            <div className="space-y-2">
              {testRoutes.map(route => (
                <button
                  key={`push-${route.href}`}
                  onClick={() => testRouterPush(route)}
                  className="block w-full p-3 text-left bg-blue-100 hover:bg-blue-200 rounded border transition-colors"
                >
                  ➡️ Push: {route.name} ({route.href})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Router.replace 测试 */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🔄 Router.replace 测试
          </h2>
          <p className="text-sm text-gray-600">
            使用useRouter().replace()进行导航（替换历史记录）
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {testRoutes.map(route => (
              <button
                key={`replace-${route.href}`}
                onClick={() => testRouterReplace(route)}
                className="p-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded border transition-colors"
              >
                🔄 {route.name}
              </button>
            ))}
          </div>
        </div>

        {/* 测试结果日志 */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">📝 测试日志</h2>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              清空日志
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 italic">
                暂无测试结果，请点击上方按钮进行测试
              </p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 调试信息 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🔍 调试信息</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 如果Link点击或Router.push()无法跳转，说明客户端路由有问题</p>
            <p>• 检查浏览器控制台是否有JavaScript错误</p>
            <p>• 测试完成后可以检查网络面板的请求情况</p>
            <p>• 确认URL是否正确更新</p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏠 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
