export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface ResetPasswordData {
  token: string
  userId: string
  password: string
}

class AuthService {
  public async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    // Mock implementation for demo purposes
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: '123',
              email: credentials.email,
              name: 'Demo User'
            },
            token: 'mock-jwt-token'
          }
        })
      }, 1000)
    })
  }

  public async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    // Mock implementation for demo purposes
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Verification code sent successfully'
        })
      }, 1000)
    })
  }

  public async verifyOTP(userId: string, otp: string): Promise<ApiResponse<{ token: string }>> {
    // Mock implementation for demo purposes
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            token: 'mock-reset-token-12345'
          }
        })
      }, 1000)
    })
  }

  public async resetPassword(data: ResetPasswordData): Promise<ApiResponse<{ message: string }>> {
    // Mock implementation for demo purposes
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset successfully'
        })
      }, 1000)
    })
  }
}

export default new AuthService()
