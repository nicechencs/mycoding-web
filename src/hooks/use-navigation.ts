import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 导航钩子 - 解决 router.push 不工作的问题
 * 使用原生方法作为后备方案
 */
export function useNavigation() {
  const router = useRouter()

  const navigate = useCallback(
    (url: string) => {
      // 优先使用 Next 的客户端路由，便于测试环境 mock
      if (url.startsWith('/')) {
        try {
          router.push(url)
          return
        } catch {
          // 忽略，回退到原生导航
        }
      }

      // 绝对路径或路由不可用时回退到原生导航
      if (typeof window !== 'undefined') {
        window.location.assign(url)
      }
    },
    [router]
  )

  const softNavigate = useCallback(
    (url: string) => {
      if (url.startsWith('/')) {
        try {
          router.push(url)
          return
        } catch {
          // fall through
        }
      }
      if (typeof window !== 'undefined') {
        window.location.assign(url)
      }
    },
    [router]
  )

  return {
    navigate, // 客户端导航优先，原生为后备
    softNavigate,
  }
}
