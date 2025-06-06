import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/api/authService'
import { anyContains, setUserRole, type Role } from '@/utils/permissions/roles'
import router from '@/router'
import type { LoginCredentials, PlainUser, RegisterData, User } from '@/types/auth.ts'
import { checkAuth } from '@/utils/authUtil.ts'

interface ApiError extends Error {
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | PlainUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.user?.roles || ['guest'])
  const userFullName = computed(() => user.value?.user?.name || '')
  const userEmail = computed(() => user.value?.user?.email || '')
  const userAvatar = computed(() => user.value?.user?.avatar || '/assets/default-avatar.png')

  // Actions
  async function initialize() {
    if (isInitialized.value) return

    // check auth
    checkAuth()

    loading.value = true
    error.value = null

    // first load roles from session storage
    const r = sessionStorage.getItem('roles')
    if (r && authService.isAuthenticated()) {
      // pass
      try {
        setUserRole(JSON.parse(r))
      } catch (e: unknown) {
        setUserRole([])
      }
    }

    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser()
        if (response.success && response.data) {
          user.value = response.data as unknown as User
          setUserRole(response.data.user.roles as Array<Role>)
          return response.data
        } else {
          logout()
          // Token is invalid, clear auth state
          logout()
        }
      }
    } catch (err) {
      logout()
    } finally {
      loading.value = false
      isInitialized.value = true
    }
  }

  async function storeRoles(roles: string[]) {
    sessionStorage.setItem('roles', JSON.stringify(roles))
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response.success && response.data.user) {
        user.value = response.data.user
        setUserRole(response.data.user.roles as Array<Role>)

        // Redirect based on role
        const redirectPath = getRedirectPathBasedOnRole(response.data.user.roles)
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
        setUserRole(response.data.user.roles as Array<Role>)

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
      setUserRole(['guest'])
      loading.value = false

      // Redirect to login
      router.push('/')
    }
  }

  async function updateProfile(profileData: Partial<User>) {
    if (!user.value) return false

    loading.value = true
    error.value = null

    try {
      const response = await authService.getCurrentUser()

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

  function getRedirectPathBasedOnRole(roles: string[]): string {
    if (anyContains(['admin'], roles)) {
      return '/admin/dashboard'
    } else if (anyContains(['lecturer'], roles)) {
      return '/staff/dashboard'
    } else if (anyContains(['student'], roles)) {
      return '/student/dashboard'
    }
    return '/'
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
    storeRoles,
  }
})
