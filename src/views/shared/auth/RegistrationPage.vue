<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Removed unused PrimeVue imports - now using native HTML elements for better control
import { useApplicant } from '@/composables/useApplicant'
import type { Admission, RegisterData, ValidateUTMEData } from '@/composables/useApplicant'

const router = useRouter()
const {
  getActiveAdmissions,
  getModeOfEntries,
  validateUTME,
  register: registerApplicant,
  login: loginApplicant,
  loading: apiLoading,
  error: apiError
} = useApplicant()
// Reactive data
const obj = ref({
  emailAddress: '',
  password: '',
  confirmPassword: '',
  modeOfEntryId: null,
  admissionId: null,
  jambRegNumber: null
})

const jambRegNumber = ref(null)
const utmeYear = ref('')
const messageType = ref('')
const message = ref('')
const messageShow = ref(false)
const loading = ref(false)
const admissions = ref<Admission[]>([])
const admission = ref<Admission | null>(null)
const modeOfEntries = ref<Array<{ id: number; title: string }>>([])
const registering = ref(true)
const years = ref<number[]>([])
const dataValid = ref(true)
const loginValid = ref(true)
const loginLoading = ref(false)
const showPassword = ref(false)
const showPasswordC = ref(false)
const showPasswordLogin = ref(false)
const user = ref({
  username: '',
  password: '',
  applicant: true
})
const usingOldReg = ref(false)
const newRegMessage = ref('')

// Validation rules
// Removed unused validation rule imports

// Error handling
const handleError = (err: any) => {
  const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred'
  message.value = errorMessage
  messageType.value = 'error'
  messageShow.value = true
}

// Methods
const getAdmissions = () => {
  loading.value = true
  getActiveAdmissions()
    .then((res) => {
      admissions.value = res.data
    })
    .catch((err) => handleError(err))
    .finally(() => (loading.value = false))
}

const loadModeOfEntries = () => {
  if (admission.value != null) {
    modeOfEntries.value = []
    getModeOfEntries(admission.value.session.programmeType.id)
      .then((res) => (modeOfEntries.value = res.data))
      .catch((err) => handleError(err))
  }
}

const submitData = () => {
  if (
    admission.value != null &&
    admission.value.applicationType.autoLoadUtme === true
  ) {
    // validate utme first
    loading.value = true
    validateUTME({
        registrationNumber: jambRegNumber.value,
        admissionId: admission.value.id
      })
      .then(() => {
        registerUser()
      })
      .catch((err) => {
        handleError(err)
        loading.value = false
      })
  } else {
    // go ahead with registration
    registerUser()
  }
}

const registerUser = () => {
  loading.value = true
  obj.value.admissionId = admission.value?.id || 0
  obj.value.jambRegNumber = jambRegNumber.value
  registerApplicant(obj.value as RegisterData)
    .then(() => {
      message.value = 'Account created successfully'
      messageType.value = 'success'
      messageShow.value = true
      registering.value = false
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => (loading.value = false))
}

const login = () => {
  // input must be valid
  if (!loginValid.value) return

  loginLoading.value = true
  loginApplicant({
      email: user.value.username,
      password: user.value.password
    })
    .then((res) => {
      // Auth service handles token storage automatically
      // Check if user has applicant role
      const roles = JSON.parse(sessionStorage.getItem('roles') || '[]')
      if (!roles.some((role: string) => role.toLowerCase() === 'applicant')) {
        window.location.href = '/login'
        return
      }

      // Redirect to application dashboard
      window.location.href = '/application#/dashboard'
      // reload
      ;(window as unknown as any).canReload = true
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => {
      loginLoading.value = false
    })
}

const validateEmail = (value: string) => {
  if (!value) return 'Email is required'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value)) return 'Enter a valid email'
  return true
}

const validatePassword = (value: string) => {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return true
}

const validateRequired = (value: any) => {
  if (!value) return 'This field is required'
  return true
}

const isFormValid = computed(() => {
  if (registering.value) {
    return (
      admission.value != null &&
      validateEmail(obj.value.emailAddress) === true &&
      validatePassword(obj.value.password) === true &&
      obj.value.password === obj.value.confirmPassword &&
      (!admission.value?.applicationType?.autoLoadUtme || jambRegNumber.value) &&
      (!admission.value?.applicationType?.modeOfEntryEnabled || obj.value.modeOfEntryId)
    )
  } else {
    return user.value.username && user.value.password
  }
})

// Watchers
watch(admission, (val) => {
  if (val != null && val.applicationType.modeOfEntryEnabled) {
    modeOfEntries.value = val.applicationType.modeOfEntries || []
  }
})

// Keep references to avoid unused variable warnings
void utmeYear.value
void years.value
void dataValid.value
void validateRequired
void loadModeOfEntries

