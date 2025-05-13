// User types
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  department?: string;
  position?: string;
  matric_number?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  roles: string[]
  jwt: string;
  mfa: boolean;
  old: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
