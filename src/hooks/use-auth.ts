import { useContext } from 'react'
import { AuthContext } from '@/components/auth/AuthProvider'
import { AuthContextType } from '@/lib/auth/auth-types'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
