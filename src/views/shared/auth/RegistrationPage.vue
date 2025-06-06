<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
</script>

<template>
  <div
    class="flex flex-col p-6 sm:p-12 bg-white gap-8 rounded-xl justify-center shadow-2xl transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-1 lg:w-9/10"
  >
    <div class="p-4 sm:p-8 flex flex-col gap-8">
      <div class="flex flex-col items-center space-y-2">
        <h1 class="welcome animate-fade-in" style="line-height: 65px">Apply</h1>
        <h3 class="sub-welcome animate-fade-in delay-100">Start your application below</h3>
      </div>

      <div class="flex flex-col gap-6 animate-fade-in delay-200">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col space-y-2">
            <small class="text-[#0D47A1] font-medium">Email</small>
            <div class="relative">
              <InputText class="input-field" placeholder="Enter your username" />
              <span class="absolute top-4 right-4">
                <i class="pi pi-envelope"></i>
              </span>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <small class="text-[#0D47A1] font-medium">Password</small>
            <div class="relative">
              <InputText type="password" class="input-field" placeholder="Enter your password" />
              <span class="absolute top-4 right-4"> <i class="pi pi-lock"></i></span>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <small class="text-[#0D47A1] font-medium">Confirm password</small>
            <div class="relative">
              <InputText type="password" class="input-field" placeholder="Enter your password" />
              <span class="absolute top-4 right-4"> <i class="pi pi-lock"></i></span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col space-y-4">
            <ReUsableButtons :label="'Apply'" @on-click="$emit('on-click')" />
          </div>

          <div class="flex flex-col text-center space-y-1">
            <span class="text-[#BFBFBF]">Already have an account?</span>
            <div class="flex self-center items-center gap-2">
              <span
                @click="$emit('on-switch')"
                class="text-[#0D47A1] font-medium hover:text-[#1565C0] cursor-pointer transition-colors duration-300"
              >
                Login here
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
