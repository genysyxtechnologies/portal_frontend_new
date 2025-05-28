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
       <!--  <ReUsableButtons
          :label="'Update'"
          class="update-button"
          :disabled="loading || bioDataLoading || !user?.username"
          @on-click="handleUpdateBioData"
        /> -->
      </div>
    </div>

    <div class="main-content">
      <!-- User Information Card -->
      <div class="profile-card" data-aos="fade-up" data-aos-duration="800">
        <div class="card-content">
          <div class="card-header">
            <h2 class="card-title">Student Profile</h2>
          </div>
          <UserInformation
            :first-label="'Name'"
            :second-label="'Matric Number'"
            :third-label="'Phone Number'"
            :third-input="user?.phone"
            :first-input="user?.name"
            :second-input="user?.username"
            class="profile-information"
          />
        </div>
      </div>

      <!-- Tabbed Bio Data Section -->
      <div
        class="biodata-details-card"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
      >
        <div class="card-header">
          <h2 class="card-title">Bio Data Information</h2>
        </div>

        <SpinningAnimation
          :loading="loading || bioDataLoading"
          :head-title="headTitle"
          :sub-title="subTitle"
          class="loading-overlay"
        />
        <Ta-bs v-model:value="tabCount" class="tabs-container">
          <TabList class="tab-list">
            <T-ab
              v-for="(tab, index) in tabs"
              :key="index"
              :value="index.toString()"
              class="tab-item"
              :class="{
                'tab-active': tabCount === index.toString(),
                'tab-inactive': tabCount !== index.toString(),
              }"
              :style="{ pointerEvents: loading || bioDataLoading ? 'none' : 'auto' }"
            >
              <div class="tab-content">
                <span class="tab-icon" :class="getTabIcon(index)"></span>
                <span class="tab-label">{{ tab.label }}</span>
              </div>
              <span v-if="tabCount === index.toString()" class="tab-indicator"></span>
            </T-ab>
          </TabList>

          <TabPanels class="tab-panels">
            <transition-group name="panel-transition" mode="out-in">
              <TabPanel
                v-for="(tab, index) in tabs"
                :key="index"
                :value="index.toString()"
                class="tab-panel"
              >
                <component :is="tab.component" :user="user!" :loading="loading" />
              </TabPanel>
            </transition-group>
          </TabPanels>
        </Ta-bs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserInformation from '../dashboard/UserInformation.vue'
import BioInfo from './BioInfo.vue'
import HealthInfo from './HealthInfo.vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import NextOfKinInfo from './NextOfKinInfo.vue'
/* import SponsorInformation from './SponsorInformation.vue'; */
import { useStudentBioData } from '@/services/student/useStudentBioData'
import { onMounted, watch } from 'vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import SponsorInformation from './SponsorInformation.vue'

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
  console.error('AOS not available, animations might not work', error)
}

const {
  tabCount,
  downloadStudentBiodata,
  updateBioData,
  headTitle,
  subTitle,
  loading: bioDataLoading,
} = useStudentBioData()

// Function to handle updating biodata from all tabs
const handleUpdateBioData = async () => {
  // Make sure we have the latest user data in sessionStorage
  if (user.value) {
    sessionStorage.setItem('userData', JSON.stringify(user.value))
    console.log('Updated user data in sessionStorage before update')
  }

  // Ensure all tabs have saved their data
  const activeTab = tabCount.value

  // Trigger a save on all tabs by cycling through them quickly
  for (let i = 0; i < tabs.length; i++) {
    tabCount.value = i.toString()
    await new Promise((resolve) => setTimeout(resolve, 50)) // Brief delay to let the tab render
  }

  // Return to the original tab
  tabCount.value = activeTab

  // Show loading notification
  const loadingNotification = document.createElement('div')
  loadingNotification.className = 'update-notification'
  loadingNotification.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating all biodata...'
  document.body.appendChild(loadingNotification)

  try {
    // Call the updateBioData function with the username
    await updateBioData(user.value?.username!)

    // Remove loading notification
    document.body.removeChild(loadingNotification)
  } catch (error: any) {
    // Type assertion for error
    console.error('Error updating biodata:', error)
    // Remove loading notification in case of error
    document.body.removeChild(loadingNotification)

    // Show error details in console
    if (error.response && error.response.data) {
      console.error('Server error details:', error.response.data)
    }
  }
}
const { user, getStudentInformation, loading } = useStudentDashboard()

onMounted(async () => {
  await getStudentInformation()

  // Store user data in sessionStorage for reference
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

const tabs = [
  { label: 'Bio Info', component: BioInfo, user: user.value },
  { label: 'Health Info', component: HealthInfo, user: user.value },
  { label: 'Next Of Kin Info', component: NextOfKinInfo, user: user.value },
  { label: 'Sponsorship Info', component: SponsorInformation, user: user.value, loading: loading },
]

// Function to get icon class for each tab
const getTabIcon = (index: number) => {
  const icons = [
    'fas fa-user', // Bio Info
    'fas fa-heartbeat', // Health Info
    'fas fa-users', // Next of Kin
    'fas fa-money-bill', // Sponsorship (commented out)
  ]
  return icons[index] || 'fas fa-circle'
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

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  position: relative;
}

.title-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
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
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  transition: all 0.3s ease;
}

.update-button:hover {
  background: linear-gradient(135deg, #2980b9, #1a5276);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
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
  background: linear-gradient(90deg, #3b82f6, transparent);
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
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.download-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.download-button:active {
  transform: translateY(0) scale(0.98);
}

/* Main content layout */
.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  min-height: calc(100vh - 180px);
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: 5fr 7fr;
  }
}

/* Profile card styling */
.profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  z-index: 1;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-content {
  padding: 1.5rem;
  height: 100%;
}

.card-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  position: relative;
  padding-left: 1rem;
}

.card-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.profile-information {
  animation: fadeInUp 0.6s ease-out 0.2s both;
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
  height: 100%;
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

/* Tabs styling */
.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  background-color: #f9fafb;
  position: relative;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.tab-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.tab-item {
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  height: 4rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-active {
  color: #4f46e5;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.tab-inactive {
  color: #6b7280;
}

.tab-inactive:hover {
  color: #4f46e5;
  background-color: #f3f4f6;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tab-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.tab-active .tab-icon {
  transform: scale(1.2);
  color: #4f46e5;
}

.tab-label {
  position: relative;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, #8b5cf6);
  animation: indicatorGrow 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes indicatorGrow {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
  }
}

.tab-panels {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  position: relative;
}

.tab-panel {
  height: 100%;
}

/* Panel transition animations */
.panel-transition-enter-active,
.panel-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1.5rem;
}

.panel-transition-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.panel-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
</style>
