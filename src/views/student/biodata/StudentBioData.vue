<template>
  <div class="biodata-container">
    <div class="header-section">
      <h1 class="page-title">
        <span class="title-dot"></span>
        <span class="title-text">Bio Data</span>
      </h1>
      <div class="action-buttons">
        <ReUsableButtons
          :disabled="loading || bioDataLoading || !user?.username"
          :label="'Download'"
          class="download-button"
          @on-click="downloadStudentBiodata(user?.username!)"
        />
        <ReUsableButtons
          :label="'Update'"
          class="update-button"
          :disabled="loading || bioDataLoading || !user?.username"
          @on-click="handleUpdateBioData"
        />
      </div>
    </div>

    <div class="main-content">
      <!-- Tabbed Bio Data Section -->
      <div
        class="biodata-details-card"
        data-aos="fade-up"
        data-aos-duration="800"
      >


        <SpinningAnimation
          :loading="loading || bioDataLoading"
          :head-title="headTitle"
          :sub-title="subTitle"
          class="loading-overlay"
        />
        <ModernTabs
          v-model="activeTabIndex"
          :tabs="tabsConfig"
          :disabled="loading || bioDataLoading"
          @tab-change="handleTabChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BioInfo from './BioInfo.vue'
import HealthInfo from './HealthInfo.vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import NextOfKinInfo from './NextOfKinInfo.vue'
import { useStudentBioData } from '@/services/student/useStudentBioData'
import { onMounted, watch, ref, computed } from 'vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import SponsorInformation from './SponsorInformation.vue'
import ModernTabs from '@/components/shared/ModernTabs.vue'
import type { TabItem } from '@/components/shared/ModernTabs.vue'

// Import AOS for scroll animations if not already imported globally
try {
  // @ts-expect-error - AOS might not be available globally
  const aos = window.AOS
  if (aos) {
    onMounted(() => {
      aos.refresh()
    })
  }
} catch (error) {
  throw error
}

const {
  downloadStudentBiodata,
  updateBioData,
  fetchCountries,
  headTitle,
  subTitle,
  loading: bioDataLoading,
  fetchBasicInformation,
  studentBasicInformation,
} = useStudentBioData()

// Active tab management
const activeTabIndex = ref(0)

// Function to handle updating biodata from all tabs
const handleUpdateBioData = async () => {
  if (user.value) {
    sessionStorage.setItem('userData', JSON.stringify(user.value))
  }
  const currentActiveTab = activeTabIndex.value

  for (let i = 0; i < tabsConfig.length; i++) {
    activeTabIndex.value = i
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  activeTabIndex.value = currentActiveTab

  // Show loading notification
  const loadingNotification = document.createElement('div')
  loadingNotification.className = 'update-notification'
  loadingNotification.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating all biodata...'
  document.body.appendChild(loadingNotification)

  try {
    // Call the updateBioData function with the username
    await updateBioData(user.value?.username)

    // Remove loading notification
    document.body.removeChild(loadingNotification)
  } catch (error: unknown) {
    document.body.removeChild(loadingNotification)

    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as { response?: { data?: unknown } }
      if (responseError.response?.data) {
        console.error('Server error details:', responseError.response.data)
      }
    }
  }
}
const { user, getStudentInformation, loading } = useStudentDashboard()

onMounted(async () => {
  await Promise.all([
   getStudentInformation(),
   fetchCountries(),
   fetchBasicInformation()
  ])


    if (user.value) {
    sessionStorage.setItem('userData', JSON.stringify(user.value))
  }
})

// Watch for changes in user data and update sessionStorage
watch(
  () => user.value,
  (newUserData) => {
    if (newUserData) {
      sessionStorage.setItem('userData', JSON.stringify(newUserData))
    }
  },
  { deep: true },
)

// Tabs configuration for ModernTabs component
const tabsConfig = computed<TabItem[]>(() => [
  {
    label: 'Bio Info',
    icon: 'fas fa-user',
    component: BioInfo,
    props: { user: user.value, loading: loading.value, studentBasicInformation: studentBasicInformation?.value }
  },
  {
    label: 'Health Info',
    icon: 'fas fa-heartbeat',
    component: HealthInfo,
    props: { user: user.value, loading: loading.value, studentBasicInformation: studentBasicInformation?.value }
  },
  {
    label: 'Next Of Kin Info',
    icon: 'fas fa-users',
    component: NextOfKinInfo,
    props: { user: user.value, loading: loading.value, studentBasicInformation: studentBasicInformation?.value }
  },
  {
    label: 'Sponsorship Info',
    icon: 'fas fa-money-bill',
    component: SponsorInformation,
    props: { user: user.value, loading: loading.value, studentBasicInformation: studentBasicInformation?.value }
  }
])

// Handle tab change events
const handleTabChange = (index: number, tab: TabItem) => {
  // console.log(`Switched to tab: ${tab.label}`)
}
</script>

<style scoped>
/* Main container styling */
.biodata-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.8s ease-out;
  max-width: 1600px;
  margin: 0 auto;
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

/* Header section styling */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
}

/* Page title styles are now in base.css */
.page-title {
  display: flex;
  align-items: center;
  position: relative;
}

.title-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--primary-dark-color), var(--primary-light-color));
  border-radius: 50%;
  margin-right: 0.75rem;
  display: inline-block;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Notification styling */
.update-notification,
.save-notification,
.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out forwards;
  max-width: 350px;
}

.update-notification {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.save-notification {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.error-notification {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.update-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  border-radius: 1rem !important;
  color: white !important;
  font-weight: 600 !important;
  transition: all 0.3s ease;
  border: none !important;
  box-shadow:
    0 8px 16px rgba(59, 130, 246, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.update-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow:
    0 12px 24px rgba(59, 130, 246, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.title-text {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-light-color), transparent);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.download-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border-radius: 1rem !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow:
    0 8px 16px rgba(16, 185, 129, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
}

.download-button:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow:
    0 12px 24px rgba(16, 185, 129, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.15) !important;
  background: linear-gradient(135deg, #059669, #047857) !important;
}

.download-button:active {
  transform: translateY(0) scale(0.98);
}

/* Main content layout */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: calc(100vh - 180px);
}


/* Bio data details card styling */
.biodata-details-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  overflow: hidden;
  position: relative;
  min-height: 600px;
  height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
}

.biodata-details-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  z-index: 1;
}

.biodata-details-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(59, 130, 246, 0.2);
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

</style>
