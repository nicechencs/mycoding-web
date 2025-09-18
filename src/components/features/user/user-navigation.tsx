'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export function UserNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    {
      href: '/settings',
      label: '个人中心',
      icon: '👤',
      isActive: pathname === '/settings'
    },
    {
      href: '/my-favorites',
      label: '我的收藏',
      icon: '📚',
      isActive: pathname === '/my-favorites'
    },
    {
      href: '/my-comments',
      label: '我的评论',
      icon: '💬',
      isActive: pathname === '/my-comments'
    }
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* 用户信息 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">个人中心</p>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}