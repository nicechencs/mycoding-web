import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: '注册 | MyCoding',
  description: '注册MyCoding账户，加入开发者社区',
}

export default function RegisterPage() {
  return <RegisterForm />
}
