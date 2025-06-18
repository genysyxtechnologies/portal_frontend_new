<template>
  <div class="flex flex-col gap-6">
    <!-- Header with gradient background -->
    <div
      class="relative overflow-hidden rounded-2xl p-8 shadow-xl"
      :style="{
        background: `linear-gradient(135deg, var(--primary-dark-color), var(--primary-light-color))`,
      }"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: {
          opacity: 1,
          y: 0,
          transition: { duration: 500, type: 'spring', stiffness: 100 },
        },
      }"
    >
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-4 -left-4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-white text-3xl md:text-4xl font-bold tracking-tight">Standalone Fees</h1>
          <p class="text-white/80 text-sm md:text-base max-w-xl">
            View and manage your additional fee payments for the selected academic session
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Dropdown
            v-model="selectedSession"
            :options="sessions || []"
            optionLabel="name"
            placeholder="Select Session"
            class="w-full sm:w-[280px]"
            :pt="{
              root: {
                class:
                  'bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl',
              },
              input: { class: 'font-medium py-3 px-4' },
              trigger: { class: 'text-blue-600' },
            }"
          />
          <button
            v-if="selectedSession && filteredStandalones.length > 0"
            class="px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Animated Content Area -->
    <transition name="fade-zoom" mode="out-in">
      <!-- No Session Selected State -->
      <div
        v-if="!selectedSession"
        key="no-session"
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

      <!-- Session Selected Content -->
      <div v-else key="session-content" class="space-y-6">
        <!-- Search and Filter Bar -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" style="margin-bottom: .5em;">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search fees by title, faculty, or category..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div class="flex gap-3">
              <select v-model="filterBy" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium">
                <option value="">All Categories</option>
                <option value="generic">Generic</option>
                <option value="beforeRegistration">Before Registration</option>
                <option value="beforeSchoolFee">Before School Fee</option>
              </select>
              <select
                v-if="selectedSession?.semesters?.length > 0"
                v-model="selectedSemester"
                class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
              >
                <option value="">All Semesters</option>
                <option v-for="semester in selectedSession.semesters" :key="semester.id" :value="semester.id">
                  {{ semester.title }}
                </option>
              </select>
              <button
                v-if="searchQuery || filterBy || selectedSemester"
                @click="clearFilters"
                class="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Fees List View -->
        <div class="flex flex-col gap-4">
          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <div class="flex flex-col items-center justify-center gap-6">
              <div class="relative">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Loading Fees</h3>
                <p class="text-gray-600">Fetching your standalone fees for the selected session...</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!filteredStandalones.length" class="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <div class="text-center">
              <div class="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ searchQuery || filterBy ? 'No Matching Fees' : 'No Fees Available' }}
              </h3>
              <p class="text-gray-600 max-w-md mx-auto mb-6">
                {{ searchQuery || filterBy
                  ? 'No standalone fees match your current search or filter criteria. Try adjusting your filters.'
                  : 'There are no standalone fees available for the selected academic session at this time.'
                }}
              </p>
              <button class="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                Refresh
              </button>
            </div>
          </div>

          <!-- Fees Grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="(item, index) in filteredStandalones"
              :key="item.fee.id"
              class="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
              v-motion="{
                initial: { opacity: 0, y: 20 },
                enter: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 100,
                    duration: 500,
                    type: 'spring',
                    stiffness: 100,
                  },
                },
              }"
            >
              <!-- Card accent -->
              <div class="absolute top-0 left-0 w-full h-1" :style="{ background: `linear-gradient(to right, var(--secondary-color), var(--secondary-color))` }"></div>

              <!-- Card content -->
              <div class="flex flex-col h-full">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {{ item.fee.feeItemTitle.title }}
                    </h3>
                    <div class="mt-1 flex items-center gap-2">
                      <span class="text-2xl font-bold text-blue-600">
                        {{ formatCurrency(item.fee.amount) }}
                      </span>
                      <div v-if="item.payment && calculatePaidAmount(item) > 0" class="text-sm text-emerald-600 font-medium">
                        {{ calculatePaymentPercentage(item) }}% paid
                      </div>
                    </div>
                  </div>

                  <!-- Payment status indicator -->
                  <div class="flex-shrink-0 ml-4">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="getPaymentStatus(item).color"
                      :title="getPaymentStatus(item).title"
                    ></div>
                  </div>
                </div>

                <!-- Details grid -->
                <div class="grid grid-cols-2 gap-3 text-sm mb-4 flex-grow">
                  <div v-if="item.fee.faculty" class="space-y-1">
                    <p class="text-gray-500 font-medium">Faculty</p>
                    <p class="text-gray-900 truncate">{{ item.fee.faculty.name }}</p>
                  </div>
                  <div v-if="item.fee.level" class="space-y-1">
                    <p class="text-gray-500 font-medium">Level</p>
                    <p class="text-gray-900">{{ item.fee.level.title }}</p>
                  </div>
                  <div v-if="item.fee.semester" class="space-y-1">
                    <p class="text-gray-500 font-medium">Semester</p>
                    <p class="text-gray-900">{{ item.fee.semester.title }}</p>
                  </div>
                  <div v-if="item.fee.studentCategory" class="space-y-1">
                    <p class="text-gray-500 font-medium">Category</p>
                    <p class="text-gray-900">{{ item.fee.studentCategory }}</p>
                  </div>
                  <div v-if="item.payment?.transactionId" class="space-y-1 col-span-2">
                    <p class="text-gray-500 font-medium">Invoice Number</p>
                    <p class="text-gray-900 font-mono text-xs">{{ item.payment.transactionId }}</p>
                  </div>
                  <div v-if="item.payment && calculatePaidAmount(item) > 0" class="space-y-1">
                    <p class="text-gray-500 font-medium">Amount Paid</p>
                    <p class="text-emerald-600 font-semibold">{{ formatCurrency(calculatePaidAmount(item)) }}</p>
                  </div>
                  <div v-if="item.payment && calculateOutstandingBalance(item) > 0" class="space-y-1">
                    <p class="text-gray-500 font-medium">Outstanding</p>
                    <p class="text-amber-600 font-semibold">{{ formatCurrency(calculateOutstandingBalance(item)) }}</p>
                  </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                  <span v-if="item.fee.generic" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Generic
                  </span>
                  <span v-if="item.fee.beforeRegistration" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    Before Registration
                  </span>
                  <span v-if="item.fee.beforeSchoolFee" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Before School Fee
                  </span>
                </div>

                <!-- Action buttons -->
                <div class="mt-auto">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <!-- Primary action button -->
                    <button
                      @click="handlePayment(item)"
                      :disabled="loading"
                      :class="getButtonClass(item)"
                      class="flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="!loading" class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {{ getPaymentButtonText(item) }}
                    </button>

                    <!-- Download invoice button (show when invoice exists) -->
                    <button
                      v-if="shouldShowDownloadButton(item)"
                      @click="handleDownloadInvoice(item)"
                      :disabled="loading"
                      class="flex-1 sm:flex-initial sm:min-w-[160px] px-4 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { type StandaloneItem, useStudentFee } from '@/services/student/useStudentFee'
