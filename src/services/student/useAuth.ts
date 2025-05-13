import type { LoginCredentials } from '@/types/auth'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import authService from '@/services/api/authService'

export const useAuth = createSharedComposable(() => {
  const isLoginPage = ref<boolean>(true)
  const isPassword = ref<boolean>(false)
  const credentials = ref<LoginCredentials>({
    email: '',
    password: '',
  })

  // set login page to false is false and true if true
  const handlePageChange = () => {
    return (isLoginPage.value = !isLoginPage.value)
  }

  // handle login
  const handleUserLogin = async () => {
    try {
      const response = await authService.login(credentials.value)
      console.log('Login response:', response)
      return response
    } catch (error) {
      console.error('Login error:', error)
      return error
    }
  }

  // handle password
  const handlePasswordChange = () => {
    console.log('Hello world')
    return (isPassword.value = !isPassword.value)
  }

  return {
    isLoginPage,
    isPassword,
    handlePageChange,
    handleUserLogin,
    handlePasswordChange,
    credentials,
  }
})
