<template>
  <div
    class="flex flex-col p-6 sm:p-12 bg-white gap-8 rounded-xl justify-center shadow-2xl transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-1"
  >
    <Toa-st />
    <div class="p-4 sm:p-8 flex flex-col gap-8">
      <div class="flex flex-col items-center space-y-2">
        <h1 class="welcome animate-fade-in">Welcome back</h1>
        <h3 class="sub-welcome animate-fade-in delay-100">Login to your account below</h3>
      </div>

      <div class="flex flex-col gap-6 animate-fade-in delay-200">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col space-y-2">
            <small class="text-[#0D47A1] font-medium">Username</small>
            <div class="relative">
              <InputText
                v-model="credentials.email"
                class="input-field"
                placeholder="Enter your username"
              />
              <span class="absolute top-4 right-4">
                <i class="pi pi-user"></i>
              </span>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <small class="text-[#0D47A1] font-medium">Password</small>
            <div class="relative">
              <InputText
                v-model="credentials.password"
                :type="isPassword ? 'password' : 'text'"
                class="input-field"
                placeholder="Enter your password"
              />
              <span @click="handlePasswordChange" class="absolute top-4 right-4">
                <i v-if="isPassword" class="pi pi-lock"></i>
                <i v-else class="pi pi-eye-slash"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col space-y-4">
            <ReUsableButtons :label="'Login'" @on-click="login" />
            <span
              class="text-center text-[#0D47A1] hover:text-[#1565C0] cursor-pointer transition-colors duration-300"
            >
              Forget password?
            </span>
          </div>

          <div class="flex flex-col text-center space-y-1">
            <span class="text-[#BFBFBF]">Start your application</span>
            <div class="flex self-center items-center gap-2">
              <span
                @click="$emit('on-switch')"
                class="text-[#0D47A1] font-medium hover:text-[#1565C0] cursor-pointer transition-colors duration-300"
              >
                Apply here
              </span>
              <span class="flex">
                <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/services/student/useAuth'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import { anyContains } from '@/utils/permissions/roles.ts'
import { useRouter } from 'vue-router'
const { handleUserLogin, credentials, isPassword, handlePasswordChange } = useAuth()

const router = useRouter()

const login = async () => {
  const d = await handleUserLogin()
  // route based on
  if (anyContains(['student'], d.data.roles)) {
    await router.push('/student')
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
}

.sub-welcome {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #434343;
}

.input-field {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
}

.input-field:focus {
  border-color: #0d47a1;
  box-shadow: 0 0 0 2px rgba(13, 71, 161, 0.2);
  outline: none;
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .left-text {
    font-size: 32px;
    line-height: 40px;
  }

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