import { ref, onMounted, watch, computed } from 'vue'
import Dropdown from 'primevue/dropdown'

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const {
  standalones,
  loading,
  getStandaloneFees,
  initializeTransaction,
  loadPaymentGateway,
  downloadStandaloneInvoice,
  message,
  messageType,
  messageShow,
  closeMessage
} = useStudentFee()

const selectedSession = ref()
const searchQuery = ref('')
const filterBy = ref('')
const selectedSemester = ref('')

const filteredStandalones = computed(() => {
  if (!standalones.value) return []

  let filtered = standalones.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.fee.feeItemTitle.title.toLowerCase().includes(query) ||
      item.fee.faculty?.name.toLowerCase().includes(query) ||
      item.fee.studentCategory?.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filterBy.value) {
    filtered = filtered.filter(item => {
      switch (filterBy.value) {
        case 'generic':
          return item.fee.generic
        case 'beforeRegistration':
          return item.fee.beforeRegistration
        case 'beforeSchoolFee':
          return item.fee.beforeSchoolFee
        default:
          return true
      }
    })
  }

  // Apply semester filter
  if (selectedSemester.value) {
    filtered = filtered.filter(item =>
      item.fee.semester?.id === selectedSemester.value
    )
  }

  return filtered
})

const clearFilters = () => {
  searchQuery.value = ''
  filterBy.value = ''
  selectedSemester.value = ''
}

// Handle payment initialization or payment processing
const handlePayment = async (item: any) => {
  if (!user.value) return


  try {
    if (item.payment == null) {
      // Generate invoice first
      const payment = await initializeTransaction(item.fee, item.payment, String(user.value.userId))
      if (payment) {
        // Refresh the fees list to get updated payment info
        await getStandaloneFees(String(user.value.username), selectedSession.value.id)
      }
    } else {
      // Payment exists, check if it's cleared
      if (item.payment.cleared) {
        // Already paid, maybe download receipt or show message
        message.value = 'This fee has already been paid'
        messageType.value = 'warning'
        messageShow.value = true
        return
      }


      // Check if this is a balance payment (partial payments exist with outstanding balance)
      if (isBalancePayment(item) && calculateOutstandingBalance(item) > 0 && noPendingParts(item)) {

        // Generate a new invoice for the outstanding balance
        await initializeTransaction(item.fee, item.payment, String(user.value.userId))
        // now here
        //if (balancePayment) {
          // Refresh the fees list to get updated payment info
          await getStandaloneFees(String(user.value.username), selectedSession.value.id)
        //}
      } else {
        // Payment exists but not cleared, proceed with payment
        await loadPaymentGateway(item.payment, item.fee, user.value.email)
      }
    }
  } catch (error) {
    console.error('Payment error:', error)
    message.value = 'Payment processing failed. Please try again.'
    messageType.value = 'error'
    messageShow.value = true
  }
}

