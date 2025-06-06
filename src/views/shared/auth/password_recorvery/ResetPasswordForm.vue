<template>
  <Card class="auth-card p-5">
    <template #content>
      <!-- Success screen -->
      <div
        v-if="resetSuccess"
        class="success-container"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 600, ease: 'easeOut' } }"
      >
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>

        <h2 class="success-title">Password Reset Successful!</h2>
        <p class="success-message">Your password has been changed successfully. You can now use your new password to log in to your account.</p>

        <Button
          label="CONTINUE TO LOGIN"
          icon="pi pi-sign-in"
          class="p-button-lg custom-button w-full mt-6"
          @click="goToLogin"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400, ease: 'easeOut' } }"
        />
      </div>

      <!-- Reset password form -->
      <div
        v-else
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }"
      >
        <h3 class="form-title">Reset Your Password</h3>
        <p class="form-subtitle">Create a new secure password for your account</p>

        <form @submit.prevent="resetPassword" class="reset-form">
          <div class="input-group">
            <span class="p-float-label custom-input-container relative">
              <i class="pi pi-lock absolute top-3 left-2 transform -translate-y-1/2"></i>
              <InputText
                id="password"
                v-model="password"
                type="password"
                class="p-inputtext-lg custom-input"
                :class="{ 'p-invalid': passwordError }"
                :toggleMask="true"
              />
              <label for="password">New Password</label>
            </span>
            <small v-if="passwordError" class="p-error block mt-2">{{ passwordError }}</small>
          </div>

          <div class="input-group">
            <span class="p-float-label custom-input-container relative">
              <i class="pi pi-lock absolute top-3 left-2 transform -translate-y-1/2"></i>
              <InputText
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                class="p-inputtext-lg custom-input"
                :class="{ 'p-invalid': confirmPasswordError }"
                :toggleMask="true"
              />
              <label for="confirmPassword">Confirm Password</label>
            </span>
            <small v-if="confirmPasswordError" class="p-error block mt-2">{{
              confirmPasswordError
            }}</small>
          </div>

          <div class="password-strength" v-if="password">
            <div class="strength-label">Password Strength:</div>
            <div class="strength-meter">
              <div
                class="strength-progress"
                :style="{ width: `${passwordStrength}%` }"
                :class="strengthClass"
              ></div>
            </div>
            <div class="strength-text" :class="strengthClass">{{ strengthText }}</div>
          </div>

          <div class="mt-6">
            <Button
              type="submit"
              label="RESET PASSWORD"
              icon="pi pi-check"
              class="p-button-lg custom-button w-full"
              :loading="isResetting"
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
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toastService } from '@/services/toastService'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import usePasswordRecorvery from './usePasswordRecorvery'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  (e: 'prev-step'): void
}>()

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const isResetting = ref(false)
const resetSuccess = ref(false)
const userIdFromRoute = ref(route.query.userId as string)
const { updateForgotPassword } = usePasswordRecorvery()

// Password strength calculation
const passwordStrength = computed(() => {
  if (!password.value) return 0

  let strength = 0

  // Length check
  if (password.value.length >= 8) strength += 25

  // Character variety checks
  if (/[A-Z]/.test(password.value)) strength += 25
  if (/[0-9]/.test(password.value)) strength += 25
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 25

  return strength
})

const strengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'weak'
  if (passwordStrength.value < 75) return 'medium'
  return 'strong'
})

const strengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Weak'
  if (passwordStrength.value < 75) return 'Medium'
  return 'Strong'
})

// Reset password
const resetPassword = async () => {
  // Validate password
  if (!password.value) {
    passwordError.value = 'Please enter a new password'
    return
  }

  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return
  }

  if (passwordStrength.value < 75) {
    passwordError.value =
      'Password is not strong enough. Include uppercase, numbers, and special characters.'
    return
  }

  // Validate confirm password
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return
  }

  // Clear errors
  passwordError.value = ''
  confirmPasswordError.value = ''
  isResetting.value = true

  try {
    const response = await updateForgotPassword({
      userId: userIdFromRoute.value,
      newPassword: password.value,
      confirmPassword: confirmPassword.value,
    })
    if (response) {
      resetSuccess.value = true
      toastService.success('Your password has been reset successfully!', {
        title: 'Success',
        duration: 3000
      })
    }
  } catch (_) {
    toastService.error('Failed to process your request', {
      title: 'Error',
      duration: 3000
    })
  } finally {
    isResetting.value = false
  }
}

const goBack = () => {
  emit('prev-step')
}

const goToLogin = () => {
  router.push('/')
}
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

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 0.5rem;
}

.custom-input-container {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100%;
  padding-left: 2.5rem !important;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.custom-input:focus {
  background: white;
}

.password-strength {
  margin-top: 1rem;
}

.strength-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.strength-meter {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.strength-progress {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-progress.weak {
  background-color: #ef4444;
}

.strength-progress.medium {
  background-color: #f59e0b;
}

.strength-progress.strong {
  background-color: #10b981;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.25rem;
  text-align: right;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

.custom-button {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.25);
  transition: all 0.3s ease;
  height: 3.5rem;
}

.custom-button:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
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

/* Success message styling */
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem 0.5rem;
}

.success-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #10b981;
  margin: 1.5rem 0 0.75rem;
}

.success-message {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

/* Animated checkmark */
.success-checkmark {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #10b981;
}

.check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.check-icon::before, .check-icon::after {
  content: '';
  height: 100px;
  position: absolute;
  background: #FFFFFF;
  transform: rotate(-45deg);
}

.check-icon .icon-line {
  height: 5px;
  background-color: #10b981;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.check-icon .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.check-icon .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.check-icon .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(16, 185, 129, 0.3);
}

.check-icon .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: #FFFFFF;
}

@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 46px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
</style>
