<template>
  <div class="otp-verification-container">
    <div class="card">
      <!-- Background floating elements for visual appeal -->
      <div class="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-50 opacity-70 animate-float-1"></div>
      <div class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-100 opacity-50 animate-float-2"></div>
      <div class="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-blue-200 opacity-30 animate-float-3"></div>

      <div class="card-content">
        <div class="header-section">
          <h1 class="animate-text-focus-in">Verify Your Identity</h1>
          <p class="subtitle animate-tracking-in-expand">
            Enter the 6-digit code sent to your registered email or phone
          </p>
        </div>

        <form @submit.prevent="verifyOTP" class="otp-form animate-fade-in-delayed">
          <div class="otp-input-container">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              ref="otpInputs"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="otp-input"
              :class="{ 'error-input': otpError }"
              @input="handleOtpInput(index)"
              @keydown="handleKeyDown($event, index)"
              @paste="handlePaste"
              @focus="(e) => (e.target as HTMLInputElement).select()"
            />
          </div>

          <small v-if="otpError" class="error-message">{{ otpError }}</small>

          <div class="timer-container" v-if="!resendEnabled">
            <span class="timer-text">Resend code in </span>
            <span class="timer">{{ formatTime(timer) }}</span>
          </div>

          <button
            v-if="resendEnabled"
            type="button"
            class="btn-resend"
            @click="resendOTP"
            :disabled="isResending"
          >
            <span v-if="!isResending">Resend Code</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>

          <button type="submit" class="btn-submit" :disabled="isSubmitting || !isOtpComplete">
            <span v-if="!isSubmitting">Verify Code</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>

          <div v-if="apiError" class="api-error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ apiError }}</span>
          </div>
        </form>

        <div class="auth-links">
          <p>
            <router-link to="/forgot-password" class="link-animated">
              <i class="pi pi-arrow-left mr-1"></i> Back to Identity Verification
            </router-link>
          </p>
        </div>
      </div>

      <!-- Success overlay -->
      <transition name="fade">
        <div
          v-if="verificationSuccess"
          class="success-overlay"
        >
          <div class="success-content">
            <div class="checkmark-container">
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2>Verification Successful</h2>
            <p>Redirecting to reset your password...</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/api/authService'
import type { OTPVerificationData } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const userId = ref(route.query.userId as string || '')

// OTP state
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const apiError = ref('')
const isSubmitting = ref(false)
const verificationSuccess = ref(false)

// Timer for resend functionality
const timer = ref(60)
const resendEnabled = ref(false)
const isResending = ref(false)
const successMessage = ref('')

// Computed property to check if OTP is complete
const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit.length === 1)
})

// Format time for display
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Start the timer
const startTimer = () => {
  timer.value = 60
  resendEnabled.value = false

  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      resendEnabled.value = true
      clearInterval(interval)
    }
  }, 1000)
}

// Handle OTP input
const handleOtpInput = (index: number): void => {
  // Clear errors
  otpError.value = ''
  apiError.value = ''

  // Ensure only numbers are entered
  otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '')

  // Move to next input if current one is filled
  if (otpDigits.value[index] && index < 5 && otpInputs.value[index + 1]) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus()
    })
  }
}

// Handle keyboard navigation between inputs
const handleKeyDown = (event: KeyboardEvent, index: number): void => {
  // Move to previous input on backspace if current is empty
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0 && otpInputs.value[index - 1]) {
    nextTick(() => {
      otpInputs.value[index - 1]?.focus()
    })
  }

  // Arrow key navigation
  if (event.key === 'ArrowLeft' && index > 0 && otpInputs.value[index - 1]) {
    nextTick(() => {
      otpInputs.value[index - 1]?.focus()
    })
  }

  if (event.key === 'ArrowRight' && index < 5 && otpInputs.value[index + 1]) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus()
    })
  }
}

// Handle paste event for OTP
const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault()
  const clipboardData = event.clipboardData || (window as Window & typeof globalThis & { clipboardData?: DataTransfer }).clipboardData
  const pastedData = clipboardData ? clipboardData.getData('text') : ''
  const pastedOtp = pastedData.replace(/[^0-9]/g, '').substring(0, 6)

  if (pastedOtp) {
    for (let i = 0; i < pastedOtp.length; i++) {
      if (i < 6) {
        otpDigits.value[i] = pastedOtp[i]
      }
    }

    // Focus on the last filled input or the next empty one
    const lastIndex = Math.min(pastedOtp.length, 5)
    nextTick(() => {
      if (otpInputs.value[lastIndex]) {
        otpInputs.value[lastIndex]?.focus()
      }
    })
  }
}

