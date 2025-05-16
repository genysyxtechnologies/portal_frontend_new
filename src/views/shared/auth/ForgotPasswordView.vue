<template>
  <div class="forgot-password-container">
    <div class="card">
      <h1>Forgot Password</h1>
      <p class="subtitle">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form @submit.prevent="handleSubmit" class="forgot-password-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :class="{ 'error-input': emailError }"
            required
            placeholder="Enter your email address"
          />
          <small v-if="emailError" class="error-message">{{ emailError }}</small>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Send Reset Link</span>
          <i v-else class="pi pi-spin pi-spinner"></i>
        </button>

        <div v-if="apiError" class="api-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ apiError }}</span>
        </div>

        <div v-if="successMessage" class="success-message">
          <i class="pi pi-check-circle"></i>
          <span>{{ successMessage }}</span>
        </div>
      </form>

      <div class="auth-links">
        <p>Remember your password? <router-link to="/">Sign in</router-link></p>
        <p>Don't have an account? <router-link to="/auth/register">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const emailError = ref('')
const apiError = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const validateEmail = () => {
  emailError.value = ''

  if (!email.value.trim()) {
    emailError.value = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }

  return true
}

const handleSubmit = async () => {
  // Reset messages
  apiError.value = ''
  successMessage.value = ''

  // Validate email
  if (!validateEmail()) {
    return
  }

  isSubmitting.value = true

  try {
    // Here you would normally make an API call to request password reset
    // const response = await authService.forgotPassword(email.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    successMessage.value = 'Password reset instructions have been sent to your email.'
    email.value = '' // Clear the form
  } catch (error) {
    // Handle API errors
    if (error instanceof Error) {
      apiError.value = error.message || 'Failed to send reset link. Please try again.'
    } else {
      apiError.value = 'An unexpected error occurred. Please try again.'
    }
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
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
}

input[type='email'] {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type='email']:focus {
  border-color: #4c9aff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.1);
}

input[type='email']::placeholder {
  color: #aaa;
}

.error-input {
  border-color: #ff4d4d !important;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.btn-submit {
  background-color: #4c9aff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-submit:hover {
  background-color: #3a85ff;
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
</style>
