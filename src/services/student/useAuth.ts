import type { AuthResponse, LoginCredentials } from '@/types/auth'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import authService from '@/services/api/authService'
import type { ApiResponse } from '@/services/api/apiClient.ts'

export const useAuth = createSharedComposable(() => {
  const isLoginPage = ref<boolean>(true)
  const isPassword = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const message = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const usernameError = ref<boolean>(false)
  const passwordError = ref<boolean>(false)
  const error = ref<string | null>(null)
  const credentials = ref<LoginCredentials>({
    email: '',
    password: '',
  })

  // set login page to false is false and true if true
  const handlePageChange = () => {
    return (isLoginPage.value = !isLoginPage.value)
  }

  // handle login
  const handleUserLogin = async (): Promise<ApiResponse> => {
    isLoading.value = true
    try {
      const response = await authService.login(credentials.value)
      if (response.success) {
        isAuthenticated.value = true
        message.value = 'Successfully logged in'
        return response
      } else {
        message.value = response.message as string
        isAuthenticated.value = false
        return response
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // handle password
  const handlePasswordChange = () => {
    return (isPassword.value = !isPassword.value)
  }

  return {
    isLoginPage,
    isPassword,
    handlePageChange,
    handleUserLogin,
    handlePasswordChange,
    isLoading,
    isAuthenticated,
    error,
    message,
    credentials,
    usernameError,
    passwordError,
  }
})
