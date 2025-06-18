<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicant } from '@/composables/useApplicant'
import type { Admission, RegisterData, ValidateUTMEData } from '@/composables/useApplicant'
// PrimeVue components
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Steps from 'primevue/steps'

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
const activeStep = ref(0)
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
const utmeValidated = ref(false)

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
    admission.value.applicationType.autoLoadUtme === true &&
    !utmeValidated.value
  ) {
    // validate utme first
    loading.value = true
    validateUTME({
        registrationNumber: jambRegNumber.value,
        admissionId: admission.value.id
      })
      .then(() => {
        utmeValidated.value = true
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
      router.push('/')
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
  // Reset UTME validation when admission changes
  utmeValidated.value = false
})

watch(jambRegNumber, () => {
  // Reset UTME validation when JAMB registration number changes
  //utmeValidated.value = false
})

// Keep references to avoid unused variable warnings
void utmeYear.value
void years.value
void dataValid.value
void validateRequired
void loadModeOfEntries

// Stepper navigation
const nextStep = async () => {
  if (await canProceedToNextStep()) {
    activeStep.value++
  }
}

const previousStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// Check if current step data is valid (for button enable/disable)
const isCurrentStepValid = computed(() => {
  const hasConditionalStep = admission.value?.applicationType?.autoLoadUtme || admission.value?.applicationType?.modeOfEntryEnabled

  switch (activeStep.value) {
    case 0: // Application selection
      return admission.value !== null
    case 1:
      if (hasConditionalStep) {
        // UTME/Mode of Entry step
        const utmeValid = !admission.value?.applicationType?.autoLoadUtme || jambRegNumber.value
        const modeValid = !admission.value?.applicationType?.modeOfEntryEnabled || obj.value.modeOfEntryId
        return utmeValid && modeValid
      } else {
        // Email step (when no conditional step)
        return obj.value.emailAddress && validateEmail(obj.value.emailAddress) === true
      }
    case 2:
      if (hasConditionalStep) {
        // Email step (when conditional step exists)
        return obj.value.emailAddress && validateEmail(obj.value.emailAddress) === true
      } else {
        // Password step (when no conditional step)
        return obj.value.password && validatePassword(obj.value.password) === true &&
               obj.value.confirmPassword && obj.value.password === obj.value.confirmPassword
      }
    case 3: // Password step (when conditional step exists)
      return obj.value.password && validatePassword(obj.value.password) === true &&
             obj.value.confirmPassword && obj.value.password === obj.value.confirmPassword
    default:
      return false
  }
})

// Process step transition with UTME validation if needed
const canProceedToNextStep = async () => {
  const hasConditionalStep = admission.value?.applicationType?.autoLoadUtme || admission.value?.applicationType?.modeOfEntryEnabled

  // For UTME step, validate UTME if required
  if (activeStep.value === 1 && hasConditionalStep &&
      admission.value?.applicationType?.autoLoadUtme &&
      jambRegNumber.value && !utmeValidated.value) {
    try {
      loading.value = true
      await validateUTME({
        registrationNumber: jambRegNumber.value,
        admissionId: admission.value.id
      })
      utmeValidated.value = true
      loading.value = false
      return true
    } catch (err) {
      //handleError(err)
      console.log('Err', err)
      loading.value = false
      return false
    }
  }

  return isCurrentStepValid.value
}

const isStepValid = async (stepIndex: number) => {
  const currentActive = activeStep.value
  activeStep.value = stepIndex
  const valid = await canProceedToNextStep()
  activeStep.value = currentActive
  return valid
}

defineEmits([
  'onSwitch',
])

// Computed for dynamic steps
const registrationSteps = computed(() => {
  const steps = [
    { label: 'Application', key: 'application' },
    { label: 'Email', key: 'email' },
    { label: 'Password', key: 'password' }
  ]

  // Insert UTME/Mode step if needed
  if (admission.value?.applicationType?.autoLoadUtme || admission.value?.applicationType?.modeOfEntryEnabled) {
    steps.splice(1, 0, { label: 'Details', key: 'details' })
  }

  return steps
})

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
      <div class="form-container">
        <div class="flex flex-col items-center space-y-2">
          <h1 class="welcome animate-text-focus-in">Apply</h1>
          <h3 class="sub-welcome animate-tracking-in-expand delay-100 mt-8" style="margin-top: 1em;">Start your application below</h3>
        </div>

        <!-- Steps Navigation -->
<!--        <div class="mb-8">-->
<!--          <Steps-->
<!--            :model="registrationSteps"-->
<!--            :activeStep="activeStep"-->
<!--            class="custom-steps"-->
<!--          />-->
<!--        </div>-->

        <form class="flex flex-col gap-6 animate-fade-in-delayed" @submit.prevent="activeStep === registrationSteps.length - 1 ? submitData() : nextStep()">
          <!-- Step 0: Application Selection -->
          <div v-if="activeStep === 0" class="step-content">
            <div class="flex flex-col space-y-2">
              <label for="application" class="text-[#0D47A1] font-medium text-sm">Select Application</label>
              <div class="relative w-full">
                <Dropdown
                  v-model="admission"
                  :options="admissions"
                  optionLabel="name"
                  placeholder="Choose your application type"
                  id="application"
                  class="w-full"
                  :class="{'p-invalid': admission === null && admissions.length > 0}"
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value">
                      {{ slotProps.value.applicationType.name }} {{ slotProps.value.session.name }}
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div>
                      {{ slotProps.option.applicationType.name }} {{ slotProps.option.session.name }}
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>

          <!-- Step 1: UTME/Mode of Entry (conditional) -->
          <div v-else-if="activeStep === 1 && (admission?.applicationType?.autoLoadUtme || admission?.applicationType?.modeOfEntryEnabled)" class="step-content">
            <!-- UTME Number Field -->
            <div
              v-if="admission.applicationType.autoLoadUtme === true"
              class="flex flex-col space-y-2 mb-6"
            >
              <label for="utme" class="text-[#0D47A1] font-medium text-sm">UTME No.</label>
              <div class="relative w-full">
                <InputText
                  v-model="jambRegNumber"
                  id="utme"
                  placeholder="Enter UTME No. or User ID"
                  class="w-full pl-12"
                  :class="{'p-invalid': !jambRegNumber && admission?.applicationType?.autoLoadUtme}"
                />
                <span class="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <i class="pi pi-id-card text-blue-400"></i>
                </span>
              </div>
            </div>

            <!-- Mode of Entry -->
            <div
              v-if="admission.applicationType.modeOfEntryEnabled === true"
              class="flex flex-col space-y-2"
            >
              <label for="modeOfEntry" class="text-[#0D47A1] font-medium text-sm">Mode of Entry</label>
              <div class="relative w-full">
                <Dropdown
                  v-model="obj.modeOfEntryId"
                  :options="modeOfEntries"
                  optionLabel="title"
                  optionValue="id"
                  placeholder="Select Mode of Entry"
                  id="modeOfEntry"
                  class="w-full"
                  :class="{'p-invalid': !obj.modeOfEntryId && admission?.applicationType?.modeOfEntryEnabled}"
                />
              </div>
            </div>
          </div>

          <!-- Step 2/1: Email -->
          <div v-else-if="(activeStep === 2 && (admission?.applicationType?.autoLoadUtme || admission?.applicationType?.modeOfEntryEnabled)) || (activeStep === 1 && !(admission?.applicationType?.autoLoadUtme || admission?.applicationType?.modeOfEntryEnabled))" class="step-content">
            <div class="flex flex-col space-y-2">
              <label for="email" class="text-[#0D47A1] font-medium text-sm">Email Address</label>
              <div class="relative w-full">
                <InputText
                  v-model="obj.emailAddress"
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  class="w-full pl-12"
                  :class="{'p-invalid': obj.emailAddress && validateEmail(obj.emailAddress) !== true}"
                  @blur="validateEmail(obj.emailAddress)"
                />
                <span class="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <i class="pi pi-envelope text-blue-400"></i>
                </span>
              </div>
              <small v-if="obj.emailAddress && validateEmail(obj.emailAddress) !== true" class="p-error animate-fade-in">
                {{ validateEmail(obj.emailAddress) }}
              </small>
            </div>
          </div>

          <!-- Step 3/2: Password & Confirm Password -->
          <div v-else-if="(activeStep === 3 && (admission?.applicationType?.autoLoadUtme || admission?.applicationType?.modeOfEntryEnabled)) || (activeStep === 2 && !(admission?.applicationType?.autoLoadUtme || admission?.applicationType?.modeOfEntryEnabled))" class="step-content">
            <div class="flex flex-col space-y-6">
              <!-- Password -->
              <div class="flex flex-col space-y-2">
                <label for="password" class="text-[#0D47A1] font-medium text-sm">Password</label>
                <div class="relative w-full">
                  <Password
                    v-model="obj.password"
                    :feedback="false"
                    toggleMask
                    id="password"
                    placeholder="Enter your password"
                    class="w-full"
                    :inputClass="{'p-invalid': obj.password && validatePassword(obj.password) !== true}"
                    @blur="validatePassword(obj.password)"
                  />
                </div>
                <small v-if="obj.password && validatePassword(obj.password) !== true" class="p-error animate-fade-in">
                  {{ validatePassword(obj.password) }}
                </small>
              </div>

              <!-- Confirm Password -->
              <div class="flex flex-col space-y-2" style="margin-top: 1.5rem;">
                <label for="confirmPassword" class="text-[#0D47A1] font-medium text-sm">Confirm Password</label>
                <div class="relative w-full">
                  <Password
                    v-model="obj.confirmPassword"
                    :feedback="false"
                    toggleMask
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    class="w-full"
                    :inputClass="{'p-invalid': obj.confirmPassword && obj.password !== obj.confirmPassword}"
                  />
                </div>
                <small v-if="obj.confirmPassword && obj.password !== obj.confirmPassword" class="p-error animate-fade-in">
                  Passwords do not match
                </small>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center gap-4 mt-8">
            <Button
              v-if="activeStep > 0"
              type="button"
              label="Previous"
              severity="secondary"
              outlined
              @click="previousStep"
              class="transition-all duration-300"
            />
            <div v-else></div>

            <Button
              type="submit"
              :label="activeStep === registrationSteps.length - 1 ? 'Complete Registration' : 'Next'"
              :loading="loading"
              :disabled="!isCurrentStepValid || loading"
              class="hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            />
          </div>

          <!-- Switch to Login -->
          <div class="flex flex-col text-center space-y-1 mt-6">
            <span class="text-gray-400">Already applied?</span>
            <div class="flex self-center items-center gap-2">
              <span
                @click="$emit('onSwitch')"
                class="text-blue-700 font-medium hover:text-blue-800 cursor-pointer transition-colors duration-300"
              >
                Login here
              </span>
              <span class="flex transition-transform duration-300 hover:translate-x-1">
                <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </div>
        </form>
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

/* Input field fixes */
:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.p-inputtext.pl-12) {
  padding-left: 3rem;
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

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.p-dropdown:not(.p-disabled):hover .p-dropdown-label) {
  border-color: #0d47a1;
}

:deep(.p-dropdown:not(.p-disabled).p-focus .p-dropdown-label) {
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

:deep(.p-password .p-password-input) {
  padding-left: 3rem;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid:enabled:focus) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

:deep(.p-button) {
  background: #0d47a1;
  border: 1px solid #0d47a1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.p-button:not(:disabled):hover) {
  background: #1565c0;
  border-color: #1565c0;
}

:deep(.p-button:not(:disabled):active) {
  background: #0d47a1;
  border-color: #0d47a1;
}

.p-error {
  color: #ef4444;
}

/* Steps Component Styling */
:deep(.p-steps) {
  padding: 0;
}

:deep(.p-steps .p-steps-list) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

:deep(.p-steps .p-steps-item) {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.p-steps .p-steps-item .p-steps-number) {
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
  background: #0d47a1;
  color: white;
}

:deep(.p-steps .p-steps-item .p-steps-title) {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: none;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-title) {
  color: #0d47a1;
  font-weight: 600;
  display: block;
}

/* Step Content Animation */
.step-content {
  animation: fadeSlideIn 0.5s ease-out;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
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
