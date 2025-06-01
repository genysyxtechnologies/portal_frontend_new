<template>
  <div class="forgot-password-container">
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
      <!-- Image section - stays constant -->
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

      <!-- Form section - transitions between views -->
      <div class="form-container">
        <transition name="slide-fade" mode="out-in">
          <component
            :is="currentStep"
            @next-step="handleNextStep"
            @prev-step="handlePrevStep"
            :userId="userId"
          ></component>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ForgotPasswordForm from './password_recorvery/ForgotPasswordForm.vue'
import OTPVerificationForm from './password_recorvery/OTPVerificationForm.vue'
import ResetPasswordForm from './password_recorvery/ResetPasswordForm.vue'
import usePasswordRecorvery from './password_recorvery/usePasswordRecorvery'
import urlUtil from '@/utils/urlUtil'
const { userId } = usePasswordRecorvery()
const image = urlUtil.getBaseUrl() + '/api/global/logo'

// Current step in the auth flow
const currentStep = shallowRef<any>(ForgotPasswordForm)
const router = useRouter()
const route = useRoute()

// Handle navigation
const handleNextStep = (data: { userId: string }) => {
  if (currentStep.value === ForgotPasswordForm) {
    userId.value = data.userId
    currentStep.value = OTPVerificationForm
    router.push({ path: '/verify-otp', query: { userId: userId.value } })
  } else if (currentStep.value === OTPVerificationForm) {
    currentStep.value = ResetPasswordForm
    router.push({ path: '/reset-password', query: { userId: userId.value } })
  }
}

const handlePrevStep = () => {
  if (currentStep.value === OTPVerificationForm) {
    currentStep.value = ForgotPasswordForm
    router.push('/forgot-password')
  } else if (currentStep.value === ResetPasswordForm) {
    currentStep.value = OTPVerificationForm
    router.push({ path: '/verify-otp', query: { userId: userId.value } })
  }
}

onMounted(() => {
  const path = route.path
  if (path === '/verify-otp') {
    currentStep.value = OTPVerificationForm
    userId.value = route.query.userId as string
  } else if (path === '/reset-password') {
    currentStep.value = ResetPasswordForm
    userId.value = route.query.userId as string
  } else {
    currentStep.value = ForgotPasswordForm
  }
})
</script>

<style scoped>
.forgot-password-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  overflow: hidden;
}

.bg-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(40px);
  z-index: 0;
}

.bg-element-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  top: -100px;
  left: -100px;
  animation: float-slow 20s infinite alternate;
}

.bg-element-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.05) 100%);
  bottom: -150px;
  right: -150px;
  animation: float-slow 25s infinite alternate-reverse;
}

.bg-element-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%);
  top: 30%;
  right: 15%;
  animation: float-slow 18s infinite alternate;
}

.bg-element-4 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, rgba(251, 113, 133, 0.05) 100%);
  bottom: 20%;
  left: 10%;
  animation: float-slow 22s infinite alternate-reverse;
}

.bg-element-5 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(132, 204, 22, 0.1) 0%, rgba(101, 163, 13, 0.05) 100%);
  top: 15%;
  left: 25%;
  animation: float-slow 19s infinite alternate;
}

.bg-element-6 {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%);
  bottom: 30%;
  right: 25%;
  animation: float-slow 23s infinite alternate-reverse;
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
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  max-height: 800px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 10;
}

.image-container {
  flex: 0 0 45%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  position: relative;
  overflow: hidden;
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
  transform: translateY(-50%) scale(1.03) rotate(2deg);
  filter: contrast(1.2) saturate(1.3) drop-shadow(0 15px 20px rgba(0, 0, 0, 0.25));
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
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
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

.form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Slide transition animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

/* Responsive styles */
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
}

@media (max-width: 768px) {
  .auth-layout {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  .image-container {
    flex: 0 0 250px;
  }

  .form-container {
    padding: 2rem;
  }

  .image-overlay {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .forgot-password-container {
    padding: 1rem;
    box-shadow: none;
    height: 100vh;
  }

  .image-container {
    flex: 0 0 200px;
  }
}
</style>
