import { AuthToken } from './auth-types'

const ACCESS_TOKEN_KEY = 'mycoding_access_token'
const REFRESH_TOKEN_KEY = 'mycoding_refresh_token'
const TOKEN_EXPIRY_KEY = 'mycoding_token_expiry'

export class TokenManager {
  private static isClient = typeof window !== 'undefined'

  static setTokens(tokens: AuthToken): void {
    if (!this.isClient) return

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)

      const expiryTime = Date.now() + tokens.expiresIn * 1000
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
    } catch (error) {
      console.error('Failed to store tokens:', error)
    }
  }

  static getAccessToken(): string | null {
    if (!this.isClient) return null

    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  static getRefreshToken(): string | null {
    if (!this.isClient) return null

    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to get refresh token:', error)
      return null
    }
  }

  static clearTokens(): void {
    if (!this.isClient) return

    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(TOKEN_EXPIRY_KEY)
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  static isTokenExpired(): boolean {
    if (!this.isClient) return true

    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
      if (!expiryTime) return true

      return Date.now() > parseInt(expiryTime, 10)
    } catch (error) {
      console.error('Failed to check token expiry:', error)
      return true
    }
  }

  static getTokenExpiry(): number | null {
    if (!this.isClient) return null

    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
      return expiryTime ? parseInt(expiryTime, 10) : null
    } catch (error) {
      console.error('Failed to get token expiry:', error)
      return null
    }
  }

  static hasValidToken(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired()
  }

  static getTimeUntilExpiry(): number {
    const expiry = this.getTokenExpiry()
    if (!expiry) return 0

    const now = Date.now()
    return Math.max(0, expiry - now)
  }
}
