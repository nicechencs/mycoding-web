'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

// 基础Avatar容器
interface AvatarProps {
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | string
  theme?: string
  onClick?: () => void
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, size = 'md', theme, onClick }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    }

    const Component = onClick ? 'button' : 'div'

    return (
      <Component
        ref={ref as any}
        className={clsx(
          'relative flex shrink-0 overflow-hidden rounded-full',
          typeof size === 'string' &&
            sizeClasses[size as keyof typeof sizeClasses]
            ? sizeClasses[size as keyof typeof sizeClasses]
            : size === 'sm' || size === 'md' || size === 'lg'
              ? sizeClasses[size]
              : 'h-10 w-10',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
        type={onClick ? 'button' : undefined}
      >
        {children}
      </Component>
    )
  }
)
Avatar.displayName = 'Avatar'

// Avatar图片组件
interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt }, ref) => (
    <img
      ref={ref}
      className={clsx('aspect-square h-full w-full', className)}
      src={src}
      alt={alt}
    />
  )
)
AvatarImage.displayName = 'AvatarImage'

// Avatar回退组件
interface AvatarFallbackProps {
  className?: string
  children: React.ReactNode
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        className
      )}
    >
      {children}
    </div>
  )
)
AvatarFallback.displayName = 'AvatarFallback'

// 浮动Avatar按钮
interface FloatingAvatarProps {
  onClick?: () => void
  theme?: 'primary' | 'secondary'
  title?: string
  className?: string
  children: React.ReactNode
}

export const FloatingAvatar = forwardRef<
  HTMLButtonElement,
  FloatingAvatarProps
>(({ className, onClick, theme = 'primary', title, children }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500':
          theme === 'primary',
        'bg-slate-500 text-white hover:bg-slate-600 focus:ring-slate-500':
          theme === 'secondary',
      },
      className
    )}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
))
FloatingAvatar.displayName = 'FloatingAvatar'
