// API configuration and base services
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:8000'

console.log('[API Config] VITE_BASE_API_URL:', import.meta.env.VITE_BASE_API_URL)
console.log('[API Config] Final API_BASE_URL:', API_BASE_URL)

export const api = {
  baseURL: API_BASE_URL,

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    console.log('[API Request]', options?.method || 'GET', url)
    console.log('[API Request] Options:', options)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    console.log('[API Response] Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API Response] Error body:', errorText)
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  },
}

// Auth API types
export interface GoogleLoginRequest {
  code: string
}

export interface DevLoginRequest {
  email: string
  name?: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface UserSchema {
  id: number
  email: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
  verified_email?: boolean
  last_login_at?: string
}

export interface AuthResponse {
  user: UserSchema
  access_token: string
  refresh_token: string
  is_new_user: boolean
  token_type: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// Auth API functions
export const authApi = {
  /**
   * Google OAuth 로그인
   */
  async googleLogin(code: string): Promise<AuthResponse> {
    return api.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  },

  /**
   * 개발용 로그인 (개발 환경에서만 사용)
   */
  async devLogin(email: string, name?: string): Promise<AuthResponse> {
    return api.request<AuthResponse>('/auth/dev/login', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    })
  },

  /**
   * 개발용 회원가입 (개발 환경에서만 사용)
   */
  async devSignup(email: string, name?: string): Promise<AuthResponse> {
    return api.request<AuthResponse>('/auth/dev/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    })
  },

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return api.request<RefreshTokenResponse>('/auth/dev/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  },

  /**
   * 사용자 정보 조회
   */
  async getUser(userId: number): Promise<UserSchema> {
    return api.request<UserSchema>(`/auth/users/${userId}`, {
      method: 'GET',
    })
  },
}
