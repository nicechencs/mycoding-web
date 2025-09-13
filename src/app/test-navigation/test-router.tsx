'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // 检查 router 对象
    const results = []
    results.push(`当前路径: ${pathname}`)
    results.push(`router 类型: ${typeof router}`)
    results.push(`router.push 类型: ${typeof router?.push}`)
    results.push(`router 对象包含: ${Object.keys(router || {}).join(', ')}`)

    // 检查 window.location
    if (typeof window !== 'undefined') {
      results.push(`window.location.pathname: ${window.location.pathname}`)
    }

    setTestResults(results)
  }, [router, pathname])

  // 测试不同的导航方法
  const testMethods = {
    'router.push': () => {
      console.log('执行 router.push')
      router.push('/resources')
    },
    'router.replace': () => {
      console.log('执行 router.replace')
      router.replace('/resources')
    },
    'window.location.href': () => {
      console.log('执行 window.location.href')
      window.location.href = '/resources'
    },
    'window.location.assign': () => {
      console.log('执行 window.location.assign')
      window.location.assign('/resources')
    },
  }

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-4">Router 诊断信息</h3>
      <div className="space-y-1 mb-4">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono">
            {result}
          </div>
        ))}
      </div>

      <h3 className="font-bold mb-4">导航方法测试</h3>
      <div className="space-x-2">
        {Object.entries(testMethods).map(([name, handler]) => (
          <button
            key={name}
            onClick={handler}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm mb-2"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
