<template>
  <div class="flex flex-col gap-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h1 class="head-title text-2xl font-bold text-gray-800 flex items-center">
        <span class="text-primary-500 mr-2">•</span>
        <span class="gradient-text">Bio Data</span>
      </h1>
      <div class="flex items-center gap-4">
        <ReUsableButtons
          :disabled="loading || bioDataLoading || !user?.username"
          :label="'Download'"
          class="download-btn transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          @on-click="downloadStudentBiodata(user?.username!)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-180px)] gap-6">
      <!-- User Information Card -->
      <div
        class="lg:col-span-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg card-hover"
      >
        <div class="p-6 h-full">
          <div class="card-header mb-4 pb-2 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Student Profile</h2>
          </div>
          <UserInformation
            :first-label="'Name'"
            :second-label="'Matric Number'"
            :third-label="'Phone Number'"
            :third-input="user?.phone"
            :first-input="user?.name"
            :second-input="user?.username"
            class="animate-fade-in-delay"
          />
        </div>
      </div>

      <!-- Tabbed Bio Data Section -->
      <div
        class="lg:col-span-7 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg card-hover relative"
      >
        <div class="card-header px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">Bio Data Information</h2>
        </div>

        <SpinningAnimation
          :loading="loading || bioDataLoading"
          :head-title="headTitle"
          :sub-title="subTitle"
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          "
        />
        <Ta-bs v-model:value="tabCount" class="h-full flex flex-col">
          <TabList class="flex border-b border-gray-100 bg-gray-50">
            <T-ab
              v-for="(tab, index) in tabs"
              :key="index"
              :value="index.toString()"
              class="px-6 py-3 text-sm font-medium h-[4rem] relative transition-all duration-300"
              :class="{
                'text-primary-600 bg-white shadow-sm': tabCount === index.toString(),
                'text-gray-600 hover:text-primary-500 hover:bg-gray-100': tabCount !== index.toString(),
              }"
              :style="{ pointerEvents: (loading || bioDataLoading) ? 'none' : 'auto' }"
            >
              <div class="flex items-center gap-2">
                <span class="tab-icon" :class="getTabIcon(index)"></span>
                <span>{{ tab.label }}</span>
              </div>
              <span
                v-if="tabCount === index.toString()"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-underline"
              ></span>
            </T-ab>
          </TabList>

          <TabPanels class="flex-1 overflow-auto p-6">
            <transition-group name="fade-slide" mode="out-in">
              <TabPanel
                v-for="(tab, index) in tabs"
                :key="index"
                :value="index.toString()"
                class="h-full panel-content"
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

const {
  tabCount,
  downloadStudentBiodata,
  headTitle,
  subTitle,
  loading: bioDataLoading,
} = useStudentBioData()
const { user, getStudentInformation, loading } = useStudentDashboard()

onMounted(async () => {
  await getStudentInformation()
})

const tabs = [
  { label: 'Bio Info', component: BioInfo, user: user.value },
  { label: 'Health Info', component: HealthInfo, user: user.value },
  { label: 'Next Of Kin Info', component: NextOfKinInfo, user: user.value },
  /*   { label: 'Sponsorship Info', component: SponsorInformation, user: user.value, loading: loading } */
]

// Function to get icon class for each tab
const getTabIcon = (index: number) => {
  const icons = [
    'fas fa-user',       // Bio Info
    'fas fa-heartbeat',  // Health Info
    'fas fa-users',      // Next of Kin
    'fas fa-money-bill'  // Sponsorship (commented out)
  ]
  return icons[index] || 'fas fa-circle'
}

</script>

<style scoped>
/* Animation for the tab underline */
.animate-underline {
  animation: underline-grow 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes underline-grow {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }

  to {
    transform: scaleX(1);
  }
}

/* Transition effects for tab content */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.5, 0, 0.5, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Tab styling */
.tab {
  position: relative;
  cursor: pointer;
  outline: none;
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.card-hover:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

/* Download button styling */
.download-btn {
  position: relative;
  overflow: hidden;
}

.download-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.download-btn:hover::after {
  left: 100%;
}

/* Tab icon styling */
.tab-icon {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Panel content animations */
.panel-content {
  animation: fadeIn 0.5s ease-out;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
}

/* Fade in animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.6s ease-out 0.2s forwards;
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .grid-cols-12 {
    grid-template-columns: 1fr;
  }

  .lg\:col-span-5,
  .lg\:col-span-7 {
    grid-column: span 1;
  }
}
</style>
