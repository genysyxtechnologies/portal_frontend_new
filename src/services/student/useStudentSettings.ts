import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import StudentSettingsRepository from '@/repositories/student/student.settings.repository'
import constant from '@/stores/constant'
const { user, auth } = constant

const useStudentSettings = createSharedComposable(() => {
  const isLoading = ref<boolean>(false)
  const studentSettingsRepository = new StudentSettingsRepository()
  const updatedSuccess = ref<boolean>(false)
  // update profile
  const updateProfile = async (data: { phone: string; email: string; userId: string }) => {
    isLoading.value = true
    try {
      const response = await studentSettingsRepository.updateProfile(user.update, data)
      return response.data
    } catch (error) {
      return error
    } finally {
      isLoading.value = false
    }
  }

  // update password
  const updatePassword = async (data: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
    userId: string
  }) => {
    isLoading.value = true
    try {
      const response = await studentSettingsRepository.updatePassword(auth.updatePassword, data)
      return response as { success: boolean }
    } catch (error) {
      return error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    updateProfile,
    updatePassword,
  }
})

export default useStudentSettings
