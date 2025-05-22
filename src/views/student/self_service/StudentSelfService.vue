<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section with Gradient Background -->
    <div
      class="bg-gradient-to-r from-[#0D47A1] to-[#90CAF9] rounded-xl p-6 shadow-lg"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, type: 'spring', stiffness: 100 },
        },
      }"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-white text-2xl md:text-3xl font-bold">Self Service Portal</h1>
          <p class="text-blue-100 text-sm md:text-base">
            Manage your payments and registration services
          </p>
        </div>
        <div
          class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 shadow-sm"
          v-motion="{
            initial: { opacity: 0, scale: 0.9 },
            enter: {
              opacity: 1,
              scale: 1,
              transition: { delay: 300, duration: 500 },
            },
          }"
        >
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-clock text-sm"></i>
            <span class="text-sm font-medium">{{ currentDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div
      class="bg-white rounded-xl shadow-md overflow-hidden"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 500 } },
      }"
    >
      <!-- Tab Headers -->
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'payment'"
          class="flex-1 py-4 px-6 text-center transition-all duration-200 relative"
          :class="{
            'text-blue-600 font-medium': activeTab === 'payment',
            'text-gray-500 hover:text-gray-700': activeTab !== 'payment',
          }"
        >
          <div class="flex items-center justify-center gap-2">
            <i class="pi pi-credit-card"></i>
            <span>Payment</span>
          </div>
          <div
            class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300"
            :class="activeTab === 'payment' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </button>
        <button
          @click="activeTab = 'registration'"
          class="flex-1 py-4 px-6 text-center transition-all duration-200 relative"
          :class="{
            'text-blue-600 font-medium': activeTab === 'registration',
            'text-gray-500 hover:text-gray-700': activeTab !== 'registration',
          }"
        >
          <div class="flex items-center justify-center gap-2">
            <i class="pi pi-user-edit"></i>
            <span>Registration</span>
          </div>
          <div
            class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300"
            :class="activeTab === 'registration' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-1">
        <transition
          name="fade-slide"
          mode="out-in"
          @enter="onTransitionEnter"
          @leave="onTransitionLeave"
        >
          <!-- Payment Tab Content -->
          <div v-if="activeTab === 'payment'" key="payment">
            <ServicePayment />
          </div>

          <!-- Registration Tab Content -->
          <div v-else-if="activeTab === 'registration'" key="registration" class="p-6">
            <div
              class="flex flex-col items-center justify-center py-16 text-center"
              v-motion="{
                initial: { opacity: 0, scale: 0.9 },
                enter: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
              }"
            >
              <!-- Decorative elements -->
              <div class="relative mb-8">
                <div class="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-60 scale-150"></div>
                <div class="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-full text-white">
                  <i class="pi pi-clock-fill text-5xl"></i>
                </div>
              </div>

              <h2
                class="text-3xl font-bold text-gray-800 mb-4"
                v-motion="{
                  initial: { opacity: 0, y: 20 },
                  enter: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 500 } },
                }"
              >
                COMING SOON
              </h2>

              <p
                class="text-gray-500 max-w-md mb-8 text-lg"
                v-motion="{
                  initial: { opacity: 0, y: 20 },
                  enter: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 500 } },
                }"
              >
                We're working hard to bring you a new and improved registration experience.
                This feature will be available in the near future.
              </p>

              <div
                class="flex items-center justify-center gap-2 text-sm text-blue-600"
                v-motion="{
                  initial: { opacity: 0, y: 20 },
                  enter: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 500 } },
                }"
              >
                <i class="pi pi-info-circle"></i>
                <span>Check back soon for updates</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ServicePayment from './ServicePayment.vue'

// Active tab selection
const activeTab = ref('payment')

// Current date
const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

// Animation hooks
const onTransitionEnter = (el: Element) => {
  const animation = el.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    }
  )
  return animation.finished
}

const onTransitionLeave = (el: Element) => {
  const animation = el.animate(
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    }
  )
  return animation.finished
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
