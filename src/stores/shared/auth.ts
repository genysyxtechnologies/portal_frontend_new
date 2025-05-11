import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/api/authService'
import { setUserRole } from '@/utils/permissions/roles'
import router from '@/router'
import type { LoginCredentials, RegisterData, User } from '@/types/auth.ts'

type UserRole = 'admin' | 'staff' | 'student' | 'guest'

interface ApiError extends Error {
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const userFullName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '/assets/default-avatar.png')

  // Actions
  async function initialize() {
    if (isInitialized.value) return

    loading.value = true
    error.value = null

    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser()
        if (response.success && response.data) {
          user.value = response.data
          setUserRole(response.data.role as UserRole)
        } else {
          // Token is invalid, clear auth state
          logout()
        }
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      logout()
    } finally {
      loading.value = false
      isInitialized.value = true
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response.success && response.data.user) {
        user.value = response.data.user
        setUserRole(response.data.user.role as UserRole)

        // Redirect based on role
        const redirectPath = getRedirectPathBasedOnRole(response.data.user.role)
        router.push(redirectPath)

        return true
      } else {
        error.value = response.message || 'Login failed'
        return false
      }
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.message || 'An unexpected error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(data)

      if (response.success && response.data.user) {
        user.value = response.data.user
        setUserRole(response.data.user.role as UserRole)

        // Redirect to verification page
        router.push('/auth/verify-email')

        return true
      } else {
        error.value = response.message || 'Registration failed'
        return false
      }
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.message || 'An unexpected error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true

    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear user state regardless of API response
      user.value = null
      setUserRole('guest')
      loading.value = false

      // Redirect to login
      router.push('/auth/login')
    }
  }

  async function updateProfile(profileData: Partial<User>) {
    if (!user.value) return false

    loading.value = true
    error.value = null

    try {
      const response = await authService.getCurrentUser() // Mock - replace with actual API call

      if (response.success) {
        user.value = {
          ...user.value,
          ...profileData,
        }
        return true
      } else {
        error.value = response.message || 'Failed to update profile'
        return false
      }
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.message || 'An unexpected error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  function getRedirectPathBasedOnRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'staff':
        return '/staff/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/'
    }
  }

  return {
    // State
    user,
    loading,
    error,
    isInitialized,

    // Getters
    isAuthenticated,
    userRole,
    userFullName,
    userEmail,
    userAvatar,

    // Actions
    initialize,
    login,
    register,
    logout,
    updateProfile,
  }
})
