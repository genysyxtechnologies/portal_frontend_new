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
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        ref="leftSideRef"
      >
        <!-- Background pattern -->

        <!-- Radial overlay to fade edges -->
        <div class="absolute inset-0 pointer-events-none radial-overlay-round"
             style="background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 20%, transparent 40%, transparent 60%, var(--secondary-light-color) 80%, var(--secondary-dark-color), 100%);">
          <div class="absolute inset-0 opacity-5 pointer-events-none pattern-background"
               :style="`background-image: url('${backgroundSvg}'); background-repeat: repeat; background-size: 1200px 1200px; background-position: center;`">
          </div>
        </div>

        <!-- Cursor Glow -->
        <div
          class="cursor-glow"
          :style="{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
            opacity: isHovering ? 1 : 0
          }"
        ></div>

        <!-- Animated Elements Container -->
        <div class="absolute inset-0 pointer-events-none">
          <!-- Floating Circles -->
          <div class="floating-circle circle-1"></div>
          <div class="floating-circle circle-2"></div>
          <div class="floating-circle circle-3"></div>

          <!-- Animated Lines -->
          <div class="animated-line line-1"></div>
          <div class="animated-line line-2"></div>
          <div class="animated-line line-3"></div>

          <!-- Particle Effects -->
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>

          <!-- Orbit Animation -->
          <div class="orbit-container">
            <div class="orbit orbit-1">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit orbit-2">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit orbit-3">
              <div class="orbit-dot"></div>
            </div>
          </div>
        </div>

        <div
          class=" w-1/2 rounded-full flex items-center justify-center p-2  transition-all duration-500 hover:scale-105 relative z-10 logo-container"
        >
          <div class="logo-glow"></div>
          <img
            :src="image1"
            alt="Logo"
            class="image1 rounded-t-full scale-70 transition-transform duration-700 hover:scale-90"
          />
        </div>
        <div class="text-center space-y-2 relative z-10">
          <div class="animate-fade-in-up delay-100 text-gradient">Integrity, Innovation</div>
          <div class="animate-fade-in-up delay-200 text-gradient">Excellence</div>
        </div>
      </div>

      <!-- Right hand side -->
      <LoginPage v-if="isLoginPage" @on-switch="handlePageChange" @on-click="handleButtonClick" />
      <RegistrationPage v-else @on-switch="handlePageChange" @on-click="handleButtonClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginPage from './LoginPage.vue'
import RegistrationPage from './RegistrationPage.vue'
import { useAuth } from '@/services/student/useAuth'
import urlUtil from '@/utils/urlUtil'
import backgroundSvg from '@/assets/images/background.svg'

const { isLoginPage, handlePageChange } = useAuth()

const $router = useRouter()

const leftSideRef = ref<HTMLElement>()
const cursorX = ref(0)
const cursorY = ref(0)
const targetX = ref(0)
const targetY = ref(0)
const isHovering = ref(false)

const handleButtonClick = () => {
  $router.push('/student')
}

const image1 = urlUtil.getBaseUrl() + '/api/global/logo'

const handleMouseMove = (e: MouseEvent) => {
  if (!leftSideRef.value) return
  const rect = leftSideRef.value.getBoundingClientRect()
  targetX.value = e.clientX - rect.left
  targetY.value = e.clientY - rect.top
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}

onMounted(() => {
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    el.classList.add('animate-fade-in-up')
  })

  // Smooth cursor animation loop
  function animateCursor() {
    cursorX.value += (targetX.value - cursorX.value) * 0.1
    cursorY.value += (targetY.value - cursorY.value) * 0.1

    requestAnimationFrame(animateCursor)
  }

  animateCursor()
})


{

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

/* Logo Container Styles */
.logo-container {
  position: relative;
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  filter: blur(20px);
  animation: pulse 3s ease-in-out infinite;
}

/* Text Gradient */
.text-gradient {
  background: linear-gradient(135deg, var(--primary-dark-color), var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

/* Floating Circles Animation */
.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation: float 20s ease-in-out infinite;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation: float 25s ease-in-out infinite reverse;
  animation-delay: -5s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation: float 30s ease-in-out infinite;
  animation-delay: -10s;
}

/* Animated Lines */
.animated-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform-origin: left center;
}

.line-1 {
  width: 200px;
  top: 25%;
  left: -200px;
  animation: shootLine 8s ease-in-out infinite;
}

.line-2 {
  width: 150px;
  top: 50%;
  right: -150px;
  animation: shootLineReverse 10s ease-in-out infinite;
  animation-delay: -3s;
}

.line-3 {
  width: 180px;
  bottom: 30%;
  left: -180px;
  animation: shootLine 12s ease-in-out infinite;
  animation-delay: -6s;
}

/* Particle Effects */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
}

.particle-1 {
  top: 20%;
  left: 30%;
  animation: particleFloat 15s linear infinite;
}

.particle-2 {
  top: 40%;
  right: 25%;
  animation: particleFloat 20s linear infinite;
  animation-delay: -5s;
}

.particle-3 {
  bottom: 35%;
  left: 40%;
  animation: particleFloat 18s linear infinite;
  animation-delay: -10s;
}

.particle-4 {
  top: 70%;
  left: 15%;
  animation: particleFloat 22s linear infinite;
  animation-delay: -7s;
}

.particle-5 {
  bottom: 25%;
  right: 30%;
  animation: particleFloat 25s linear infinite;
  animation-delay: -12s;
}

/* Orbit Animation */
.orbit-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  pointer-events: none;
}

.orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.orbit-1 {
  animation: rotate 30s linear infinite;
}

.orbit-2 {
  inset: 50px;
  animation: rotate 40s linear infinite reverse;
}

.orbit-3 {
  inset: 100px;
  animation: rotate 50s linear infinite;
}

.orbit-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
}

/* Animation Keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
  }
  50% {
    transform: translateY(20px) translateX(-10px) scale(0.9);
  }
  75% {
    transform: translateY(-10px) translateX(30px) scale(1.05);
  }
}

@keyframes shootLine {
  0% {
    left: -200px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes shootLineReverse {
  0% {
    right: -150px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    right: 100%;
    opacity: 0;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Cursor Glow Effect */
.cursor-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 20;
  filter: blur(20px);
  mix-blend-mode: screen;
  transform: translate(-50%, -50%);
}

.cursor-glow::before {
  content: '';
  position: absolute;
  inset: 20px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
  border-radius: 50%;
  animation: cursorPulse 2s ease-in-out infinite;
}

.cursor-glow::after {
  content: '';
  position: absolute;
  inset: 40px;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 40%);
  border-radius: 50%;
  opacity: 0.3;
  animation: cursorRotate 3s linear infinite;
}

@keyframes cursorPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
}

@keyframes cursorRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
