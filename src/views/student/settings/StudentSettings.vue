<template>
  <div class="futuristic-settings">
    <!-- Animated Background -->
    <div class="background-overlay">
      <div class="grid-pattern"></div>
      <div class="floating-particles">
        <div v-for="i in 12" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section" data-aos="fade-down" data-aos-duration="800">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="title-icon">
            <i class="fas fa-cog"></i>
          </div>
          <h1 class="futuristic-title">
            <span class="title-text">Account</span>
            <div class="title-underline"></div>
          </h1>
        </div>
        <div class="status-indicator">
          <div class="pulse-dot"></div>
          <span class="status-text">Online</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
      <!-- User Profile Card -->
      <div class="profile-card glass-panel" data-aos="slide-right" data-aos-duration="800" data-aos-delay="300">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-user-circle"></i>
          </div>
          <h2 class="card-title">User Profile</h2>
          <div class="card-badge">Active</div>
        </div>
        <UserInformation
          :first-label="'Name'"
          :second-label="'Matric Number'"
          :third-label="'Phone Number'"
          :third-input="user?.phone"
          :first-input="user?.name"
          :second-input="user?.username"
          class="user-info-content"
        />
      </div>

      <!-- Settings Panel -->
      <div class="settings-panel" data-aos="slide-left" data-aos-duration="800" data-aos-delay="400">
        <!-- Contact Settings -->
        <div class="settings-card glass-panel" data-aos="fade-up" data-aos-delay="500">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-address-book"></i>
            </div>
            <h2 class="card-title">Contact Information</h2>
            <div class="card-badge">Editable</div>
          </div>
          <StudentContactInformation
            :email="user?.email"
            :phone="user?.phone"
            @update-contact="updateContactInfo"
            :isLoading="isLoading"
            class="settings-content"
          />
        </div>

        <!-- Security Settings -->
        <div class="settings-card glass-panel" data-aos="fade-up" data-aos-delay="600">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h2 class="card-title">Security Settings</h2>
            <div class="card-badge secure">Secure</div>
          </div>
          <StudentPassword :userId="user?.userId!" class="settings-content" />
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="loading-text">Processing...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStudentSettings from '@/services/student/useStudentSettings'
import UserInformation from '../dashboard/UserInformation.vue'
import StudentContactInformation from './StudentContactInformation.vue'
import StudentPassword from './StudentPassword.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { onMounted } from 'vue'

const { user, getStudentInformation } = useStudentDashboard()
const { updateProfile, isLoading } = useStudentSettings()

// Function to handle contact information updates
const updateContactInfo = async (contactData: { phone: string; email: string}) => {
  // Update local user data
  if (user.value) {
    user.value.phone = contactData.phone
    user.value.email = contactData.email
  }

  await updateProfile({...contactData, userId: user.value?.userId})
}

// Generate random styles for floating particles
const getParticleStyle = (index: number) => {
  const size = Math.random() * 6 + 2
  const left = Math.random() * 100
  const animationDelay = Math.random() * 10
  const animationDuration = Math.random() * 20 + 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

onMounted(async () => {
  await getStudentInformation()
})
</script>

<style scoped>
/* Main Container */
.futuristic-settings {
  position: relative;
  min-height: calc(100vh - 120px);
  background: transparent;
  overflow: hidden;
  color: #1f2937;
}

/* Animated Background */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Floating Particles */
.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1));
  border-radius: 50%;
  animation: float linear infinite;
  filter: blur(1px);
}

@keyframes float {
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
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Header Section */
.header-section {
  position: relative;
  z-index: 10;
  padding: 1rem 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: iconPulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.futuristic-title {
  position: relative;
}

.title-text {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.title-underline {
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, transparent);
  border-radius: 2px;
  margin-top: 0.5rem;
  animation: underlineGlow 2s ease-in-out infinite;
}

@keyframes underlineGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
}

/* Status Indicator */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
}

.pulse-dot {
  width: 0.75rem;
  height: 0.75rem;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
}

.status-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

/* Main Grid */
.main-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1.5rem;
  padding: 0;
  margin: 0 auto;
  min-height: calc(100vh - 180px);
}

/* Glass Panel Effect */
.glass-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  position: relative;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 30px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Profile Card */
.profile-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

/* Settings Panel */
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  padding: 1.5rem;
  flex: 1;
  overflow: visible;
}

/* Card Headers */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.card-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.card-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.card-badge.secure {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

/* Content Areas */
.user-info-content,
.settings-content {
  position: relative;
  z-index: 1;
}

/* Override StudentPassword styles for proper display */
.settings-content :deep(.password-container) {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
}

.settings-content :deep(.action-section) {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
}

.settings-content :deep(.buttons-container) {
  gap: 1rem;
  justify-content: flex-end;
}

.settings-content :deep(.cancel-button),
.settings-content :deep(.save-button) {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.settings-content :deep(.cancel-button) {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.settings-content :deep(.cancel-button:hover) {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.settings-content :deep(.save-button) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.settings-content :deep(.save-button:hover:not(:disabled)) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #3b82f6;
  font-size: 1.125rem;
  font-weight: 600;
  animation: loadingPulse 1.5s ease-in-out infinite;
}

@keyframes loadingPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .title-text {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 0.5rem 0;
  }

  .title-text {
    font-size: 1.75rem;
  }

  .profile-card,
  .settings-card {
    padding: 1rem;
  }
}
</style>
