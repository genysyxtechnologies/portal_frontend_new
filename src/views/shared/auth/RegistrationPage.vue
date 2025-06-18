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
  <div class="auth-background">
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
    
    <!-- Registration Form -->
    <div v-if="registering" class="form-container">
        <div class="form-header">
          <h1 class="form-title">Apply</h1>
          <p class="form-subtitle">Start your application below</p>
        </div>

        <form class="form-content" @submit.prevent="submitData">
          <!-- Application Selection -->
          <div class="form-group">
            <label class="form-label">Application</label>
            <div class="select-wrapper">
              <select
                v-model="admission"
                class="form-select"
                :class="{'error': admission === null && admissions.length > 0}"
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
              <i class="pi pi-chevron-down select-icon"></i>
            </div>
          </div>

          <!-- UTME Number Field (conditional) -->
          <div
            v-if="admission != null && admission.applicationType.autoLoadUtme === true"
            class="form-group"
          >
            <label class="form-label">UTME No. or User ID</label>
            <div class="input-wrapper">
              <input
                v-model="jambRegNumber"
                type="text"
                class="form-input"
                placeholder="Enter UTME No. or User ID"
                :class="{'error': !jambRegNumber && admission?.applicationType?.autoLoadUtme}"
                required
              />
              <i class="pi pi-id-card input-icon"></i>
            </div>
          </div>

          <!-- Mode of Entry (conditional) -->
          <div
            v-if="admission != null && admission.applicationType.modeOfEntryEnabled === true"
            class="form-group"
          >
            <label class="form-label">Mode of Entry</label>
            <div class="select-wrapper">
              <select
                v-model="obj.modeOfEntryId"
                class="form-select"
                :class="{'error': !obj.modeOfEntryId && admission?.applicationType?.modeOfEntryEnabled}"
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
              <i class="pi pi-chevron-down select-icon"></i>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper">
              <input
                v-model="obj.emailAddress"
                type="email"
                class="form-input"
                placeholder="Enter your email"
                :class="{'error': obj.emailAddress && validateEmail(obj.emailAddress) !== true}"
                @blur="validateEmail(obj.emailAddress)"
                required
              />
              <i class="pi pi-envelope input-icon"></i>
            </div>
            <span v-if="obj.emailAddress && validateEmail(obj.emailAddress) !== true" class="error-message">
              {{ validateEmail(obj.emailAddress) }}
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="obj.password"
                class="form-input"
                placeholder="Enter your password"
                :class="{'error': obj.password && validatePassword(obj.password) !== true}"
                @blur="validatePassword(obj.password)"
                required
              />
              <i
                :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="input-icon clickable"
                @click="showPassword = !showPassword"
              ></i>
            </div>
            <span v-if="obj.password && validatePassword(obj.password) !== true" class="error-message">
              {{ validatePassword(obj.password) }}
            </span>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">Confirm password</label>
            <div class="input-wrapper">
              <input
                :type="showPasswordC ? 'text' : 'password'"
                v-model="obj.confirmPassword"
                class="form-input"
                placeholder="Confirm your password"
                :class="{'error': obj.confirmPassword && obj.password !== obj.confirmPassword}"
                required
              />
              <i
                :class="showPasswordC ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="input-icon clickable"
                @click="showPasswordC = !showPasswordC"
              ></i>
            </div>
            <span v-if="obj.confirmPassword && obj.password !== obj.confirmPassword" class="error-message">
              Passwords do not match
            </span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            :disabled="!isFormValid || loading"
          >
            <span v-if="loading" class="button-spinner"></span>
            <span v-else>Proceed</span>
          </button>

          <!-- Switch to Login -->
          <div class="form-switch">
            <span class="switch-text">Already applied?</span>
            <button
              type="button"
              @click="registering = false"
              class="switch-link"
            >
              Login <i class="pi pi-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

    <!-- Login Form -->
    <div v-else class="form-container">
        <div class="form-header">
          <h1 class="form-title">Login</h1>
          <p class="form-subtitle">Access your application</p>
        </div>

        <!-- Login Alert for Old Registration -->
        <div v-if="usingOldReg" class="alert-banner">
          <i class="pi pi-info-circle"></i>
          <span>{{ newRegMessage }}</span>
        </div>

        <form class="form-content" @submit.prevent="login">
          <!-- Username -->
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-wrapper">
              <input
                v-model="user.username"
                type="text"
                class="form-input"
                placeholder="Enter your username"
                @keyup.enter="login"
                required
              />
              <i class="pi pi-user input-icon"></i>
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <input
                :type="showPasswordLogin ? 'text' : 'password'"
                v-model="user.password"
                class="form-input"
                placeholder="Enter your password"
                @keyup.enter="login"
                required
              />
              <i
                :class="showPasswordLogin ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="input-icon clickable"
                @click="showPasswordLogin = !showPasswordLogin"
              ></i>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            :disabled="!user.username || !user.password || loginLoading"
          >
            <span v-if="loginLoading" class="button-spinner"></span>
            <span v-else>Login</span>
          </button>

          <!-- Form Footer -->
          <div class="form-footer">
            <button
              type="button"
              @click="registering = true"
              class="footer-link"
            >
              Apply
            </button>
            <span class="footer-divider">or</span>
            <a
              href="/login"
              class="footer-link"
            >
              Reset password
            </a>
          </div>
        </form>
    </div>
  </div>
</template>

<style scoped>
/* Background - This is now the card container */
.auth-background {
  background: #ffffff;
  min-height: 100vh;
  width: 100%;
  padding: 40px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  border-radius: 24px;
  transition: all 0.3s ease;
  position: relative;
  max-width: 500px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-background:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Form Container */
.form-container {
  width: 100%;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

/* Form Content */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.form-input.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input.error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

/* Input Icons */
.input-icon {
  position: absolute;
  left: 16px;
  color: #6b7280;
  font-size: 1.1rem;
  z-index: 1;
  transition: color 0.3s ease;
}

.input-icon.clickable {
  cursor: pointer;
  right: 16px;
  left: auto;
}

.input-icon.clickable:hover {
  color: #2563eb;
}

.form-input:focus + .input-icon {
  color: #2563eb;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-select {
  width: 100%;
  padding: 16px 48px 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.3s ease;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.form-select.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.select-icon {
  position: absolute;
  right: 16px;
  color: #6b7280;
  font-size: 1rem;
  pointer-events: none;
  transition: color 0.3s ease;
}

.form-select:focus + .select-icon {
  color: #2563eb;
}

/* Submit Button */
.submit-button {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(245, 158, 11, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Button Spinner */
.button-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Form Switch */
.form-switch {
  text-align: center;
  margin-top: 8px;
}

.switch-text {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-right: 8px;
}

.switch-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.switch-link:hover {
  color: #1d4ed8;
}

/* Form Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.footer-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #1d4ed8;
}

.footer-divider {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Error Message */
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
}

/* Alert Banner */
.alert-banner {
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: #1e40af;
  font-size: 0.875rem;
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
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

/* Responsive Design */
@media (max-width: 480px) {
  .auth-background {
    padding: 32px 24px;
    border-radius: 20px;
    margin: 10px;
  }

  .form-title {
    font-size: 2rem;
  }

  .form-input, .form-select {
    padding: 14px 18px 14px 44px;
  }

  .submit-button {
    padding: 14px 20px;
  }

  .message-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
