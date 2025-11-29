import { api } from './api'
import type {
  DevLoginRequest,
  DevLoginResponse,
  DevSignupRequest,
  GoogleLoginRequest,
  GoogleLoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '../types/auth'

export const authApi = {
  // Dev signup
  async devSignup(data: DevSignupRequest): Promise<DevLoginResponse> {
    return api.request<DevLoginResponse>('/auth/dev/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Dev login
  async devLogin(data: DevLoginRequest): Promise<DevLoginResponse> {
    return api.request<DevLoginResponse>('/auth/dev/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Google OAuth login
  async googleLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    return api.request<GoogleLoginResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Refresh tokens
  async refreshTokens(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return api.request<RefreshTokenResponse>('/auth/dev/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get user by ID
  async getUser(userId: number): Promise<User> {
    return api.request<User>(`/auth/users/${userId}`)
  },

  // List users
  async listUsers(skip: number = 0, limit: number = 100): Promise<User[]> {
    return api.request<User[]>(`/auth/users?skip=${skip}&limit=${limit}`)
  },

  // Delete user
  async deleteUser(userId: number): Promise<{ message: string }> {
    return api.request<{ message: string }>(`/auth/users/${userId}`, {
      method: 'DELETE',
    })
  },
}
