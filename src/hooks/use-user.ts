import { useAuth } from './use-auth'
import { AuthUser } from '@/lib/auth/auth-types'

export function useUser(): {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
} {
  const { user, isAuthenticated, isLoading } = useAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}
