<template>
  <div class="register-container">
    <div class="card">
      <h1>Create an Account</h1>
      <p class="subtitle">
        Join our school portal to access learning resources and stay connected.
      </p>

      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            :class="{ 'error-input': errors.firstName }"
            required
          />
          <small v-if="errors.firstName" class="error-message">{{ errors.firstName }}</small>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            :class="{ 'error-input': errors.lastName }"
            required
          />
          <small v-if="errors.lastName" class="error-message">{{ errors.lastName }}</small>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            :class="{ 'error-input': errors.email }"
            required
          />
          <small v-if="errors.email" class="error-message">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
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
          <label for="confirmPassword">Confirm Password</label>
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

        <div class="form-group checkbox-group">
          <input id="termsAgreement" v-model="formData.termsAgreement" type="checkbox" required />
          <label for="termsAgreement"
            >I agree to the <a href="#" @click.prevent="showTerms">Terms of Service</a> and
            <a href="#" @click.prevent="showPrivacyPolicy">Privacy Policy</a></label
          >
          <small v-if="errors.termsAgreement" class="error-message">{{
            errors.termsAgreement
          }}</small>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Register</span>
          <i v-else class="pi pi-spin pi-spinner"></i>
        </button>

        <div v-if="apiError" class="api-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ apiError }}</span>
        </div>
      </form>

      <div class="auth-links">
        <p>Already have an account? <router-link to="/">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiError = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAgreement: false,
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAgreement: '',
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  // Validate first name
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  // Validate last name
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

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

  // Validate terms agreement
  if (!formData.termsAgreement) {
    errors.termsAgreement = 'You must agree to the terms to continue'
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
    // Here you would typically make an API call to register the user
    // const response = await authService.register({
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: formData.email,
    //   password: formData.password
    // });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to verify email page or login
    router.push('/auth/verify-email')
  } catch (error) {
    // Handle API errors
    if (error instanceof Error) {
      apiError.value = error.message || 'Registration failed. Please try again.'
    } else {
      apiError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const showTerms = () => {
  // Logic to show terms of service modal or page
  console.log('Show Terms of Service')
}

const showPrivacyPolicy = () => {
  // Logic to show privacy policy modal or page
  console.log('Show Privacy Policy')
}
</script>

<style scoped>
.register-container {
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
  max-width: 500px;
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

.register-form {
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

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type='text']:focus,
input[type='email']:focus,
input[type='password']:focus {
  border-color: #4c9aff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.1);
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

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group label {
  margin-bottom: 0;
}

.checkbox-group a {
  color: #4c9aff;
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
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
  margin-top: 1rem;
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

  .register-form {
    gap: 1rem;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'] {
    padding: 0.65rem;
  }

  .btn-submit {
    padding: 0.75rem;
  }
}
</style>
