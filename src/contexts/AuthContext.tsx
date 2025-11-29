import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/services'
import type { User, DevLoginRequest, DevSignupRequest, GoogleLoginRequest } from '@/types'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  devLogin: (data: DevLoginRequest) => Promise<void>
  devSignup: (data: DevSignupRequest) => Promise<void>
  googleLogin: (data: GoogleLoginRequest) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // 로컬 스토리지에서 토큰 및 사용자 정보 복원
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const userJson = localStorage.getItem(USER_KEY)

    if (accessToken && userJson) {
      try {
        const userData = JSON.parse(userJson) as User
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const saveAuthData = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const devLogin = async (data: DevLoginRequest) => {
    try {
      const response = await authApi.devLogin(data)
      saveAuthData(response.access_token, response.refresh_token, response.user)
    } catch (error) {
      console.error('Dev login failed:', error)
      throw error
    }
  }

  const devSignup = async (data: DevSignupRequest) => {
    try {
      const response = await authApi.devSignup(data)
      saveAuthData(response.access_token, response.refresh_token, response.user)
    } catch (error) {
      console.error('Dev signup failed:', error)
      throw error
    }
  }

  const googleLogin = async (data: GoogleLoginRequest) => {
    try {
      const response = await authApi.googleLogin(data)
      const refreshToken = response.refresh_token || response.access_token
      saveAuthData(response.access_token, refreshToken, response.user)
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      logout()
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refreshTokens({ refresh_token: refreshToken })
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        devLogin,
        devSignup,
        googleLogin,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
