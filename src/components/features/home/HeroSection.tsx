import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="container text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MyCoding Web
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link
            href="/resources"
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            探索资源
          </Link>
          <Link
            href="/posts"
            className="btn-secondary px-8 py-3 text-base font-semibold"
          >
            发布内容
          </Link>
        </div>
      </div>
    </section>
  )
}