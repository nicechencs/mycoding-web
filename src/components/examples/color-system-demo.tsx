'use client'

import React from 'react'
import { colors, colorClasses, semanticColors } from '@/lib/design'
import { Button } from '@/components/ui/button'
import { getCategoryClasses, getCategoryIcon } from '@/lib/utils/category'

/**
 * 配色系统演示组件
 * 用于展示统一配色系统的效果
 */
export const ColorSystemDemo = () => {
  const categories = ['前端开发', '后端开发', '移动开发', 'AI & 机器学习', '数据库', '云计算']
  
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          MyCoding 统一配色系统演示
        </h1>

        {/* 主要按钮演示 */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮系统</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="outline">边框按钮</Button>
            <Button variant="ghost">透明按钮</Button>
            <Button variant="destructive">危险按钮</Button>
          </div>
        </section>

        {/* 分类标签演示 */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">统一分类标签（蓝色系）</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getCategoryClasses(category)}`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category}
              </span>
            ))}
          </div>
        </section>

        {/* 交互状态演示 */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">交互状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 悬停效果卡片 */}
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                悬停效果卡片
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                鼠标悬停查看蓝色系交互效果
              </p>
            </div>
            
            {/* 链接样式 */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">链接样式</h3>
              <div className="space-y-2">
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                  主要链接
                </a>
                <br />
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  普通链接
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 状态反馈 */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">状态反馈</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">
              ✅ 成功状态 - 操作完成
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
              ⚠️ 警告状态 - 需要注意
            </div>
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              ❌ 错误状态 - 操作失败
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
              ℹ️ 信息状态 - 提示内容
            </div>
          </div>
        </section>

        {/* 配色值展示 */}
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">配色值参考</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 主色调 */}
            <div>
              <h3 className="font-medium mb-2">主品牌色</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-sm">blue-600 #2563eb</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-50 rounded border"></div>
                  <span className="text-sm">blue-50 #eff6ff</span>
                </div>
              </div>
            </div>
            
            {/* 中性色 */}
            <div>
              <h3 className="font-medium mb-2">中性色</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-900 rounded"></div>
                  <span className="text-sm">gray-900 #111827</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-sm">gray-600 #4b5563</span>
                </div>
              </div>
            </div>
            
            {/* 状态色 */}
            <div>
              <h3 className="font-medium mb-2">状态色</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">成功 #10b981</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">错误 #ef4444</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ColorSystemDemo