<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section with Gradient Background -->
    <div
      class="rounded-xl p-6 shadow-lg"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, type: 'spring', stiffness: 100 },
        },
      }"
      :style="{
        background: `linear-gradient(to right, var(--primary-dark-color), var(--primary-light-color))`,
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

    <!-- Tab Navigation using ModernTabs -->
    <div
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 500 } },
      }"
    >
      <ModernTabs
        v-model="activeTabIndex"
        :tabs="tabsConfig"
        @tab-change="handleTabChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, h } from 'vue'
import ModernTabs from '@/components/shared/ModernTabs.vue'
import ServicePayment from './ServicePayment.vue'

// Active tab selection
const activeTabIndex = ref(0)

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

// Coming Soon Component
const ComingSoonComponent = defineAsyncComponent(() =>
  Promise.resolve({
    setup() {
      return () =>
        h('div', { class: 'p-6' }, [
          h(
            'div',
            {
              class: 'flex flex-col items-center justify-center py-16 text-center',
            },
            [
              // Decorative elements
              h('div', { class: 'relative mb-8' }, [
                h('div', {
                  class: 'absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-60 scale-150',
                }),
                h(
                  'div',
                  {
                    class: 'relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-full text-white',
                  },
                  [h('i', { class: 'pi pi-clock-fill text-5xl' })]
                ),
              ]),
              h('h2', { class: 'text-3xl font-bold text-gray-800 mb-4' }, 'COMING SOON'),
              h(
                'p',
                { class: 'text-gray-500 max-w-md mb-8 text-lg' },
                "We're working hard to bring you a new and improved registration experience. This feature will be available in the near future."
              ),
              h('div', { class: 'flex items-center justify-center gap-2 text-sm text-blue-600' }, [
                h('i', { class: 'pi pi-info-circle' }),
                h('span', 'Check back soon for updates'),
              ]),
            ]
          ),
        ])
    },
  })
)

// Tab configuration
const tabsConfig = ref([
  {
    label: 'Payment',
    icon: 'pi pi-credit-card',
    component: ServicePayment,
  },
  {
    label: 'Registration',
    icon: 'pi pi-user-edit',
    component: ComingSoonComponent,
  },
])

// Tab change handler
const handleTabChange = (index: number, tab: any) => {
  // console.log('Tab changed to:', index, tab.label)
}
</script>

<style scoped>
/* Custom styles for the self-service portal */
</style>
