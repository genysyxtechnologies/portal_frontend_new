<template>
  <Card class="auth-card p-5">
    <template #content>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }"
      >
        <h3 class="form-title">Enter Your Credentials</h3>
        <p class="form-subtitle">We'll send a verification code to your registered contact</p>

        <span class="p-float-label custom-input-container relative">
          <i class="pi pi-user absolute top-3 left-2 transform -translate-y-1/2"></i>
          <InputText
            id="userId"
            v-model="userId"
            class="p-inputtext-lg custom-input"
            :class="{ 'p-invalid': userIdError }"
            @keyup.enter="handleUserVerification()"
          />
          <label for="userId">User ID / Email</label>
          <!--  <i
            v-if="userId && !userIdError"
            class="pi pi-check validation-icon validation-success"
          ></i>
          <i v-if="userIdError" class="pi pi-times absolute top-3 right-2 transform -translate-y-1/2"></i> -->
        </span>
        <small v-if="userIdError" class="p-error block mt-2">{{ userIdError }}</small>

        <div class="mt-6">
          <Button
            type="button"
            label="VERIFY IDENTITY"
            icon="pi pi-lock-open"
            class="p-button-lg custom-button w-full"
            style="margin-top: 20px;"
            :loading="isLoading"
            @click="handleUserVerification()"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 600, delay: 400, ease: 'easeOut' },
            }"
          />
        </div>

        <div
          class="auth-links mt-4 text-center"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 600, delay: 600 } }"
        >
          <router-link to="/" class="auth-link">
            <i class="pi pi-arrow-left mr-1"></i> Back to Login
          </router-link>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import usePasswordRecorvery from './usePasswordRecorvery'

const { verifyUserId, userId } = usePasswordRecorvery()


const emit = defineEmits<{
  (e: 'next-step', data: { userId: string }): void
}>()

const toast = useToast()
const userIdError = ref('')
const isLoading = ref(false)

const handleUserVerification = async () => {
  if (!userId.value) {
    userIdError.value = 'Please enter your User ID or Email'
    return
  }

  userIdError.value = ''
  isLoading.value = true

  try {
    const response = await verifyUserId(userId.value)
    const { success, message } = response as { success: boolean; message?: string }

    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message || 'Verification code sent successfully!',
        life: 3000,
      })

      // Move to next step
      emit('next-step', { userId: userId.value })
    }
  } catch (_) {
    userIdError.value = 'An error occurred. Please try again.'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to process your request',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
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

.custom-input-container {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

.custom-input {
  width: 100%;
  padding-left: 2.5rem !important;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 2;
}

.validation-icon {
  position: absolute;
  right: 1rem;
  top: 20%;
  right: -100%;
  transform: translateY(-50%);
}

.validation-success {
  color: #10b981;
}

.validation-error {
  color: #ef4444;
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
  box-shadow: 0 2px 4px var(--secondary-light-color);
}

.auth-links {
  margin-top: 2rem;
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
</style>
