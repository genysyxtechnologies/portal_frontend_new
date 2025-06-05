<template>
  <div class="forgot-password-container">
    <!-- Background animated elements -->
    <div class="bg-element bg-element-1"></div>
    <div class="bg-element bg-element-2"></div>
    <div class="bg-element bg-element-3"></div>
    <div class="bg-element bg-element-4"></div>
    <div class="bg-element bg-element-5"></div>
    <div class="bg-element bg-element-6"></div>

    <div
      class="auth-layout"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
    >
      <!-- Image section -->
      <div
        class="image-container"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800, ease: 'easeOut' } }"
      >
        <div class="image-frame">
          <img :src="image" alt="Password Recovery" class="auth-image floating-image" />
        </div>
        <div class="image-overlay">
          <div class="overlay-content">
            <h2 class="overlay-title">Secure Account Recovery</h2>
            <p class="overlay-text">
              We'll help you regain access to your account with our secure verification process.
            </p>
          </div>
        </div>
      </div>

      <!-- Form section -->
      <Ca-rd class="auth-card p-6 shadow-xl">
        <template #header>
          <div class="card-header text-center mb-5">
            <div class="logo-container mb-3">
              <div class="logo-circle">
                <i class="pi pi-lock text-3xl"></i>
              </div>
            </div>
            <h1
              class="text-2xl font-bold text-primary mb-3"
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { delay: 200, duration: 500 } }"
            >
              Password Recovery
            </h1>
            <p
              class="text-gray-600 max-w-md mx-auto"
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { delay: 400, duration: 500 } }"
            >
              Enter your user ID to receive a verification code
            </p>
          </div>
        </template>

        <template #content>
          <form @submit.prevent="handleSubmit" class="space-y-6 px-2">
            <div
              class="form-group"
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 600, duration: 500 } }"
            >
              <h3 class="form-title mb-2">Enter Your Credentials</h3>
              <p class="form-subtitle mb-4">
                We'll send a verification code to your registered contact
              </p>

              <div class="input-wrapper">
                <span class="p-float-label custom-input-container relative">
                  <div class="input-icon-wrapper">
                    <i class="pi pi-user input-icon"></i>
                  </div>
                  <InputText
                    id="userId"
                    v-model="userId"
                    class="w-full p-inputtext-lg custom-input pl-10"
                    :class="{ 'p-invalid': userIdError }"
                    @keyup.enter="handleSubmit"
                    autocomplete="username"
                    ref="userIdInput"
                  />
                  <label for="userId" class="pl-10">User ID or Email</label>
                </span>
              </div>
              <small v-if="userIdError" class="p-error block mt-2 error-message">
                <i class="pi pi-exclamation-circle mr-1"></i>
                {{ userIdError }}
              </small>
            </div>

            <div
              class="button-container mt-8"
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { delay: 800, duration: 500 } }"
            >
              <ReUsableButtons
                @on-click="handleSubmit"
                type="submit"
                label="Verify Identity"
                icon="pi pi-user-edit"
                class="w-full p-button-lg custom-button elevation-3"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              />
            </div>

            <div
              v-if="apiError"
              class="p-message p-message-error p-3 mt-4 rounded-lg shadow-md"
              v-motion
              :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
            >
              <i class="pi pi-exclamation-triangle mr-2"></i>
              <span class="p-message-text">{{ apiError }}</span>
            </div>

            <div
              v-if="successMessage"
              class="p-message p-message-success p-3 mt-4 rounded-lg shadow-md"
              v-motion
              :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
            >
              <i class="pi pi-check-circle mr-2"></i>
              <span class="p-message-text">{{ successMessage }}</span>
            </div>
          </form>
        </template>

        <template #footer>
          <div
            class="auth-links text-center space-y-3 mt-8 border-t pt-6"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 1000, duration: 500 } }"
          >
            <p class="text-gray-600">
              Remember your password?
              <router-link
                to="/"
                class="text-primary hover:text-primary-dark transition-colors duration-300 hover:underline font-medium"
              >
                Sign in
              </router-link>
            </p>
            <p class="text-gray-600">
              Don't have an account?
              <router-link
                to="/auth/register"
                class="text-primary hover:text-primary-dark transition-colors duration-300 hover:underline font-medium"
              >
                Register
              </router-link>
            </p>
          </div>
        </template>
      </Ca-rd>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/api/authService'
import { useToast } from 'primevue/usetoast'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import image from '../../../assets/images/auth/image1.png'

const router = useRouter()
const toast = useToast()

// Form state
const userId = ref('')
const userIdError = ref('')
const isSubmitting = ref(false)
const apiError = ref('')
const successMessage = ref('')

// Animation state
const formMounted = ref(false)

