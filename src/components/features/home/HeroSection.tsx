import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="container text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          <span className="text-blue-600">MyCoding</span>
          <span className="text-base md:text-lg font-normal text-gray-600 ml-3">
            —— Where code meets vibe
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          现代化编程学习平台，让代码与创意完美融合
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/resources"
            className="inline-flex items-center px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            浏览资源
          </Link>
          <Link
            href="/posts/new"
            className="inline-flex items-center px-5 py-3 rounded-md bg-white text-blue-700 font-medium border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            开始创作
          </Link>
          <Link
            href="/vibes"
            className="inline-flex items-center px-5 py-3 rounded-md bg-white text-blue-700 font-medium border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            查看动态
          </Link>
        </div>
      </div>
    </section>
  )
}