// Verify OTP
const verifyOTP = async () => {
  // Reset error messages
  otpError.value = ''
  apiError.value = ''

  // Validate OTP is complete
  if (!isOtpComplete.value) {
    otpError.value = 'Please enter the complete 6-digit code'
    return
  }

  isSubmitting.value = true

  try {
    // Combine OTP digits for verification
    const otpCode = otpDigits.value.join('')

    // Prepare verification data
    const verificationData: OTPVerificationData = {
      username: userId.value,
      password: otpCode
    }

    // Make API call to verify the OTP
    const response = await authService.verifyOTP(verificationData)

    if (response.success) {
      // Show success and redirect to reset password page
      verificationSuccess.value = true

      // Redirect after showing success animation
      setTimeout(() => {
        // Redirect to reset password page with token from API response
        router.push({
          name: 'ResetPassword',
          query: {
            token: response.data?.token || '',
            userId: userId.value
          }
        })
      }, 2000)
    } else {
      apiError.value = response.message || 'Invalid OTP. Please try again.'
    }
  } catch (error) {
    // Handle API errors
    if (error instanceof Error) {
      apiError.value = error.message || 'Failed to verify code. Please try again.'
    } else {
      apiError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Resend OTP code
const resendOTP = async () => {
  if (isResending.value || timer.value > 0) return

  isResending.value = true
  apiError.value = ''

  try {
    // Make API call to verify the user ID again to trigger a new OTP
    const response = await authService.verifyUserId(userId.value)

    if (response.success) {
      // Reset timer
      timer.value = 60
      startTimer()

      // Show success message
      successMessage.value = response.message || 'New OTP code sent successfully!'

      // Clear existing OTP inputs
      otpDigits.value = ['', '', '', '', '', '']

      // Focus on first input
      nextTick(() => {
        if (otpInputs.value[0]) {
          otpInputs.value[0]?.focus()
        }
      })
    } else {
      apiError.value = response.message || 'Failed to resend OTP. Please try again.'
    }
  } catch (error) {
    if (error instanceof Error) {
      apiError.value = error.message
    } else {
      apiError.value = 'Failed to resend OTP. Please try again.'
    }
  } finally {
    isResending.value = false
  }
}

// Initialize component
onMounted(() => {
  // Redirect if no userId is provided
  if (!userId.value) {
    router.push('/forgot-password')
    return
  }

  // Start timer for OTP resend
  startTimer()

  // Focus on first input
  nextTick(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0]?.focus()
    }
  })
})
</script>

<style scoped>
.otp-verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-content {
  position: relative;
  z-index: 10;
}

.header-section {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: #0d47a1;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(13, 71, 161, 0.1);
}

.subtitle {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.otp-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.otp-input-container {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.otp-input {
  width: 52px;
  height: 60px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  color: #0d47a1;
}

.otp-input:focus {
  border-color: #0d47a1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.2);
  background: white;
}

.error-input {
  border-color: #ef4444 !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
  margin-top: -0.5rem;
}

.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.timer-text {
  color: #666;
  font-size: 0.9rem;
}

.timer {
  color: #0d47a1;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-resend {
  background-color: transparent;
  color: #0d47a1;
  border: 1px solid #0d47a1;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-resend:hover {
  background-color: rgba(13, 71, 161, 0.05);
  transform: translateY(-2px);
}

.btn-resend:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-submit {
  background-color: #0d47a1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(13, 71, 161, 0.2);
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background-color: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(13, 71, 161, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-links {
  text-align: center;
  margin-top: 1.5rem;
}

.link-animated {
  color: #0d47a1;
  text-decoration: none;
  position: relative;
  font-weight: 500;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
}

.link-animated:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #0d47a1;
  transition: width 0.3s ease;
}

.link-animated:hover {
  color: #1565C0;
}

.link-animated:hover:after {
  width: 100%;
}

.api-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  animation: fade-in 0.5s ease-in-out;
}

/* Success overlay */
.success-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  border-radius: 12px;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-content h2 {
  color: #0d47a1;
  font-weight: 700;
  margin-top: 1.5rem;
  font-size: 1.5rem;
}

.success-content p {
  color: #666;
  margin-top: 0.5rem;
}

.checkmark-container {
  width: 80px;
  height: 80px;
}

.checkmark {
  width: 100%;
  height: 100%;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #0d47a1;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: #0d47a1;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animations */
@keyframes float-1 {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20px, 20px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes float-2 {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-15px, -15px) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) rotate(-360deg);
  }
}

@keyframes float-3 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(10px, -10px) scale(1.2);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

.animate-float-1 {
  animation: float-1 15s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 12s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 10s ease-in-out infinite;
}

.animate-text-focus-in {
  animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

@keyframes text-focus-in {
  0% {
    filter: blur(12px);
    opacity: 0;
    letter-spacing: -0.5em;
  }
  100% {
    filter: blur(0);
    opacity: 1;
    letter-spacing: normal;
  }
}

.animate-tracking-in-expand {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
    letter-spacing: normal;
  }
}

.animate-fade-in-delayed {
  animation: fade-in 1.2s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation-delay: 0.3s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
