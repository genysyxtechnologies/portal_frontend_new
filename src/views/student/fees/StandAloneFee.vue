<template>
  <div class="flex flex-col gap-6">
    <!-- Header with gradient background -->
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
          <h1 class="text-white text-2xl md:text-3xl font-bold">Stand Alone Fees</h1>
          <p class="text-blue-100 text-sm md:text-base">
            Manage your stand alone fee payments and transactions
          </p>
        </div>
        <div class="flex items-center gap-4">
          <Dropdown
            v-model="selectedSession"
            :options="sessions || []"
            optionLabel="name"
            placeholder="Select Session"
            class="w-full md:w-[300px] shadow-md"
            :pt="{
              root: {
                class:
                  'transition-all duration-300 bg-white/95 backdrop-blur hover:shadow-xl rounded-lg',
              },
              input: { class: 'font-medium' },
              trigger: { class: 'text-blue-600' },
            }"
          />
        </div>
      </div>
    </div>

    <!-- Animated Content Area -->
    <transition name="fade-zoom" mode="out-in">
      <div
        v-if="!selectedSession"
        class="bg-white flex items-center justify-center h-[60vh] rounded-xl p-6 overflow-hidden shadow-md"
        v-motion="{
          initial: {
            opacity: 0,
            y: 20,
            scale: 0.95,
          },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 500,
              type: 'spring',
              damping: 15,
            },
          },
          leave: {
            opacity: 0,
            scale: 0.9,
            transition: {
              duration: 250,
            },
          },
        }"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <div class="relative">
            <!-- Animated document icon with modern design -->
            <div class="bg-[#E9F5FF] p-6 rounded-full relative overflow-hidden">
              <svg
                class="w-16 h-16 text-[#0D47A1] relative z-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                v-motion="{
                  initial: { opacity: 0, scale: 0.8 },
                  enter: {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 200, duration: 600, type: 'spring' },
                  },
                }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <!-- Pulsing animation circle -->
              <div
                class="absolute inset-0 bg-[#90CAF9]/30 -z-0"
                v-motion="{
                  initial: { scale: 0.8, opacity: 0.5 },
                  enter: {
                    scale: 1.2,
                    opacity: 0.3,
                    transition: {
                      duration: 2000,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    },
                  },
                }"
              ></div>
            </div>
          </div>

          <h1
            class="text-2xl font-semibold text-gray-700"
            v-motion="{
              initial: { opacity: 0, y: 10 },
              enter: {
                opacity: 1,
                y: 0,
                transition: { delay: 300, duration: 400 },
              },
            }"
          >
            No Session Selected
          </h1>

          <p
            class="text-lg text-gray-500 max-w-md"
            v-motion="{
              initial: { opacity: 0, y: 10 },
              enter: {
                opacity: 1,
                y: 0,
                transition: { delay: 400, duration: 400 },
              },
            }"
          >
            Please select an academic session to view your stand alone fee information
          </p>
        </div>
      </div>

      <div v-else class="flex flex-col gap-6">
        <FeeData
          :name="fee?.student?.name"
          :level="fee?.level?.title"
          :matric="fee?.student?.username"
          :session="selectedSession?.name"
          :faculty="fee?.student?.programme?.department?.faculty?.name"
          :email="fee?.student?.email"
          :department="fee?.student?.programme?.department?.name"
          :programme="fee?.student?.programme?.name"
          :date="formattedDate"
          :feeItems="fee?.feeItems"
          :feePayment="fee?.feePayment"
          :loading="loading"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentFee } from '@/services/student/useStudentFee'
import { ref, onMounted, watch } from 'vue'
import FeeData from './FeeData.vue'
import Dropdown from 'primevue/dropdown'

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const { getStudentFee, fee, useFormattedDate, loading } = useStudentFee()

const selectedSession = ref()
const { formattedDate } = useFormattedDate()

onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})

watch(selectedSession, async (newSession) => {
  if (newSession && user.value) {
    await getStudentFee(String(user.value.username), newSession.id)
  }
})
</script>

<style scoped>
/* Custom animations */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