onMounted(() => {
  formMounted.value = true
  // Auto-focus  input field
  setTimeout(() => {
    const inputElement = document.getElementById('userId')
    if (inputElement) {
      inputElement.focus()
    }
  }, 800)
})

// Validate user ID format
const validateUserId = (id: string): boolean => {
  if (id.length < 3) {
    userIdError.value = 'User ID must be at least 3 characters long'
    return false
  }

  return true
}

const handleSubmit = async (): Promise<void> => {
  // Reset errors
  userIdError.value = ''
  apiError.value = ''
  successMessage.value = ''

  // Validate user ID
  if (!userId.value.trim()) {
    userIdError.value = 'User ID is required'
    return
  }

  // Additional validation
  if (!validateUserId(userId.value)) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await authService.verifyUserId(userId.value)

    if (response.success) {
      // Show success message
      successMessage.value = response.message || 'Verification code sent successfully!'

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Verification code has been sent to your registered contact',
        life: 3000,
      })

      // Redirect to OTP verification page after a short delay
      setTimeout(() => {
        router.push({
          name: 'OTPVerification',
          query: { userId: userId.value },
        })
      }, 2000)
    } else {
      // Show error message
      apiError.value = response.message || 'Failed to verify user ID'

      // Show toast notification
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: apiError.value,
        life: 5000,
      })
    }
  } catch (error) {
    const errorMessage = 'An error occurred. Please try again.'
    apiError.value = errorMessage

    // Show toast notification
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000,
    })

    console.error('Error verifying user ID:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>

.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d8e2f3 50%, #e6e9f0 100%);
  padding: 0;
  position: relative;
  overflow: hidden;
}

/* Background animated elements */
.bg-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  z-index: 0;
}

.bg-element-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.1) 70%);
  top: -100px;
  left: -100px;
  animation: float-slow 15s infinite alternate ease-in-out;
}

.bg-element-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.1) 70%);
  bottom: -50px;
  right: -50px;
  animation: float-slow 18s infinite alternate-reverse ease-in-out;
}

.bg-element-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.1) 70%);
  top: 40%;
  left: 10%;
  animation: float-slow 20s infinite alternate ease-in-out;
}

.bg-element-4 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(219, 39, 119, 0.1) 70%);
  top: 30%;
  right: 10%;
  animation: float-slow 25s infinite alternate-reverse ease-in-out;
}

.bg-element-5 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(2, 132, 199, 0.08) 70%);
  bottom: 10%;
  left: 20%;
  animation: float-slow 22s infinite alternate ease-in-out;
}

.bg-element-6 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.05) 70%);
  top: 15%;
  right: 25%;
  animation: float-slow 28s infinite alternate-reverse ease-in-out;
}

@keyframes float-slow {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(10px, 10px) scale(1.05);
  }
  100% {
    transform: translate(-10px, -10px) scale(0.95);
  }
}

@keyframes floating-image {
  0% {
    transform: translateY(-50%) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-52%) translateX(-5px) rotate(-1deg);
  }
  50% {
    transform: translateY(-50%) translateX(0) rotate(0deg);
  }
  75% {
    transform: translateY(-48%) translateX(5px) rotate(1deg);
  }
  100% {
    transform: translateY(-50%) translateX(0) rotate(0deg);
  }
}

.floating-image {
  animation: floating-image 8s ease-in-out infinite;
}

.image-frame {
  position: relative;
  width: 85%;
  height: 85%;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);
  padding: 20px;
  z-index: 1;
  overflow: hidden;
}

.image-frame::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(transparent, rgba(255, 255, 255, 0.3), transparent 30%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

/* Auth layout with image and form */
.auth-layout {
  display: flex;
  max-width: 1200px;
  width: 90%;
  height: 85vh;
  min-height: 600px;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.image-container {
  flex: 0 0 48%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-dark-color), var(--primary-color),var(--primary-light-color));
  box-shadow: inset -10px 0 20px rgba(0, 0, 0, 0.1);
}

.image-container::before,
.image-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  opacity: 0.5;
}

.image-container::before {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  top: 10%;
  left: 10%;
  animation: float-slow 15s infinite alternate ease-in-out;
}

.image-container::after {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
  bottom: 15%;
  right: 15%;
  animation: float-slow 18s infinite alternate-reverse ease-in-out;
}

.auth-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
  object-position: center;
  opacity: 0.95;
  transition:
    transform 1.2s ease,
    filter 0.8s ease;
  filter: contrast(1.1) saturate(1.2) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
  margin: auto;
  display: block;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.2);
}

.image-container:hover .auth-image {
  transform: translateY(-50%) scale(1.05) rotate(2deg);
  filter: contrast(1.15) saturate(1.3) drop-shadow(0 15px 25px rgba(0, 0, 0, 0.25));
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  transform: translateY(0);
  transition: transform 0.5s ease;
  z-index: 10;
}