// Lifecycle
onMounted(() => {
  getAdmissions()
})
</script>

<template>
  <div class="flex flex-col p-6 sm:p-12 bg-white gap-8 rounded-xl justify-center shadow-2xl transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-1 relative overflow-hidden lg:w-9/10">
    <!-- Background floating elements -->
    <div class="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-50 opacity-70 animate-float-1"></div>
    <div class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-100 opacity-50 animate-float-2"></div>
    <div class="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-blue-200 opacity-30 animate-float-3"></div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Message Display -->
    <div v-if="messageShow" class="message-container" :class="messageType">
      <div class="message-content">
        <i :class="messageType === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
        <span>{{ message }}</span>
        <button @click="messageShow = false" class="message-close">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
    
    <div class="p-4 sm:p-8 flex flex-col gap-12 z-10 relative">
      <!-- Registration Form -->
      <div v-if="registering" class="form-container">
        <div class="flex flex-col items-center space-y-2">
          <h1 class="welcome animate-text-focus-in">Apply</h1>
          <h3 class="sub-welcome animate-tracking-in-expand delay-100">Start your application below</h3>
        </div>

        <form class="flex flex-col gap-6 animate-fade-in-delayed" @submit.prevent="submitData">
          <div class="flex flex-col gap-6">
            <!-- Application Selection -->
            <div class="flex flex-col space-y-2">
              <div class="relative w-full">
                <select
                  v-model="admission"
                  class="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  :class="{'border-red-500': admission === null && admissions.length > 0}"
                  required
                >
                  <option value="" disabled>Select Application</option>
                  <option
                    v-for="adm in admissions"
                    :key="adm.id"
                    :value="adm"
                  >
                    {{ adm.applicationType.name }} {{ adm.session.name }}
                  </option>
                </select>
                <span class="absolute top-3 right-3">
                  <i class="pi pi-chevron-down text-blue-400"></i>
                </span>
              </div>
            </div>

            <!-- UTME Number Field (conditional) -->
            <div
              v-if="admission != null && admission.applicationType.autoLoadUtme === true"
              class="flex flex-col space-y-2"
            >
              <div class="relative w-full">
                <input
                  v-model="jambRegNumber"
                  type="text"
                  class="w-full p-3 pl-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Enter UTME No. or User ID"
                  :class="{'border-red-500': !jambRegNumber && admission?.applicationType?.autoLoadUtme}"
                  required
                />
                <span class="absolute top-3 left-3">
                  <i class="pi pi-id-card text-blue-400"></i>
                </span>
              </div>
            </div>

            <!-- Mode of Entry (conditional) -->
            <div
              v-if="admission != null && admission.applicationType.modeOfEntryEnabled === true"
              class="flex flex-col space-y-2"
            >
              <div class="relative w-full">
                <select
                  v-model="obj.modeOfEntryId"
                  class="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  :class="{'border-red-500': !obj.modeOfEntryId && admission?.applicationType?.modeOfEntryEnabled}"
                  required
                >
                  <option value="" disabled>Select Mode of Entry</option>
                  <option
                    v-for="mode in modeOfEntries"
                    :key="mode.id"
                    :value="mode.id"
                  >
                    {{ mode.title }}
                  </option>
                </select>
                <span class="absolute top-3 right-3">
                  <i class="pi pi-chevron-down text-blue-400"></i>
                </span>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col space-y-2">
              <div class="relative w-full">
                <input
                  v-model="obj.emailAddress"
                  type="email"
                  class="w-full p-3 pl-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Enter your email"
                  :class="{'border-red-500': obj.emailAddress && validateEmail(obj.emailAddress) !== true}"
                  @blur="validateEmail(obj.emailAddress)"
                  required
                />
                <span class="absolute top-3 left-3">
                  <i class="pi pi-envelope text-blue-400"></i>
                </span>
              </div>
              <small v-if="obj.emailAddress && validateEmail(obj.emailAddress) !== true" class="text-red-500 animate-fade-in">
                {{ validateEmail(obj.emailAddress) }}
              </small>
            </div>

            <!-- Password -->
            <div class="flex flex-col space-y-2">
              <div class="relative w-full">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="obj.password"
                  class="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Enter your password"
                  :class="{'border-red-500': obj.password && validatePassword(obj.password) !== true}"
                  @blur="validatePassword(obj.password)"
                  required
                />
                <span class="absolute top-3 left-3">
                  <i class="pi pi-lock text-blue-400"></i>
                </span>
                <span class="absolute top-3 right-3 cursor-pointer hover:text-blue-600" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-blue-400"></i>
                </span>
              </div>
              <small v-if="obj.password && validatePassword(obj.password) !== true" class="text-red-500 animate-fade-in">
                {{ validatePassword(obj.password) }}
              </small>
            </div>

            <!-- Confirm Password -->
            <div class="flex flex-col space-y-2">
              <div class="relative w-full">
                <input
                  :type="showPasswordC ? 'text' : 'password'"
                  v-model="obj.confirmPassword"
                  class="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Confirm your password"
                  :class="{'border-red-500': obj.confirmPassword && obj.password !== obj.confirmPassword}"
                  required
                />
                <span class="absolute top-3 left-3">
                  <i class="pi pi-lock text-blue-400"></i>
                </span>
                <span class="absolute top-3 right-3 cursor-pointer hover:text-blue-600" @click="showPasswordC = !showPasswordC">
                  <i :class="showPasswordC ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-blue-400"></i>
                </span>
              </div>
              <small v-if="obj.confirmPassword && obj.password !== obj.confirmPassword" class="text-red-500 animate-fade-in">
                Passwords do not match
              </small>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col gap-6">
            <div class="flex flex-col space-y-4">
              <button
                type="submit"
                class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="!isFormValid || loading"
              >
                <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                <span v-else>Proceed</span>
              </button>
            </div>

            <!-- Switch to Login -->
            <div class="flex flex-col text-center space-y-1">
              <span class="text-gray-400">Already applied?</span>
              <div class="flex self-center items-center gap-2">
                <span
                  @click="registering = false"
                  class="text-blue-700 font-medium hover:text-blue-800 cursor-pointer transition-colors duration-300"
                >
                  Login here
                </span>
                <span class="flex transition-transform duration-300 hover:translate-x-1">
                  <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Login Form -->
      <div v-else class="form-container">
        <div class="flex flex-col items-center space-y-2">
          <h1 class="welcome animate-text-focus-in">Welcome back</h1>
          <h3 class="sub-welcome animate-tracking-in-expand delay-100">Access your application</h3>
        </div>

        <div class="flex flex-col gap-6 animate-fade-in-delayed">
          <!-- Login Alert for Old Registration -->
          <div v-if="usingOldReg" class="bg-blue-50 border border-blue-300 rounded-lg p-3 flex items-center gap-2 text-blue-700">
            <i class="pi pi-info-circle"></i>
            <span>{{ newRegMessage }}</span>
          </div>

          <form class="flex flex-col gap-6" @submit.prevent="login">
            <div class="flex flex-col gap-6">
              <!-- Username -->
              <div class="flex flex-col space-y-2">
                <div class="relative w-full">
                  <input
                    v-model="user.username"
                    type="text"
                    class="w-full p-3 pl-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Enter your username"
                    @keyup.enter="login"
                    required
                  />
                  <span class="absolute top-3 left-3">
                    <i class="pi pi-user text-blue-400"></i>
                  </span>
                </div>
              </div>

              <!-- Password -->
              <div class="flex flex-col space-y-2">
                <div class="relative w-full">
                  <input
                    :type="showPasswordLogin ? 'text' : 'password'"
                    v-model="user.password"
                    class="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Enter your password"
                    @keyup.enter="login"
                    required
                  />
                  <span class="absolute top-3 left-3">
                    <i class="pi pi-lock text-blue-400"></i>
                  </span>
                  <span class="absolute top-3 right-3 cursor-pointer hover:text-blue-600" @click="showPasswordLogin = !showPasswordLogin">
                    <i :class="showPasswordLogin ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-blue-400"></i>
                  </span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex flex-col gap-6">
              <div class="flex flex-col space-y-4">
                <button
                  type="submit"
                  class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  :disabled="!user.username || !user.password || loginLoading"
                >
                  <span v-if="loginLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  <span v-else>Login</span>
                </button>
                <a
                  href="/login"
                  class="text-center text-blue-700 hover:text-blue-800 cursor-pointer transition-colors duration-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <!-- Application link -->
              <div class="flex flex-col text-center space-y-1">
                <span class="text-gray-400">Start your application</span>
                <div class="flex self-center items-center gap-2">
                  <span
                    @click="registering = true"
                    class="text-blue-700 font-medium hover:text-blue-800 cursor-pointer transition-colors duration-300"
                  >
                    Apply here
                  </span>
                  <span class="flex transition-transform duration-300 hover:translate-x-1">
                    <i class="pi pi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #0d47a1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Message Container */
.message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.message-container.success {
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
}

.message-container.error {
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  margin-left: auto;
  padding: 4px;
  border-radius: 4px;
  transition: opacity 0.3s ease;
}

.message-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Floating animations */
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

.animate-fade-in {
  animation: fade-in 0.3s ease both;
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

/* Responsive Design */
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

@media (max-width: 480px) {
  .welcome {
    font-size: 28px;
    line-height: 36px;
  }

  .sub-welcome {
    font-size: 16px;
    line-height: 20px;
  }

  .message-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
