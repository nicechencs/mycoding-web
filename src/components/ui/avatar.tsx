import React from 'react'
import { cn } from '@/lib/utils'

// Avatar尺寸配置
const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm', 
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg'
} as const

// 渐变主题配置
const avatarThemes = {
  primary: 'from-green-500 to-blue-500',
  secondary: 'from-purple-500 to-blue-500',
  tertiary: 'from-blue-500 to-purple-500',
  warm: 'from-orange-500 to-red-500',
  cool: 'from-cyan-500 to-blue-500'
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
  title
}: AvatarProps) {
  return (
    <div 
      className={cn(
        'bg-gradient-to-r rounded-full flex items-center justify-center text-white font-medium flex-shrink-0',
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

export function AvatarButton({ onClick, className, ...props }: AvatarButtonProps) {
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
interface FloatingAvatarProps extends Omit<AvatarProps, 'size'> {
}

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