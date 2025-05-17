<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title text-2xl font-bold text-gray-800">Bio Data</h1>
      <div class="flex items-center gap-4">
        <ReUsableButtons
          :disabled="loading || bioDataLoading || !user?.username"
          :label="'Download'"
          class="hover:scale-105 transition-transform"
          @on-click="downloadStudentBiodata(user?.username!)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-180px)] gap-6">
      <!-- User Information Card -->
      <div
        class="lg:col-span-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <div class="p-6 h-full">
          <UserInformation
            :first-label="'Name'"
            :second-label="'Matric Number'"
            :third-label="'Phone Number'"
            :third-input="user?.phone"
            :first-input="user?.name"
            :second-input="user?.username"
          />
        </div>
      </div>

      <!-- Tabbed Bio Data Section -->
      <div
        class="lg:col-span-7 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md relative"
      >
        <SpinningAnimation
          :loading="loading || bioDataLoading"
          :head-title="headTitle"
          :sub-title="subTitle"
          style="
            z-index: 9999;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
          "
        />
        <Ta-bs v-model:value="tabCount" class="h-full flex flex-col">
          <TabList class="flex border-b border-gray-200">
            <T-ab
              v-for="(tab, index) in tabs"
              :key="index"
              :value="index.toString()"
              class="px-6 py-3 text-sm font-medium h-[5rem] relative transition-all duration-200"
              :class="{
                'text-primary-500': tabCount === index.toString(),
                'text-gray-500 hover:text-gray-700': tabCount !== index.toString(),
              }"
            >
              {{ tab.label }}
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
                class="h-full"
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

watch(
  () => tabCount.value,
  (value) => {
    console.log(value)
  },
  { immediate: true },
)
</script>

<style scoped>
/* Animation for the tab underline */
.animate-underline {
  animation: underline-grow 0.3s ease-out;
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
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Tab styling */
.tab {
  position: relative;
  cursor: pointer;
  outline: none;
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





<template>
  <div>
    <transition name="fade">
      <div
        v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center rounded-lg"
      >
        <div class="loading-content text-center">
          <div class="spinner"></div>
          <p class="mt-4 text-lg font-medium text-gray-700">{{ headTitle }}</p>
          <p class="text-sm text-gray-500">{{ subTitle }}</p>
        </div>
      </div>
    </transition>

    <!-- Skeleton loader -->
    <transition name="fade">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 12" :key="'skeleton-' + i" class="space-y-3">
          <div class="h-5 bg-gray-200 rounded w-1/3 shimmer"></div>
          <div class="h-12 bg-gray-100 rounded-md shimmer"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  headTitle: {
    type: String,
    default: 'Loading your information...',
  },

  subTitle: {
    type: String,
    default: 'Please wait while we prepare your form',
  },
})
</script>
<style scoped>
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Shimmer effect for skeleton loader */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Loading content styling */
.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

