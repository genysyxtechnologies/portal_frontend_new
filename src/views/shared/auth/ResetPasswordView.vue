<template>
  <div class="reset-password-container">
    <div class="card">
      <h1>Reset Password</h1>
      <p class="subtitle">Create a new password for your account</p>

      <form @submit.prevent="handleSubmit" class="reset-password-form">
        <div v-if="!isValid" class="invalid-token">
          <i class="pi pi-exclamation-circle"></i>
          <div>
            <h3>Invalid or Expired Link</h3>
            <p>
              This password reset link is invalid or has expired. Please request a new password
              reset link.
            </p>
            <router-link to="/forgot-password" class="btn-request-new">
              Request New Link
            </router-link>
          </div>
        </div>

        <template v-else>
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :class="{ 'error-input': errors.password }"
                required
              />
              <button type="button" class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <small v-if="errors.password" class="error-message">{{ errors.password }}</small>
            <small class="password-hint"
              >Password must be at least 8 characters with a mix of letters, numbers, and
              symbols.</small
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :class="{ 'error-input': errors.confirmPassword }"
                required
              />
              <button type="button" class="toggle-password" @click="toggleConfirmPassword">
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <small v-if="errors.confirmPassword" class="error-message">{{
              errors.confirmPassword
            }}</small>
          </div>

          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Reset Password</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>

          <div v-if="apiError" class="api-error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ apiError }}</span>
          </div>

          <div v-if="success" class="success-message">
            <i class="pi pi-check-circle"></i>
            <div>
              <h3>Password Reset Successful</h3>
              <p>
                Your password has been successfully reset. You can now log in with your new
                password.
              </p>
              <router-link to="/" class="btn-login"> Go to Login </router-link>
            </div>
          </div>
        </template>
      </form>

      <div v-if="isValid && !success" class="auth-links">
        <p>Remember your password? <router-link to="/">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = ref(route.query.token as string)
const isValid = ref(true)
const apiError = ref('')
const success = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  password: '',
  confirmPassword: '',
})

onMounted(() => {
  // Check if token exists in URL
  if (!token.value) {
    isValid.value = false
    return
  }

  // Validate token with API - this would be implemented in a real app
  validateToken()
})

const validateToken = async () => {
  try {
    // This would normally be an API call to verify the token
    // const response = await authService.validateResetToken(token.value);

    // For demo purposes, we'll simulate a valid token
    // In a real app, set isValid based on API response
    isValid.value = true
  } catch (error) {
    isValid.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validateForm = () => {
  let isValid = true

  // Reset errors
  errors.password = ''
  errors.confirmPassword = ''

  // Validate password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = 'Password must be at least 8 characters with letters, numbers, and symbols'
    isValid = false
  }

  // Validate confirm password
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  // Reset API error
  apiError.value = ''

  // Validate form
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Here you would normally make an API call to reset the password
    // const response = await authService.resetPassword({
    //   token: token.value,
    //   password: formData.password
    // });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    success.value = true
  } catch (error) {
    // Handle API errors
    if (error instanceof Error) {
      apiError.value = error.message || 'Failed to reset password. Please try again.'
    } else {
      apiError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.reset-password-container {
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

.reset-password-form {
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

input[type='password'],
input[type='text'] {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type='password']:focus,
input[type='text']:focus {
  border-color: #4c9aff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.1);
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-input {
  border-color: #ff4d4d !important;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.password-hint {
  color: #777;
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

.success-message,
.invalid-token {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.invalid-token {
  background-color: #fff5f5;
  color: #c53030;
}

.success-message i,
.invalid-token i {
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.success-message h3,
.invalid-token h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.success-message p,
.invalid-token p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.btn-login,
.btn-request-new {
  display: inline-block;
  background-color: #4c9aff;
  color: white;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-login:hover,
.btn-request-new:hover {
  background-color: #3a85ff;
}

.auth-links {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
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

  input[type='password'],
  input[type='text'] {
    padding: 0.65rem;
  }

  .btn-submit {
    padding: 0.75rem;
  }
}
</style>
