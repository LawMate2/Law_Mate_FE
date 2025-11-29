// API configuration and base services
import.meta.env
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000'
const ACCESS_TOKEN_KEY = 'access_token'

export const api = {
  baseURL: API_BASE_URL,

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAccessToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Merge with custom headers from options
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value
        }
      })
    }

    const response = await fetch(url, {
      headers,
      ...options,
    })

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        // Token expired or invalid
        throw new Error('Unauthorized - please login again')
      }
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  },
}
