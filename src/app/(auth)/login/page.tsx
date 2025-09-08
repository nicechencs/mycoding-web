import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '登录 | MyCoding',
  description: '登录您的MyCoding账户',
}

export default function LoginPage() {
  return <LoginForm />
}