// Handle invoice download
const handleDownloadInvoice = async (item: any) => {
  if (!user.value || !item.payment) return

  try {
    await downloadStandaloneInvoice(item.payment)
  } catch (error) {
    console.error('Invoice download error:', error)
    message.value = 'Failed to download invoice. Please try again.'
    messageType.value = 'error'
    messageShow.value = true
  }
}

// Calculate amount already paid from parts (matches extracted logic)
function calculatePaidAmount(item: any): number {
  // If the fee payment is cleared, consider all items as paid
  if (item.payment?.cleared) return item.fee.amount

  // If no payment parts exist, no amount has been paid
  if (!item.payment?.partPayments || item.payment.partPayments.length < 1) return 0

  // Sum all amounts paid from part payments
  return item.payment.partPayments
    .map((e: any) => e.amountPaid || 0)
    .reduce((prev: number, curr: number) => prev + curr, 0)
}

function calculateOutstandingBalance(item: StandaloneItem): number {
  return item.fee.amount - calculatePaidAmount(item)
}

function noPendingParts(item: StandaloneItem): boolean {
  // console.log("Test", (item.payment?.partPayments?.length ?? 0) > 0  && (item.payment?.partPayments?.filter((e: any) => !e.success)?.length ?? 0) < 1)
  return (item.payment?.partPayments?.length ?? 0) > 0  && (item.payment?.partPayments?.filter((e: any) => !e.success)?.length ?? 0) < 1
}

// Check if balance payment is available (from extracted logic)
function isBalancePayment(item: any): boolean {
  return (item.payment?.partPayments?.length > 0 && !item.payment?.cleared) ||
    (calculatePaidAmount(item) < item.fee.amount && item.payment?.partPayments?.length > 0)
}

function calculatePaymentPercentage(item: any): number {
  const total = item.fee.amount
  if (total === 0) return 0
  return Math.floor((calculatePaidAmount(item) / total) * 100)
}

function formatCurrency(amount: number): string {
  if (!amount || amount === 0) return '₦0'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get payment button text based on payment status
const getPaymentButtonText = (item: any) => {
  if (loading.value) return 'Processing...'

  if (item.payment == null) {
    return 'Generate Invoice'
  } else if (item.payment.cleared) {
    return 'Paid ✓'
  } else if (isBalancePayment(item) && calculateOutstandingBalance(item) > 0) {
    return `Balance Invoice (${formatCurrency(calculateOutstandingBalance(item))})`
  } else {
    return 'Pay Now'
  }
}

// Get payment status for indicator
const getPaymentStatus = (item: any) => {
  if (item.payment == null) {
    return { status: 'pending', color: 'bg-gray-400', title: 'Invoice Not Generated' }
  } else if (item.payment.cleared) {
    return { status: 'paid', color: 'bg-green-400', title: 'Payment Completed' }
  } else {
    return { status: 'unpaid', color: 'bg-yellow-400 animate-pulse', title: 'Pending Payment' }
  }
}

// Check if download button should be shown
const shouldShowDownloadButton = (item: any) => {
  return item.payment != null // Show download button if invoice exists (payment record exists)
}

// Get button class based on payment status
const getButtonClass = (item: any) => {
  if (item.payment == null) {
    // Generate Invoice - Blue/Primary color
    return 'bg-blue-600 hover:bg-blue-700 generate-invoice-button'
  } else if (item.payment.cleared) {
    // Paid - Green color
    return 'bg-green-600 hover:bg-green-700 paid-button'
  } else if (isBalancePayment(item) && calculateOutstandingBalance(item) > 0) {
    // Balance Payment - Emerald color
    return 'bg-emerald-600 hover:bg-emerald-700 balance-payment-button'
  } else {
    // Pay Now - Orange/Secondary color
    return 'pay-now-button'
  }
}

onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})

watch(selectedSession, async (newSession) => {
  if (newSession && user.value) {
    // Clear semester filter when session changes
    selectedSemester.value = ''
    await getStandaloneFees(String(user.value.username), newSession.id)
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

/* Pay Now button styles */
.pay-now-button {
  background: var(--secondary-color);
}

.pay-now-button:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px var(--secondary-color);
}

/* Generate Invoice button hover effect */
.generate-invoice-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(37, 99, 235, 0.4);
}

/* Paid button hover effect */
.paid-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(34, 197, 94, 0.4);
}

/* Balance Payment button hover effect */
.balance-payment-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(16, 185, 129, 0.4);
}
</style>
