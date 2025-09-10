import React from 'react'
import { cn } from '@/lib/utils'

// Avatar尺寸配置
const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
} as const

// 纯色主题配置
const avatarThemes = {
  primary: 'bg-blue-500',
  secondary: 'bg-blue-500',
  tertiary: 'bg-blue-500',
  warm: 'bg-red-500',
  cool: 'bg-blue-500',
} as const

interface AvatarProps {
  children: React.ReactNode
  size?: keyof typeof avatarSizes
  theme?: keyof typeof avatarThemes
  className?: string
  onClick?: () => void
  title?: string
}

export function Avatar({
  children,
  size = 'md',
  theme = 'primary',
  className,
  onClick,
  title,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium flex-shrink-0',
        avatarSizes[size],
        avatarThemes[theme],
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </div>
  )
}

// 扩展变体 - 带悬浮效果的Avatar
interface AvatarButtonProps extends AvatarProps {
  onClick?: () => void
}

export function AvatarButton({
  onClick,
  className,
  ...props
}: AvatarButtonProps) {
  return (
    <Avatar
      {...props}
      className={cn(
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
      onClick={onClick}
    />
  )
}

// 用于浮动按钮的特殊变体
interface FloatingAvatarProps extends Omit<AvatarProps, 'size'> {}

export function FloatingAvatar({ className, ...props }: FloatingAvatarProps) {
  return (
    <Avatar
      {...props}
      size="xl"
      className={cn(
        'fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer z-50',
        className
      )}
    />
  )
}

// Avatar Image 组件 - 用于显示头像图片
interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  if (!src) return null
  
  return (
    <img
      src={src}
      alt={alt || 'Avatar'}
      className={cn('w-full h-full object-cover rounded-full', className)}
    />
  )
}

// Avatar Fallback 组件 - 用于在没有图片时显示的后备内容
interface AvatarFallbackProps {
  children: React.ReactNode
  className?: string
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center text-white font-medium bg-blue-500 rounded-full',
        className
      )}
    >
      {children}
    </div>
  )
}
