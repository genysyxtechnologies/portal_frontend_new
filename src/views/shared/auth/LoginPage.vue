<template>
  <div
    class="flex flex-col p-6 sm:p-12 bg-white gap-8 rounded-xl justify-center shadow-2xl transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-1 relative overflow-hidden lg:w-9/10"
  >
    <!-- Background floating elements -->
    <div
      class="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-50 opacity-70 animate-float-1"
    ></div>
    <div
      class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-100 opacity-50 animate-float-2"
    ></div>
    <div
      class="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-blue-200 opacity-30 animate-float-3"
    ></div>

    <Toa-st class="z-20" />
    <div class="p-4 sm:p-8 flex flex-col gap-12 z-10 relative">
      <div class="flex flex-col items-center space-y-2">
        <h1 class="welcome animate-text-focus-in">Welcome back</h1>
        <h3 class="sub-welcome animate-tracking-in-expand delay-100">
          Login to your account below
        </h3>
      </div>

      <div class="flex flex-col gap-6 animate-fade-in-delayed">
        <div v-if="!isMfa" class="flex flex-col gap-6">
          <div class="flex flex-col space-y-2">
            <div class="relative w-full">
              <FloatLabel>
                <InputText
                  v-model="credentials.email"
                  id="username"
                  class="w-full"
                  :class="{
                    'p-invalid': usernameError || invalidCredentials,
                    'shake-animation': usernameError || invalidCredentials,
                  }"
                  @input="resetErrors"
                />
                <label for="username" class="text-[#0D47A1] font-medium">Username or Email</label>
              </FloatLabel>
              <span class="absolute top-4 right-4">
                <i class="pi pi-user text-blue-400"></i>
              </span>
            </div>
            <small v-if="usernameError" class="p-error animate-fade-in">Username is required</small>
          </div>

          <!-- Password field -->
          <div class="flex flex-col space-y-2">
            <div class="relative w-full">
              <FloatLabel>
                <Pass-word
                  v-model="credentials.password"
                  :feedback="false"
                  toggleMask
                  id="password"
                  class="w-full"
                  :inputClass="{
                    'p-invalid': passwordError || invalidCredentials,
                    'shake-animation': passwordError || invalidCredentials,
                  }"
                  @input="resetErrors"
                />
                <label for="password" class="text-[#0D47A1] font-medium">Password</label>
              </FloatLabel>
            </div>
            <small v-if="passwordError" class="p-error animate-fade-in">Password is required</small>
            <small v-if="invalidCredentials" class="p-error animate-fade-in">{{ message }}</small>
          </div>
        </div>

        <!-- MFA OTP Section -->
        <div v-if="isMfa" class="flex flex-col animate-fade-in" style="margin-top: 10px;">
          <div class="flex flex-col items-center text-center" style="gap: 32px; padding: 40px 20px;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse" style="margin-bottom: 8px;">
                <i class="pi pi-shield text-3xl text-[#0D47A1]"></i>
              </div>
              <h3 class="text-2xl font-semibold text-[#0D47A1]" style="margin: 0; line-height: 1.3;">Two-Factor Authentication</h3>
              <p class="text-gray-600" style="margin: 0; font-size: 16px; line-height: 1.4; max-width: 300px;">Please enter the 6-digit code from your authenticator app</p>
            </div>

            <div class="w-full max-w-sm" style="display: flex; flex-direction: column; gap: 24px;">
              <InputOtp v-model="otpValue" :length="6" class="justify-center" style="gap: 8px;" />

              <ReUsableButtons
                :label="'Verify Code'"
                @on-click="verifyMfa"
                :loading="isLoading"
                :disabled="isLoading || !otpValue || otpValue.length < 6"
                class="w-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                style="margin-top: 8px;"
              />
            </div>

            <button
              @click="isMfa = false"
              class="text-sm text-gray-500 hover:text-[#0D47A1] transition-colors duration-300"
              style="margin-top: 16px; display: flex; align-items: center; gap: 6px;"
            >
              <i class="pi pi-arrow-left"></i>
              Back to login
            </button>
          </div>
        </div>

        <!-- Buttons with hover effects -->
        <div v-if="!isMfa" class="flex flex-col gap-6">
          <div class="flex flex-col space-y-4">
            <ReUsableButtons
              :label="'Login'"
              @on-click="login"
              :loading="isLoading"
              :disabled="isLoading"
              class="hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            />
            <router-link
              to="/forgot-password"
              style="margin-top: 10px;"
              class="text-center text-[#0D47A1] hover:text-[#1565C0] cursor-pointer transition-colors duration-300 hover:underline"
            >
              Forget password?
            </router-link>
          </div>

          <!-- Application link with smooth arrow animation -->
          <div class="flex flex-col text-center space-y-1">
            <span class="text-[#BFBFBF]">Start your application</span>
            <div class="flex self-center items-center gap-2">
              <span
                @click="$emit('on-switch')"
                class="text-[#0D47A1] font-medium hover:text-[#1565C0] cursor-pointer transition-colors duration-300"
              >
                Apply here
              </span>
              <span class="flex transition-transform duration-300 hover:translate-x-1">
                <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="loginSuccess"
        class="absolute inset-0 bg-white z-50 bg-opacity-90 flex flex-col items-center justify-center rounded-xl"
      >
        <div class="animate-checkmark">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-semibold text-[#0D47A1] animate-fade-in">Login Successful!</h3>
        <p class="text-gray-600 animate-fade-in delay-100">Redirecting to your dashboard...</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/services/student/useAuth'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import { anyContains } from '@/utils/permissions/roles.ts'
import { useRouter } from 'vue-router'
import FloatLabel from 'primevue/floatlabel'
import InputOtp from 'primevue/inputotp'
import type { MFASubmission } from '@/types/auth.ts'

const {
  handleUserLogin,
  processMfa,
  credentials,
  message,
  usernameError,
  passwordError,
  isLoading,
} = useAuth()
const router = useRouter()

const loginSuccess = ref(false)
const isMfa = ref(false)
const otpValue = ref<string>('')
const invalidCredentials = computed(() => message.value?.toLowerCase().includes('invalid'))

const resetErrors = () => {
  usernameError.value = false
  passwordError.value = false
}

const validateForm = () => {
  let isValid = true

  if (!credentials.value.email.trim()) {
    usernameError.value = true
    isValid = false
  }

  if (!credentials.value.password.trim()) {
    passwordError.value = true
    isValid = false
  }

  return isValid
}

const login = async () => {
  resetErrors()

  if (!validateForm()) {
    return
  }

  try {
    const d = await handleUserLogin()
    // check if it's mfa
    if(d.success){
      // console.log(d)
      if(d.data.mfa){
        isMfa.value = true
      } else{
        loginSuccess.value = true
        if (anyContains(['student'], (d.data as { roles: string[] }).roles)) {

          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        }  else if (anyContains(['admin', 'super_admin'], (d.data as { roles: string[] }).roles)) {
          setTimeout(() => {
            window.location.href = '/main'
          }, 1500)
        } else if (anyContains(['applicant'], (d.data as { roles: string[] }).roles)) {
          setTimeout(() => {
            window.location.href = '/applications'
          }, 1500)
        } else{
          setTimeout(() => {
            window.location.href = '/officer'
          }, 1500)
        }
      }
    }
  } catch (error) {
    return error
  }
}

const verifyMfa = async () => {
  try {
    const r: MFASubmission = {
      userId: credentials.value.email,
      code: otpValue.value,
      recovery: null
    }
    const d = await processMfa(r)
    loginSuccess.value = true
    if (anyContains(['dashboard'], (d.data as { roles: string[] }).roles)) {
      setTimeout(() => {
        router.push('/student')
      }, 1500)
    } else if (anyContains(['admin', 'super_admin'], (d.data as { roles: string[] }).roles)) {
      setTimeout(() => {
        window.location.href = '/main'
      }, 1500)
    } else if (anyContains(['applicant'], (d.data as { roles: string[] }).roles)) {
      setTimeout(() => {
        window.location.href = '/applications'
      }, 1500)
    } else{
      setTimeout(() => {
        window.location.href = '/officer'
      }, 1500)
    }
  } catch (error) {
    return error
  }
}
</script>

<style scoped>

.welcome {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: #0d47a1;
  text-shadow: 0 2px 4px rgba(13, 71, 161, 0.1);
}

.sub-welcome {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #434343;
}

/* Input field fixes */
:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.p-inputtext:enabled:hover) {
  border-color: #0d47a1;
}

:deep(.p-inputtext:enabled:focus) {
  border-color: #0d47a1;
  box-shadow: 0 0 0 2px rgba(13, 71, 161, 0.2);
  outline: none;
  background: white;
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid:enabled:focus) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

.p-error {
  color: #ef4444;
}

/* OTP Input Styling */
:deep(.p-inputotp) {
  gap: 0.5rem;
}

:deep(.p-inputotp-input) {
  width: 3rem;
  height: 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

:deep(.p-inputotp-input:focus) {
  border-color: #0d47a1;
  box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1);
  background: white;
  transform: scale(1.05);
}

:deep(.p-inputotp-input:hover) {
  border-color: #1565c0;
  background: rgba(13, 71, 161, 0.02);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-6px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(6px);
  }
}

.shake-animation {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

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

/* Text animations */
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

/* Checkmark animation */
.checkmark {
  width: 80px;
  height: 80px;
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
  stroke-miterlimit: 10;
  stroke: #0d47a1;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-checkmark {
  animation: scale 0.3s ease-in-out 0.9s both;
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

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .welcome {
    font-size: 32px;
    line-height: 40px;
  }

  .sub-welcome {
    font-size: 18px;
    line-height: 22px;
  }
}
</style>
