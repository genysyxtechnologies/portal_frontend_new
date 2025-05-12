<template>
  <div
    class="h-screen bg-gradient-to-br from-[#90CAF9] to-[#64B5F6] w-full flex items-center justify-center p-5 overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-2 w-full lg:w-3/4 h-full max-w-6xl">
      <!-- Left hand side -->
      <div
        class="hidden lg:flex flex-col items-center justify-center gap-8 left-text transform transition-all duration-1000 ease-in-out">
        <div
          class="bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <img :src="image1" alt="Logo"
            class="image1 rounded-t-full scale-75 transition-transform duration-700 hover:scale-90" />
        </div>
        <div class="text-center space-y-2">
          <div class="animate-fade-in-up delay-100">Integrity, Innovation</div>
          <div class="animate-fade-in-up delay-200">Excellence</div>
        </div>
      </div>

      <!-- Right hand side -->
      <LoginPage v-if="isLoginPage" @on-switch="handlePageChange"/>
      <RegistrationPage v-else @on-switch="handlePageChange"/>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import image1 from '../../../assets/images/auth/image1.png'
import { useRouter } from 'vue-router'
import LoginPage from './LoginPage.vue'
import RegistrationPage from './RegistrationPage.vue'
import { useAuth } from '@/services/student/useAuth'

const { isLoginPage, handlePageChange } = useAuth();


const $router = useRouter();

const handleButtonClick = () => {
  $router.push('/student')
}

onMounted(() => {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('animate-fade-in-up')
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.left-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: #0d47a1;
}

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
  border: 1px solid #E0E0E0;
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
