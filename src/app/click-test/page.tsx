'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BaseCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ClickTestPage() {
  const router = useRouter()
  const [clickLog, setClickLog] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setClickLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
  }

  const handleCardClick = (cardName: string) => {
    addLog(`${cardName} 卡片被点击`)
    // 模拟导航
    setTimeout(() => {
      addLog(`导航到 ${cardName} 详情页`)
    }, 100)
  }

  const handleButtonClick = (e: React.MouseEvent, buttonName: string) => {
    e.stopPropagation() // 防止触发卡片点击
    addLog(`${buttonName} 按钮被点击`)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">点击交互测试页面</h1>
        <p className="text-gray-600">
          测试导航栏菜单和卡片的点击交互是否正常工作
        </p>
      </div>

      {/* 导航测试 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">导航栏测试</h2>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="space-x-4">
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => addLog('首页链接被点击')}
            >
              首页
            </Link>
            <Link
              href="/resources"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => addLog('资源页链接被点击')}
            >
              资源
            </Link>
            <Link
              href="/posts"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => addLog('文章页链接被点击')}
            >
              文章
            </Link>
            <Link
              href="/vibes"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => addLog('Vibe页链接被点击')}
            >
              Vibe
            </Link>
          </div>
        </div>
      </section>

      {/* 卡片测试 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">卡片交互测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 测试卡片1 */}
          <BaseCard
            variant="hover"
            className="cursor-pointer prevent-click-block"
            onClick={() => handleCardClick('React教程')}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded">
                  前端开发
                </span>
                <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  精选
                </div>
              </div>

              <h3 className="font-semibold text-gray-900">React完整学习指南</h3>

              <p className="text-sm text-gray-600">
                从基础入门到高级应用，全面学习React框架的各个知识点和最佳实践。
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">张三</span>
                <Button
                  size="sm"
                  onClick={e => handleButtonClick(e, '查看详情')}
                  data-no-click
                >
                  查看详情
                </Button>
              </div>
            </div>
          </BaseCard>

          {/* 测试卡片2 */}
          <BaseCard
            variant="hover"
            className="cursor-pointer prevent-click-block"
            onClick={() => handleCardClick('Vue指南')}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                  前端框架
                </span>
              </div>

              <h3 className="font-semibold text-gray-900">
                Vue.js 3.0 实战指南
              </h3>

              <p className="text-sm text-gray-600">
                掌握Vue.js 3.0的核心特性，包括Composition API、响应式系统等。
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">李四</span>
                <button
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  onClick={e => handleButtonClick(e, 'Vue详情')}
                  data-no-click
                >
                  查看详情
                </button>
              </div>
            </div>
          </BaseCard>

          {/* 测试卡片3 */}
          <BaseCard
            variant="hover"
            className="cursor-pointer prevent-click-block"
            onClick={() => handleCardClick('TypeScript')}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-medium rounded">
                  编程语言
                </span>
              </div>

              <h3 className="font-semibold text-gray-900">
                TypeScript 从入门到精通
              </h3>

              <p className="text-sm text-gray-600">
                学习TypeScript的类型系统、高级类型、装饰器等特性。
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">王五</span>
                <a
                  href="#"
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  onClick={e => {
                    e.preventDefault()
                    handleButtonClick(e, 'TypeScript详情')
                  }}
                  data-no-click
                >
                  查看详情
                </a>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      {/* 点击日志 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">点击事件日志</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {clickLog.length === 0 ? (
            <div className="text-gray-500">等待点击事件...</div>
          ) : (
            clickLog.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          点击上面的链接、卡片或按钮来测试交互功能
        </div>

        <Button
          onClick={() => setClickLog([])}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          清空日志
        </Button>
      </section>
    </div>
  )
}
