'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getLatestVibes } from '@/lib/mock/vibes'
import { Avatar } from '@/components/ui/avatar'

export default function LatestVibesSection() {
  const latestVibes = getLatestVibes(3)
  const router = useRouter()

  const handleCardClick = (vibeId: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    router.push(`/vibes/${vibeId}`)
  }

  return (
    <section className="py-16">
      <div className="container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
          <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
        </div>
        <Link
          href="/vibes"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          查看全部 →
        </Link>
      </div>

      <div className="space-y-6">
        {latestVibes.map((vibe) => (
          <div
            key={vibe.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={(e) => handleCardClick(vibe.id, e)}
          >
            <div className="flex items-start space-x-3">
              <Avatar size="md" theme="primary">
                {vibe.author.name.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{vibe.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {vibe.createdAt.toLocaleDateString('zh-CN')} {vibe.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{vibe.content}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <button className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${vibe.isLiked ? 'text-red-500' : ''}`}>
                    <span>❤️</span>
                    <span>{vibe.likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <span>💬</span>
                    <span>{vibe.commentCount}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                    <span>🔄</span>
                    <span>{vibe.shareCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}