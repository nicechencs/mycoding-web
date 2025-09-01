import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="container text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          <span className="text-blue-600">
            MyCoding
          </span>
          <span className="text-base md:text-lg font-normal text-gray-600 ml-3">
            —— Where code meets vibe
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          现代化编程学习平台，让代码与创意完美融合
        </p>
      </div>
    </section>
  )
}