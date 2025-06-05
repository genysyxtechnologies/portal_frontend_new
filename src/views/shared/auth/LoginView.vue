<template>
  <div
    class="h-screen w-full flex p-5 overflow-hidden"
    :style="{
      background: `linear-gradient(to bottom right, var(--secondary-light-color), var(--secondary-dark-color))`
    }"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 w-full lg:w-8/8 ml-0 h-full justify-between">
      <!-- Left hand side -->
      <div
        class="hidden w-9/10 lg:flex flex-col items-center justify-center gap-8 left-text transform transition-all duration-1000 ease-in-out relative overflow-hidden"
      >
        <!-- Background pattern -->

        <!-- Radial overlay to fade edges -->
        <div class="absolute inset-0 pointer-events-none radial-overlay-round"
             style="background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 20%, transparent 40%, transparent 60%, var(--secondary-light-color) 80%, var(--secondary-dark-color), 100%);">
          <div class="absolute inset-0 opacity-5 pointer-events-none pattern-background"
               :style="`background-image: url('${backgroundSvg}'); background-repeat: repeat; background-size: 1200px 1200px; background-position: center;`">
          </div>
        </div>

        <div
          class=" w-1/2 rounded-full flex items-center justify-center p-2  transition-all duration-500 hover:scale-105 relative z-10"
        >
          <img
            :src="image1"
            alt="Logo"
            class="image1 rounded-t-full scale-70 transition-transform duration-700 hover:scale-90"
          />
        </div>
        <div class="text-center space-y-2 relative z-10">
          <div class="animate-fade-in-up delay-100">Integrity, Innovation</div>
          <div class="animate-fade-in-up delay-200">Excellence</div>
        </div>
      </div>

      <!-- Right hand side -->
      <LoginPage v-if="isLoginPage" @on-switch="handlePageChange" @on-click="handleButtonClick" />
      <RegistrationPage v-else @on-switch="handlePageChange" @on-click="handleButtonClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginPage from './LoginPage.vue'
import RegistrationPage from './RegistrationPage.vue'
import { useAuth } from '@/services/student/useAuth'
import urlUtil from '@/utils/urlUtil'
import backgroundSvg from '@/assets/images/background.svg'

const { isLoginPage, handlePageChange } = useAuth()

const $router = useRouter()

const handleButtonClick = () => {
  $router.push('/student')
}

const image1 = urlUtil.getBaseUrl() + '/api/global/logo'

onMounted(() => {
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    el.classList.add('animate-fade-in-up')
  })
})


{
  /* NSU/NAS/CMP/0696/17/18 */
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.left-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: var(--primary-dark-color);
}

.welcome {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: var(--primary-dark-color);
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
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
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

/* Pattern background styling */
.pattern-background {
  filter: blur(0.5px) contrast(1.2);
  transform: rotate(15deg) scale(1.5);
  mask: radial-gradient(circle at center, black 60%, transparent 70%);
  -webkit-mask: radial-gradient(circle at center, black 60%, transparent 70%);
}

.pattern-background::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  border-radius: 50%;
  background: inherit;
  filter: inherit;
  transform: rotate(-30deg) scale(0.8);
}

/* Radial overlay round styling */
.radial-overlay-round {
  mask: radial-gradient(circle at center, black 70%, transparent 70%);
  -webkit-mask: radial-gradient(circle at center, black 70%, transparent 70%);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: none;
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
