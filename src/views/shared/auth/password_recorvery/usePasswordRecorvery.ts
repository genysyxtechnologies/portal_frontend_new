import authService from '@/services/api/authService'
import type { OTPVerificationData, ResetPasswordData } from '@/types/auth'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

const usePasswordRecorvery = createSharedComposable(() => {
  const userId = ref<string>('')
  const otp = ref<OTPVerificationData>({ password: '', username: '' })

  const verifyUserId = async (username = userId.value) => {
    try {
      const response = await authService.verifyUserId(username)
      return response as { success: boolean }
    } catch (error) {
      return error
    }
  }

  // Verify OTP
  const verifyOTP = async (otp: string, username = userId.value) => {
    try {
      const response = await authService.verifyOTP({ password: otp, username })
      return response.data as { success: boolean }
    } catch (error) {
      return error
    }
  }

  // update forgot password
  const updateForgotPassword = async (data: ResetPasswordData) => {
    try {
      const response = await authService.updateRecoveredPassword(data)
      return response.data
    } catch (error) {
      return error
    }
  }

  return {
    verifyUserId,
    userId,
    otp,
    verifyOTP,
    updateForgotPassword,
  }
})

export default usePasswordRecorvery
