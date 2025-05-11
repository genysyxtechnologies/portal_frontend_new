<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title text-2xl font-bold text-gray-800">Bio Data</h1>
      <div class="flex items-center gap-4">
        <ReUsableButtons :label="'Download'" class="hover:scale-105 transition-transform" />
        <ReUsableButtons :label="'Update'" class="hover:scale-105 transition-transform" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-180px)] gap-6">
      <!-- User Information Card -->
      <div class="lg:col-span-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="p-6 h-full">
          <UserInformation :first-label="'Name'" :second-label="'Matric Number'" :third-label="'Phone Number'"
            :third-input="'09068842993'" />
        </div>
      </div>

      <!-- Tabbed Bio Data Section -->
      <div
        class="lg:col-span-7 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <Ta-bs v-model:value="tabCount" class="h-full flex flex-col">
          <TabList class="flex border-b border-gray-200">
            <T-ab v-for="(tab, index) in tabs" :key="index" :value="index.toString()"
              class="px-6 py-3  text-sm font-medium h-[5rem] relative transition-all duration-200" :class="{
                'text-primary-500': tabCount === index.toString(),
                'text-gray-500 hover:text-gray-700': tabCount !== index.toString()
              }">
              {{ tab.label }}
              <span v-if="tabCount === index.toString()"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-underline"></span>
            </T-ab>
          </TabList>

          <TabPanels class="flex-1 overflow-auto p-6">
            <transition-group name="fade-slide" mode="out-in">
              <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index.toString()" class="h-full">
                <component :is="tab.component" />
              </TabPanel>
            </transition-group>
          </TabPanels>
        </Ta-bs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserInformation from '../dashboard/UserInformation.vue';
import BioInfo from './BioInfo.vue';
import HealthInfo from './HealthInfo.vue';
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';
import NextOfKinInfo from './NextOfKinInfo.vue';
import SponsorInformation from './SponsorInformation.vue';
import { useStudentBioData } from '@/services/student/useStudentBioData';
import { watch } from 'vue';

const { tabCount } = useStudentBioData();

const tabs = [
  { label: 'Bio Info', component: BioInfo },
  { label: 'Health Info', component: HealthInfo },
  { label: 'Next Of Kin Info', component: NextOfKinInfo },
  { label: 'Sponsorship Info', component: SponsorInformation }
];


watch(() => tabCount.value, (value) => {
  console.log(value)
}, { immediate: true })
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