.overlay-content {
  background: rgba(30, 41, 59, 0.95);
  padding: 1.5rem 2rem;
  border-top: 3px solid #4f46e5;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.2);
}

.image-container:hover .image-overlay {
  transform: translateY(-10px);
}

.overlay-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: -0.5px;
  position: relative;
}

.overlay-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--secondary-color), var(--secondary-light-color));
  border-radius: 3px;
}

.overlay-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ffffff;
  max-width: 95%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 1.2rem;
  font-weight: 400;
}

.auth-card {
  flex: 0 0 52%;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
  position: relative;
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 3rem;
}

/* Responsive layout */
@media (max-width: 1024px) {
  .auth-layout {
    width: 95%;
    height: 80vh;
  }

  .overlay-title {
    font-size: 1.8rem;
  }

  .overlay-text {
    font-size: 1rem;
  }

  .auth-card {
    padding: 1.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .auth-layout {
    flex-direction: column;
    max-width: 600px;
    height: auto;
    min-height: 0;
  }

  .image-container {
    flex: 0 0 250px;
  }

  .auth-card {
    flex: 1;
    padding: 2rem;
  }

  .image-overlay {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-layout {
    width: 100%;
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
  }

  .image-container {
    flex: 0 0 200px;
  }
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7, #ec4899);
  z-index: 1;
}

.card-header {
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

/* Input field animations */
.p-inputtext {
  transition: all 0.3s ease;
}

.p-inputtext:focus {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
}

.p-inputtext.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

/* Button animations */
.p-button {
  transition: all 0.3s ease !important;
}

.p-button:not(:disabled):hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
}

.p-button:not(:disabled):active {
  transform: translateY(0) !important;
}

/* Message animations */
.p-message {
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in-bottom {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Link animations */
.text-primary {
  position: relative;
  display: inline-block;
}

.text-primary::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.text-primary:hover::after {
  width: 100%;
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

.btn-submit:disabled {
  background-color: #a6c8ff;
  cursor: not-allowed;
}

.api-error {
  background-color: #fff2f2;
  color: #ff4d4d;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  background-color: #f0fff4;
  color: #38a169;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-links {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-links p {
  margin: 0.5rem 0;
}

.auth-links a {
  color: #4c9aff;
  text-decoration: none;
  font-weight: 500;
}

.auth-links a:hover {
  text-decoration: underline;
}

/* Form styling */
.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Form input styling */
.custom-input-container {
  position: relative;
  margin-bottom: 0.5rem;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 2;
}

.custom-input {
  padding-left: 40px !important;
  border-radius: 10px !important;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
}

.custom-input:focus {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1) !important;
  background: #fff !important;
}

.custom-input.p-invalid {
  border-color: #ef4444 !important;
}

.error-message {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.button-container {
  margin-top: 1.5rem;
}

.custom-button {
  height: 50px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.custom-button:hover {
  background: linear-gradient(90deg, #4338ca, #6d28d9) !important;
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4) !important;
  transform: translateY(-2px);
}

.custom-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.3) !important;
}

.p-message {
  border-radius: 10px !important;
  padding: 1rem !important;
  margin-top: 1.5rem !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  border-left: 4px solid !important;
}

.p-message-error {
  background-color: #fef2f2 !important;
  border-color: #ef4444 !important;
}

.p-message-success {
  background-color: #f0fdf4 !important;
  border-color: #22c55e !important;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }

  input[type='email'] {
    padding: 0.65rem;
  }

  .btn-submit {
    padding: 0.75rem;
  }
}

/* New professional styling elements */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-color-lighter, #4dabf7) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 59, 130, 246, 0.7));
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-color-rgb, 59, 130, 246, 0));
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 59, 130, 246, 0));
  }
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.input-wrapper:hover {
  transform: translateY(-2px);
}

.input-icon-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.input-icon {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.custom-input {
  border-radius: 8px !important;
  padding: 1rem 1rem 1rem 2.5rem !important;
  transition: all 0.3s ease !important;
  border: 1px solid #e2e8f0 !important;
  background-color: #f8fafc !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.custom-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 59, 130, 246), 0.25) !important;
  transform: translateY(-1px);
}

.custom-input:hover {
  border-color: var(--primary-color-lighter, #4dabf7) !important;
  background-color: #ffffff !important;
}

.custom-button {
  border-radius: 8px !important;
  padding: 1rem !important;
  transition: all 0.3s ease !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  text-transform: uppercase !important;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-color-lighter, #4dabf7) 100%
  ) !important;
}

.custom-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 15px rgba(var(--primary-color-rgb, 59, 130, 246), 0.3) !important;
}

.elevation-3 {
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08) !important;
}

.auth-card {
  border-radius: 16px !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  border: none !important;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.form-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.error-message {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  margin-top: 0.5rem;
}
</style>
