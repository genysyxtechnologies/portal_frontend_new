import apiClient, { type ApiResponse } from './apiClient'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
} from '@/types/auth.ts'

class AuthService {
  // Login user
  public async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/authenticate', {
      email: credentials.email,
      password: credentials.password,
    })
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('isAuthenticated', 'true')
    }
    return response
  }

  // Register new user
  public async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)

    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('isAuthenticated', 'true')
    }

    return response
  }

  // Logout user
  public async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<null>('/auth/logout')

    // Clear auth data regardless of response
    localStorage.removeItem('auth_token')
    localStorage.removeItem('isAuthenticated')

    return response
  }

  // Get current user profile
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/user')
  }

  // Send password reset link
  public async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email })
  }

  // Reset password with token
  public async resetPassword(data: ResetPasswordData): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password', data)
  }

  // Verify email with token
  public async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/verify-email', { token })
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true'
  }

  // Get auth token
  public getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  // Refresh token
  public async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh')

    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }

    return response
  }
}

export const authService = new AuthService()
export default authService
