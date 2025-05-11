// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
  token: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
