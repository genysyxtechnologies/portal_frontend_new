<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Fees</h1>
      <div class="flex items-center gap-4">
        <Sel-ect
          :size="'large'"
          v-model="selectedSession"
          :options="sessions"
          optionLabel="name"
          placeholder="Select Session"
          class="card w-[300px]"
          :pt="{
            root: { class: 'transition-all duration-300 hover:shadow-md' }
          }"
        />
      </div>
    </div>

    <!-- Animated Content Area -->
    <transition
      name="fade-zoom"
      mode="out-in"
    >
      <div v-if="!selectedSession"
           class="bg-white flex items-center justify-center h-[60vh] rounded-xl p-6 overflow-hidden"
           v-motion="{
             initial: {
               opacity: 0,
               y: 20,
               scale: 0.95
             },
             enter: {
               opacity: 1,
               y: 0,
               scale: 1,
               transition: {
                 duration: 500,
                 type: 'spring',
                 damping: 15
               }
             },
             leave: {
               opacity: 0,
               scale: 0.9,
               transition: {
                 duration: 250
               }
             }
           }"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <div class="relative">
            <!-- Animated document icon -->
            <svg
              class="w-20 h-20 text-gray-300 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              v-motion="{
                initial: {
                  opacity: 0,
                  scale: 0.8,
                  rotate: -10
                },
                enter: {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    delay: 200,
                    duration: 600,
                    type: 'spring'
                  }
                }
              }"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>

            <!-- Pulsing animation circle -->
            <div
              class="absolute inset-0 rounded-full bg-blue-100/30 -z-10"
              v-motion="{
                initial: { scale: 0.8 },
                enter: {
                  scale: 1.2,
                  transition: {
                    duration: 2000,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }
              }"
            ></div>
          </div>

          <h1
            class="head-title text-2xl font-semibold text-gray-700"
            v-motion="{
              initial: { opacity: 0, y: 10 },
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 300,
                  duration: 400
                }
              }
            }"
          >
            No session selected
          </h1>

          <p
            class="text-lg text-gray-500 max-w-md"
            v-motion="{
              initial: { opacity: 0, y: 10 },
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 400,
                  duration: 400
                }
              }
            }"
          >
            Select a session/semester above to view your fee details
          </p>

          <!-- Animated arrow pointing to select -->
          <div
            class="mt-6 text-blue-500 flex items-center gap-2"
            v-motion="{
              initial: { opacity: 0, x: -20 },
              enter: {
                opacity: 1,
                x: 0,
                transition: {
                  delay: 500,
                  duration: 500,
                  type: 'spring'
                }
              }
            }"
          >
            <span>Choose from the dropdown</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 animate-bounce-horizontal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-4">
        <StudentFeeContent @downloadInvoice="downloadInvoice" />
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
import StudentFeeContent from './StudentFeeContent.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentFee } from '@/services/student/useStudentFee'
import { ref, onMounted, watch } from 'vue'
import FeeData from './FeeData.vue'

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const { getStudentFee, fee, useFormattedDate, downloadInvoice, loading } = useStudentFee()

const selectedSession = ref()
const { formattedDate } = useFormattedDate()

onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})

watch(
  () => selectedSession.value,
  async (value) => {
    if (value) {
      await getStudentFee(user.value?.username!, value.id)
    }
  }
)
</script>

<style scoped>
/* Custom animations */
.animate-bounce-horizontal {
  animation: bounce-horizontal 1.5s infinite;
}

@keyframes bounce-horizontal {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

/* Transition effects */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .head-title {
    font-size: 1.5rem;
  }
}
</style>
