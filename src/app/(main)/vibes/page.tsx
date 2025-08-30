'use client'

import { useState } from 'react'
import { getLatestVibes } from '@/lib/mock/vibes'
import { VibeCard } from '@/components/features/vibes/vibe-card'
import { VibeComposer } from '@/components/features/vibes/vibe-composer'

export default function VibesPage() {
  const [vibes, setVibes] = useState(getLatestVibes())
  const [showComposer, setShowComposer] = useState(false)

  const handleNewVibe = (content: string, tags: string[]) => {
    const newVibe = {
      id: Date.now().toString(),
      content,
      author: {
        id: '1',
        name: '当前用户',
        email: 'user@example.com',
        avatar: '/avatars/current-user.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tags,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      isLiked: false,
    }
    
    setVibes([newVibe, ...vibes])
    setShowComposer(false)
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Vibe 动态</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          分享你的编程想法、学习心得，记录编程生活的精彩瞬间
        </p>
      </div>

      {/* Composer Toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              我
            </div>
            <div className="flex-1">
              <p className="text-gray-500">分享你的编程动态...</p>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </button>
      </div>

      {/* Vibe Composer */}
      {showComposer && (
        <div className="mb-8">
          <VibeComposer 
            onSubmit={handleNewVibe}
            onCancel={() => setShowComposer(false)}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              今天有什么新的编程收获？
            </h2>
            <p className="text-gray-600 text-sm">
              分享代码片段、学习笔记、项目进展或技术思考
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">💡 想法</span>
            <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">📚 学习</span>
            <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">🚀 项目</span>
            <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">🐛 调试</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button className="flex-1 py-2 px-4 rounded-md bg-white text-gray-900 font-medium shadow-sm">
          最新动态
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition-colors">
          热门动态
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition-colors">
          我关注的
        </button>
      </div>

      {/* Vibes Feed */}
      <div className="space-y-6">
        {vibes.length > 0 ? (
          vibes.map((vibe) => (
            <VibeCard key={vibe.id} vibe={vibe} />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有动态</h3>
            <p className="text-gray-600 mb-6">
              成为第一个分享编程动态的人
            </p>
            <button 
              onClick={() => setShowComposer(true)}
              className="btn-primary"
            >
              发布第一条Vibe
            </button>
          </div>
        )}
      </div>

      {/* Load More */}
      {vibes.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn-secondary px-8 py-3">
            加载更多动态
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowComposer(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl z-50"
        title="发布动态"
      >
        ✨
      </button>
    </div>
  )
}