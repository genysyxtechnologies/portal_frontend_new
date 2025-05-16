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
          transition: { duration: 500, type: 'spring', stiffness: 100 }
        }
      }"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-white text-2xl md:text-3xl font-bold">Fee Management</h1>
          <p class="text-blue-100 text-sm md:text-base">
            Track your payments and manage your financial obligations
          </p>
        </div>
        <div class="flex items-center gap-4">
          <Sel-ect
            :size="'large'"
            v-model="selectedSession"
            :options="sessions"
            optionLabel="name"
            placeholder="Select Session"
            class="w-full md:w-[300px] shadow-md"
            :pt="{
              root: { class: 'transition-all duration-300 bg-white/95 backdrop-blur hover:shadow-xl rounded-lg' },
              input: { class: 'font-medium' },
              trigger: { class: 'text-blue-600' }
            }"
          />
        </div>
      </div>
    </div>

    <!-- Financial Summary Cards -->
    <div 
      v-if="selectedSession && fee" 
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
      v-motion="{
        initial: { opacity: 0 },
        enter: { 
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
      }"
    >
      <!-- Total Fees Card -->
      <div 
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
        }"
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 border-l-4 border-blue-500"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-gray-500 font-medium">Total Fees</h3>
          <div class="bg-blue-50 p-2 rounded-full">
            <i class="pi pi-wallet text-blue-500"></i>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-gray-800">
            {{ formatCurrency(calculateTotalFees()) }}
          </span>
          <span class="text-sm text-gray-500">{{ selectedSession?.name }}</span>
        </div>
      </div>

      <!-- Paid Amount Card -->
      <div 
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.1 } }
        }"
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 border-l-4 border-green-500"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-gray-500 font-medium">Paid Amount</h3>
          <div class="bg-green-50 p-2 rounded-full">
            <i class="pi pi-check-circle text-green-500"></i>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-gray-800">
            {{ formatCurrency(calculatePaidAmount()) }}
          </span>
          <span class="text-sm text-gray-500">{{ calculatePaymentPercentage() }}% completed</span>
        </div>
      </div>

      <!-- Outstanding Balance Card -->
      <div 
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.2 } }
        }"
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 border-l-4 border-amber-500"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-gray-500 font-medium">Outstanding Balance</h3>
          <div class="bg-amber-50 p-2 rounded-full">
            <i class="pi pi-exclamation-circle text-amber-500"></i>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-gray-800">
            {{ formatCurrency(calculateOutstandingBalance()) }}
          </span>
          <span class="text-sm text-gray-500 flex items-center gap-1">
            <i class="pi pi-clock text-xs text-amber-500"></i> Payment due date: {{ getFormattedDueDate() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Progress bar for payment completion -->
    <div 
      v-if="selectedSession && fee" 
      class="bg-white rounded-xl p-5 shadow-md"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 400, delay: 0.3 } }
      }"
    >
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-700 font-medium">Payment Progress</h3>
          <span class="text-sm font-medium text-blue-600">{{ calculatePaymentPercentage() }}%</span>
        </div>
        <ProgressBar 
          :value="calculatePaymentPercentage()" 
          :showValue="false" 
          :pt="{
            root: { class: 'h-3 rounded-full overflow-hidden' },
            value: { class: 'bg-gradient-to-r from-[#0D47A1] to-[#90CAF9]' }
          }"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
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
            Please select an academic session to view your complete fee details
          </p>

          <!-- Animated arrow pointing to select -->
          <div
            class="mt-6 text-[#0D47A1] flex items-center gap-2 bg-[#E9F5FF] px-4 py-2 rounded-full shadow-sm"
            v-motion="{
              initial: { opacity: 0, x: -20 },
              enter: {
                opacity: 1,
                x: 0,
                transition: { delay: 500, duration: 500, type: 'spring' },
              },
            }"
          >
            <span class="font-medium">Choose from the dropdown above</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 animate-bounce-vertical"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-6">
        <!-- Redesigned Invoice Generation Banner -->
        <div 
          class="bg-gradient-to-r from-[#0D47A1] to-[#90CAF9] rounded-xl p-6 shadow-lg relative overflow-hidden"
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500 } }
          }"
        >
          <!-- Decorative abstract shapes for modern look -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-[#90CAF9] opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-[#0D47A1] opacity-20 rounded-full -ml-10 -mb-10"></div>
          
          <div class="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div class="flex flex-col gap-2">
              <h2 class="text-white text-xl font-bold">Generate Fee Invoice</h2>
              <p class="text-blue-100 text-sm max-w-md">
                Download your official fee invoice for submission or payment processing
              </p>
            </div>
            <But-ton 
              @click="downloadInvoice" 
              label="Download Invoice" 
              icon="pi pi-download" 
              class="bg-white text-blue-700 border-none shadow-md hover:shadow-lg transition-shadow"
              :pt="{
                root: { class: 'font-semibold px-4 py-2' },
                label: { class: 'font-semibold' }
              }"
            />
          </div>
        </div>
        
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
import { ref, onMounted, watch, computed } from 'vue'
import FeeData from './FeeData.vue'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'

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
  },
)

// Helper functions for financial calculations
function calculateTotalFees() {
  if (!fee.value?.feeItems) return 0
  return fee.value.feeItems.reduce((sum, item) => sum + (item.amount || 0), 0)
}

function calculatePaidAmount() {
  if (!fee.value?.feeItems) return 0
  const paidItems = fee.value.feeItems.filter(item => item.feesPayment?.cleared)
  return paidItems.reduce((sum, item) => sum + (item.amount || 0), 0)
}

function calculateOutstandingBalance() {
  return calculateTotalFees() - calculatePaidAmount()
}

function calculatePaymentPercentage() {
  const total = calculateTotalFees()
  if (total === 0) return 0
  return Math.round((calculatePaidAmount() / total) * 100)
}

function getFormattedDueDate() {
  // This would ideally come from the API, but for now we'll use a placeholder
  return new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
/* Custom animations */
.animate-bounce-horizontal {
  animation: bounce-horizontal 1.5s infinite;
}

@keyframes bounce-horizontal {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

.animate-bounce-vertical {
  animation: bounce-vertical 1.5s infinite;
}

@keyframes bounce-vertical {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
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

/* Glass effect for certain components */
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .head-title {
    font-size: 1.5rem;
  }
}

/* Box shadow utilities */
.hover-shadow-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}
</style>