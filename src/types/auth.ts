// Auth related types based on backend schemas

export interface User {
  id: number
  email: string
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  picture?: string | null
  locale?: string | null
  verified_email?: boolean | null
  last_login_at?: string | null
}

// Google OAuth
export interface GoogleLoginRequest {
  access_token: string
}

export interface GoogleLoginResponse {
  user: User
  access_token: string
  refresh_token?: string | null
  is_new_user: boolean
  token_type: string
}

// Dev Login/Signup
export interface DevLoginRequest {
  email: string
  name?: string | null
}

export interface DevSignupRequest {
  email: string
  name?: string | null
}

export interface DevLoginResponse {
  user: User
  access_token: string
  refresh_token: string
  is_new_user: boolean
  message: string
  token_type: string
}

// Refresh Token
export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}
