import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="container text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          <span className="text-blue-600">
            MyCoding
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          现代化编程学习平台，集<span className="font-semibold text-blue-600">资源导航</span>、
          <span className="font-semibold text-purple-600">内容创作</span>、
          <span className="font-semibold text-green-600">动态分享</span>于一体
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Next.js 14</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span>TypeScript</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Tailwind CSS</span>
          </div>
        </div>

      </div>
    </section>
  )
}