'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TestRouter from './test-router'

export default function TestNavigationPage() {
  const router = useRouter()
  const [clickLog, setClickLog] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setClickLog(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ])
  }

  // 测试直接的router.push
  const handleDirectNavigation = () => {
    addLog('Direct router.push to /resources')
    router.push('/resources')
  }

  // 测试带事件的点击
  const handleClickWithEvent = (e: React.MouseEvent) => {
    addLog(`Click event received, target: ${(e.target as HTMLElement).tagName}`)
    router.push('/posts')
  }

  // 测试阻止默认行为
  const handlePreventDefault = (e: React.MouseEvent) => {
    e.preventDefault()
    addLog('preventDefault called - navigation should be blocked')
    router.push('/vibes')
  }

  // 测试模拟卡片点击
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    addLog(
      `Card clicked, target: ${target.tagName}, class: ${target.className}`
    )

    // 检查是否点击了按钮或链接
    if (target.closest('button') || target.closest('a')) {
      addLog('Click on button/link detected - stopping card navigation')
      return
    }

    addLog('Navigating from card click...')
    router.push('/resources')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">导航测试页面</h1>

      {/* 测试基础Link组件 */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">1. Next.js Link 组件测试</h2>
        <div className="space-x-4">
          <Link
            href="/resources"
            className="text-blue-600 hover:underline"
            onClick={() => addLog('Link clicked - /resources')}
          >
            Link to Resources
          </Link>
          <Link href="/posts" className="text-blue-600 hover:underline">
            Link to Posts (no onClick)
          </Link>
        </div>
      </section>

      {/* 测试router.push */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">2. Router.push 测试</h2>
        <div className="space-x-4">
          <button
            onClick={handleDirectNavigation}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Direct router.push
          </button>
          <button
            onClick={handleClickWithEvent}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            router.push with event
          </button>
          <button
            onClick={handlePreventDefault}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            router.push with preventDefault
          </button>
        </div>
      </section>

      {/* 测试卡片点击 */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">3. 模拟卡片点击测试</h2>
        <div
          className="p-6 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
          onClick={handleCardClick}
        >
          <h3 className="font-semibold mb-2">测试卡片（点击整个区域）</h3>
          <p className="mb-4">点击卡片任意位置应该跳转</p>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={e => {
              e.stopPropagation()
              addLog('Card button clicked - stopPropagation called')
              router.push('/vibes')
            }}
          >
            卡片内按钮
          </button>
        </div>
      </section>

      {/* 测试ResourceCard的实际实现 */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">4. 模拟ResourceCard实现</h2>
        <TestResourceCard />
      </section>

      {/* Router 诊断 */}
      <section className="mb-8">
        <TestRouter />
      </section>

      {/* 点击日志 */}
      <section className="p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">点击日志</h2>
        <div className="space-y-1">
          {clickLog.length === 0 ? (
            <p className="text-gray-500">还没有点击事件...</p>
          ) : (
            clickLog.map((log, index) => (
              <div key={index} className="text-sm font-mono">
                {log}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setClickLog([])}
          className="mt-4 px-3 py-1 bg-gray-600 text-white rounded text-sm"
        >
          清除日志
        </button>
      </section>
    </div>
  )
}

// 模拟ResourceCard组件
function TestResourceCard() {
  const router = useRouter()

  const handleCardClick = (e?: React.MouseEvent) => {
    console.log('TestResourceCard clicked', e)
    router.push('/resources/test-resource')
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Action button clicked')
    router.push('/resources/test-resource')
  }

  return (
    <div
      className="p-6 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <h3 className="font-semibold mb-2">测试资源卡片</h3>
      <p className="text-gray-600 mb-4">这是一个模拟的ResourceCard</p>
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded"
        onClick={handleActionClick}
      >
        查看详情
      </button>
    </div>
  )
}
