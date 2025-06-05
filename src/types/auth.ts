// User types
export interface User {
  user: {
    id: string
    name: string
    username: string
    email: string
    roles: string[]
    avatar?: string
    department?: string
    position?: string
    matric_number?: string
    created_at: string
    updated_at: string
  }
  superOption: boolean
}

export interface PlainUser {
  id: string
  name: string
  username: string
  email: string
  roles: string[]
  avatar?: string
  department?: string
  position?: string
  matric_number?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface MFASubmission {
  userId: string,
  code: string,
  recovery: string | undefined | null
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  roles: string[]
  jwt: string
  mfa: boolean
  old: string
}

export interface ResetPasswordData {
  userId: string
  newPassword: string
  confirmPassword: string
}

export interface OTPVerificationData {
  password: string
  username: string
}
