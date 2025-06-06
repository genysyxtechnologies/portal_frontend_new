<template>
  <Card class="auth-card p-5">
    <template #content>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }"
      >
        <h3 class="form-title">Verify Your Identity</h3>
        <p class="form-subtitle">Enter the 6-digit code sent to your registered contact</p>

        <form @submit.prevent="handleOTPVerification()" class="otp-form">
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

          <div class="mt-6">
            <Button
              type="submit"
              label="VERIFY CODE"
              icon="pi pi-check-circle"
              class="p-button-lg custom-button w-full"
              :loading="isVerifying"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 400, ease: 'easeOut' },
              }"
            />
          </div>
        </form>

        <div
          class="auth-links mt-4 text-center"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 600, delay: 600 } }"
        >
          <a href="#" class="auth-link" @click.prevent="goBack">
            <i class="pi pi-arrow-left mr-1"></i> Back to Previous Step
          </a>
        </div>

        <!-- Success animation -->
        <div v-if="showSuccess" class="success-animation">
          <div class="checkmark-container">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <p class="success-text">OTP Verified Successfully!</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { toastService } from '@/services/toastService'
import Card from 'primevue/card'
import Button from 'primevue/button'
import usePasswordRecorvery from './usePasswordRecorvery'
import { useRoute } from 'vue-router'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  (e: 'next-step', data: { userId: string; token: string }): void
  (e: 'prev-step'): void
}>()

const otpDigits = ref(Array(6).fill(''))
const otpInputs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const isVerifying = ref(false)
const isResending = ref(false)
const timer = ref(60)
const resendEnabled = ref(false)
const showSuccess = ref(false)
const { verifyOTP, verifyUserId } = usePasswordRecorvery()

// Format time for display
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// Start the timer
const startTimer = () => {
  timer.value = 60
  resendEnabled.value = false

  const interval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(interval)
      resendEnabled.value = true
    }
  }, 1000)
}

// Handle OTP input
const handleOtpInput = (index: number): void => {
  if (otpDigits.value[index].length === 1 && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus()
    })
  }

  // Clear error when user types
  if (otpError.value) {
    otpError.value = ''
  }
}

// Handle keyboard navigation between inputs
const handleKeyDown = (event: KeyboardEvent, index: number): void => {
  if (event.key === 'Backspace') {
    if (otpDigits.value[index] === '') {
      if (index > 0) {
        otpInputs.value[index - 1]?.focus()
      }
    } else {
      otpDigits.value[index] = ''
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

// Handle paste event for OTP
const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')

  if (!pastedData) return

  // Filter only digits
  const digits = pastedData.replace(/\D/g, '').slice(0, 6)

  if (digits.length > 0) {
    // Fill the OTP inputs
    for (let i = 0; i < digits.length; i++) {
      if (i < 6) {
        otpDigits.value[i] = digits[i]
      }
    }

    // Focus on the next empty input or the last one
    const nextEmptyIndex = otpDigits.value.findIndex((digit) => digit === '')
    if (nextEmptyIndex !== -1) {
      otpInputs.value[nextEmptyIndex]?.focus()
    } else {
      otpInputs.value[5]?.focus()
    }
  }
}

// get the userId from route
const route = useRoute()
const userIdFromRoute = ref(route.query.userId as string)

// Verify OTP
const handleOTPVerification = async () => {
  const otp = otpDigits.value.join('')

  if (otp.length !== 6) {
    otpError.value = 'Please enter all 6 digits'
    return
  }

  if (!/^\d+$/.test(otp)) {
    otpError.value = 'OTP should contain only numbers'
    return
  }

  isVerifying.value = true
  otpError.value = ''

  try {
    const response = await verifyOTP(otpDigits.value.join(''), userIdFromRoute.value)
    if ((response as { success: boolean }).success) {
      // Show success animation
      showSuccess.value = true

      // Wait for animation to complete before proceeding
      setTimeout(() => {
        showSuccess.value = false

        // Move to next step with token
        emit('next-step', {
          userId: props.userId,
          token: (response as { token: string }).token || '',
        })
      }, 2000)
    } else {
      otpError.value = (response as { message: string }).message || 'Invalid verification code'
      toastService.error(otpError.value, {
        title: 'Verification Failed',
        duration: 3000
      })
    }
  } catch (_) {
    return
  } finally {
    isVerifying.value = false
  }
}

// Resend OTP
const resendOTP = async () => {
  if (isResending.value) return

  isResending.value = true

  try {
    // Call the API to resend OTP
    const response = await verifyUserId(userIdFromRoute.value)

    if ((response as { success: boolean }).success) {
      // Reset OTP inputs
      otpDigits.value = Array(6).fill('')
      otpError.value = ''

      // Restart timer
      startTimer()

      // Show success message
      toastService.success('A new verification code has been sent', {
        title: 'Code Resent',
        duration: 3000
      })

      // Focus on first input
      nextTick(() => {
        otpInputs.value[0]?.focus()
      })
    } else {
      toastService.error((response as any).message || 'Failed to resend code', {
        title: 'Failed',
        duration: 3000
      })
    }
  } catch (_) {
    toastService.error('An error occurred while resending the code', {
      title: 'Error',
      duration: 3000
    })
  } finally {
    isResending.value = false
  }
}

// Go back to previous step
const goBack = () => {
  emit('prev-step')
}

// Initialize component
onMounted(() => {
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
.auth-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
  text-align: center;
}

.otp-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
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
  color: #4f46e5;
}

.otp-input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background: white;
}

.error-input {
  border-color: #ef4444 !important;
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
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
  color: #64748b;
  font-size: 0.9rem;
}

.timer {
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-resend {
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
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
  background-color: rgba(79, 70, 229, 0.05);
  transform: translateY(-2px);
}

.btn-resend:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.custom-button {
  background: linear-gradient(135deg, var(--secondary-dark-color) 0%, var(--secondary-light-color) 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.25);
  transition: all 0.3s ease;
  height: 3.5rem;
}

.custom-button:hover {
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-light-color) 100%);
  box-shadow: 0 6px 10px rgba(124, 58, 237, 0.35);
  transform: translateY(-2px);
}

.custom-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

.auth-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.auth-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.auth-link:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* Success animation */
.success-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.checkmark-container {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.checkmark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4f46e5;
  stroke-miterlimit: 10;
  box-shadow: 0 0 0 rgba(79, 70, 229, 0.4);
  animation:
    fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4f46e5;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 100px rgba(79, 70, 229, 0.1);
  }
}

.success-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4f46e5;
  margin-top: 1rem;
  animation: slideUp 0.5s ease 0.9s both;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
