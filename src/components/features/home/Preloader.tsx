"use client"

import { useEffect } from 'react'
import { DynamicImportManager } from '@/lib/utils/dynamic-imports'

export default function Preloader() {
  useEffect(() => {
    const idle = (
      cb: IdleRequestCallback
    ): number | ReturnType<typeof setTimeout> => {
      if (typeof (window as any).requestIdleCallback === 'function') {
        return (window as any).requestIdleCallback(cb, { timeout: 2000 })
      }
      return setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as any), 1500)
    }

    const cancel = (handle: any) => {
      if (typeof (window as any).cancelIdleCallback === 'function') {
        ;(window as any).cancelIdleCallback(handle)
      } else {
        clearTimeout(handle)
      }
    }

    const handle = idle(() => {
      try {
        DynamicImportManager.preloadUserComponents()
        DynamicImportManager.preloadEditorComponents()
      } catch (e) {
        // 预加载失败不影响页面使用
        console.warn('Preload skipped or failed:', e)
      }
    })

    return () => cancel(handle)
  }, [])

  return null
}

