import { setUserRole, type Role } from '@/utils/permissions/roles'
import apiClient, { type ApiResponse } from './apiClient'
import type {
  AuthResponse,
  LoginCredentials, MFASubmission,
  OTPVerificationData, PlainUser,
  RegisterData,
  ResetPasswordData,
  User
} from '@/types/auth.ts'
import type { UserResponse } from '@/types/student/dashboard_information'
import constant from '@/stores/constant'

class AuthService {
  // Login user
  public async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/authenticate', {
      username: credentials.email,
      password: credentials.password,
    })
    if (response.data.jwt) {
      return this.processToken(response)
    }
    return response
  }

  public async processMfa(mfa: MFASubmission){
    const response = await apiClient.put<AuthResponse>('/verify-mfa', {
      ...mfa
    })
    if (response.data.jwt) {
      return this.processToken(response)
    }
    return response
  }

  // process token
  public async processToken(response: ApiResponse<AuthResponse>){
    sessionStorage.setItem('auth_token', response.data.jwt)
    sessionStorage.setItem('isAuthenticated', 'true')
    const roles = response.data.roles.map((e) => e.toLowerCase())
    setUserRole(roles as Array<Role>)
    response.data.roles = roles
    sessionStorage.setItem('roles', JSON.stringify(roles))
    return response
  }

  // Register new user
  public async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)

    if (response.data.jwt) {
      sessionStorage.setItem('auth_token', response.data.jwt)
      sessionStorage.setItem('isAuthenticated', 'true')
      setUserRole((response.data.user as unknown as PlainUser).roles as Array<Role>)
    }

    return response
  }

  // Logout user
  public async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<null>('/auth/logout')

    // Clear auth data regardless of response
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('roles')

    return response
  }

  // Get current user profile
  public async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    return apiClient.get<UserResponse>(constant.current_user.current_user)
  }

  // verify user id
  public async verifyUserId(username: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(constant.auth.sendOtp, { username })
  }

  // verify otp
  public async verifyOTP(
    data: OTPVerificationData,
  ): Promise<ApiResponse<{ message: string; success: boolean }>> {
    return apiClient.post<{ message: string; success: boolean }>(constant.auth.verifyOtp, data)
  }

  // update forgot password
  public async updateRecoveredPassword(
    data: ResetPasswordData,
  ): Promise<ApiResponse<{ message: string; success: boolean; data: boolean }>> {
    return apiClient.post<{ message: string; success: boolean; data: boolean }>(
      constant.auth.updatePasswordForgot,
      data,
    )
  }

  // Verify email with token
  public async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(constant.auth.updatePasswordForgot, { token })
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true'
  }

  // Get auth token
  public getToken(): string | null {
    return sessionStorage.getItem('auth_token')
  }

  // Refresh token
  public async refreshToken(): Promise<ApiResponse<{ jwt: string }>> {
    const response = await apiClient.post<{ jwt: string }>('/auth/refresh')

    if (response.data.jwt) {
      sessionStorage.setItem('auth_token', response.data.jwt)
    }

    return response
  }
}

export const authService = new AuthService()
export default authService
