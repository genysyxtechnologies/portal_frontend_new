import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

export const useAuth = createSharedComposable(() => {
  const isLoginPage = ref<boolean>(true)

  // set login page to false is false and true if true
  const handlePageChange = () => {
    return (isLoginPage.value = !isLoginPage.value)
  }

  return {
    isLoginPage,
    handlePageChange,
  }
})
