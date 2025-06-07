<template>
  <div
    class="w-full bg-white flex flex-col gap-6 p-8 rounded-xl shadow-md overflow-hidden relative"
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { duration: 500 } },
    }"
  >
    <!-- Decorative elements -->
    <div
      class="absolute top-0 right-0 w-40 h-40 bg-blue-100 opacity-20 rounded-full -mr-10 -mt-10"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -ml-10 -mb-10"
    ></div>

    <!-- Payment Support Info Card -->
    <div
      class="bg-gradient-to-r from-blue-50 to-blue-100 w-full p-6 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden"
      v-motion="{
        initial: { opacity: 0, x: -20 },
        enter: { opacity: 1, x: 0, transition: { delay: 200, duration: 500 } },
      }"
    >
      <!-- Animated background pattern -->
      <div
        class="absolute inset-0 bg-grid-pattern opacity-10"
        v-motion="{
          initial: { backgroundPositionX: '0%' },
          enter: {
            backgroundPositionX: '100%',
            transition: { duration: 15000, repeat: Infinity, repeatType: 'mirror' },
          },
        }"
      ></div>

      <div class="relative z-10">
        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-3">
            <div class="bg-blue-500 p-2 rounded-full text-white">
              <i class="pi pi-info-circle text-lg"></i>
            </div>
            <h2 class="text-xl font-semibold text-blue-800">Payment Support</h2>
          </div>
          <p class="text-blue-700 leading-relaxed">
            Welcome to the self-help center. To verify a payment, please enter your payment invoice
            number below and click "Verify Payment". The system will check your payment status and
            display the results.
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Verification Section -->
    <div
      class="flex flex-col gap-4"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { delay: 400, duration: 500 } },
      }"
    >
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <i class="pi pi-search text-blue-500"></i>
        <span>Payment Verification</span>
      </h3>

      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="invoice" class="text-sm font-medium text-gray-700"
              >Payment Invoice Number</label
            >
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i class="pi pi-hashtag"></i>
              </span>
              <input
                id="invoice"
                v-model="invoiceNumber"
                type="text"
                placeholder="Enter your invoice number"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                @keyup.enter="verifyPayment"
              />
            </div>
            <p class="text-xs text-gray-500 italic">Example: 1234567890</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              @click="verifyPayment"
              :disabled="isLoading || !invoiceNumber"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="pi" :class="isLoading ? 'pi-spinner animate-spin' : 'pi-search'"></i>
              <span>{{ isLoading ? 'Verifying...' : 'Verify Payment' }}</span>
            </button>
            <button
              @click="resetForm"
              class="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <i class="pi pi-refresh"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="showResults" class="mt-2">
        <!-- Error Message for Invalid Invoice -->
        <div v-if="!paymentFound" class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="bg-red-100 p-3 rounded-full text-red-600">
              <i class="pi pi-times-circle text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-red-800 mb-2">Invalid Invoice Number</h3>
              <p class="text-red-700 mb-3">
                We couldn't find any payment record with the invoice number
                <span class="font-medium">{{ invoiceNumber }}</span
                >.
              </p>
              <div class="bg-white bg-opacity-50 rounded-lg p-3 border border-red-100">
                <p class="text-gray-700 text-sm">
                  Please check that you've entered the correct invoice number and try again. If you
                  continue to experience issues, please contact the finance department for
                  assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Message for Valid Invoice -->
        <div
          v-else-if="paymentFound && paymentCleared"
          class="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div class="flex items-start gap-4">
            <div class="bg-green-100 p-3 rounded-full text-green-600">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-green-800 mb-2">Payment Verified</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500">Invoice Number</span>
                  <span class="font-medium text-gray-800">{{ paymentInvoice }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500">Payment Status</span>
                  <span class="font-medium text-green-600 flex items-center gap-1">
                    <i class="pi pi-check-circle"></i> Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Payment Message -->
        <div
          v-else-if="paymentFound && !paymentCleared"
          class="bg-amber-50 border border-amber-200 rounded-xl p-6"
        >
          <div class="flex items-start gap-4">
            <div class="bg-amber-100 p-3 rounded-full text-amber-600">
              <i class="pi pi-exclamation-circle text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-amber-800 mb-2">Payment Pending</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500">Invoice Number</span>
                  <span class="font-medium text-gray-800">{{ paymentInvoice }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500">Status</span>
                  <span class="font-medium text-amber-600 flex items-center gap-1">
                    <i class="pi pi-clock"></i> Processing
                  </span>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-amber-200">
                <p class="text-amber-700 text-sm">
                  Your payment has been received but is still being processed. This typically takes
                  24-48 hours. Please check back later.
                </p>
                <button
                  @click="verifyInvoicePayment"
                  :disabled="isVerifying"
                  class="mt-4 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi" :class="isVerifying ? 'pi-spinner animate-spin' : 'pi-verified'"></i>
                  <span>{{ isVerifying ? 'Verifying...' : 'Verify Payment' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4">
          <div class="flex flex-col items-center">
            <div class="relative mb-6">
              <div
                class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <i class="pi pi-sync text-blue-600 animate-pulse"></i>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h3>
            <p class="text-gray-600 text-center mb-2">
              Please wait while we verify your payment...
            </p>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div class="bg-blue-600 h-1.5 rounded-full animate-pulse" style="width: 70%"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Help Section -->
    <!--  <div
      class="mt-4 border-t border-gray-100 pt-6"
      v-motion="{
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { delay: 600, duration: 500 } },
      }"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Need Help?</h3>
        <button
          @click="toggleHelp"
          class="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
        >
          <span>{{ showHelp ? 'Hide Help' : 'Show Help' }}</span>
          <i class="pi" :class="showHelp ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
        </button>
      </div>

       <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-y-95 opacity-0"
        enter-to-class="transform scale-y-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-y-100 opacity-100"
        leave-to-class="transform scale-y-95 opacity-0"
      >

      </transition>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentSelfService } from '@/services/student/useStudentSelfService'

const { isLoading, searchStudentInvoice, service, verifyInvoice } = useStudentSelfService()
const invoiceNumber = ref('')
const showResults = ref(false)
const isVerifying = ref(false)

// Payment verification status
const paymentFound = computed(() => service.value?.found || false)
const paymentCleared = computed(() => service.value?.cleared || false)
const paymentInvoice = computed(() => service.value?.invoice || invoiceNumber.value)

const verifyPayment = async () => {
  if (!invoiceNumber.value) return

  try {
    // Reset results before new search
    showResults.value = false

    // Call API with the user's invoice number
    const data = await searchStudentInvoice(invoiceNumber.value)

    // Show results after verification (success or error)
    showResults.value = true
  } catch (_) {
    showResults.value = true
  }
}

const resetForm = () => {
  invoiceNumber.value = ''
  showResults.value = false
}

const verifyInvoicePayment = async () => {
  if (!paymentInvoice.value) return
  
  isVerifying.value = true
  try {
    await verifyInvoice(paymentInvoice.value)
    // Re-search to get updated status
    await searchStudentInvoice(paymentInvoice.value)
  } catch (error) {
    console.error('Error verifying payment:', error)
  } finally {
    isVerifying.value = false
  }
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(13, 71, 161, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(13, 71, 161, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Hover effect for buttons */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
