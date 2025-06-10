<template>
  <div class="flex flex-col gap-6">
    <!-- Message Display -->
    <div
      v-if="messageShow"
      class="p-4 rounded-xl border-l-4 transition-all duration-300"
      :class="{
        'bg-emerald-50 border-emerald-500 text-emerald-700': messageType === 'success',
        'bg-red-50 border-red-500 text-red-700': messageType === 'error',
        'bg-blue-50 border-blue-500 text-blue-700': messageType === 'info',
        'bg-amber-50 border-amber-500 text-amber-700': messageType === 'warning'
      }"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi" :class="{
            'pi-check-circle': messageType === 'success',
            'pi-times-circle': messageType === 'error',
            'pi-info-circle': messageType === 'info',
            'pi-exclamation-triangle': messageType === 'warning'
          }"></i>
          <span class="font-medium">{{ message }}</span>
        </div>
        <button @click="messageShow = false" class="text-current opacity-70 hover:opacity-100">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
    <!-- Enhanced Header with modern gradient background -->
    <div
      class="relative overflow-hidden rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-sm"
      :style="{
        background: `linear-gradient(to right, var(--primary-dark-color), var(--primary-light-color))`,
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
      <!-- Floating orbs for visual appeal -->
      <div class="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <i class="pi pi-credit-card text-white text-xl"></i>
            </div>
            <div class="w-1 h-12 bg-white/30 rounded-full"></div>
            <div>
              <h1 class="text-white text-3xl md:text-4xl font-bold tracking-tight">
                Fee Management
              </h1>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <p class="text-blue-100 text-sm md:text-base font-medium">
                  Track payments & manage financial obligations
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
            <Select
              :size="'large'"
              v-model="selectedSession"
              :options="sessions"
              optionLabel="name"
              placeholder="Select Academic Session"
              class="relative w-full md:w-[320px] shadow-xl"
              :pt="{
                root: {
                  class:
                    'transition-all duration-300 bg-white/95 backdrop-blur-md hover:bg-white hover:shadow-2xl rounded-2xl border border-white/30',
                },
                input: { class: 'font-semibold text-gray-700 px-4 py-3' },
                trigger: { class: 'text-blue-600 px-3' },
                panel: { class: 'rounded-2xl shadow-2xl border border-gray-100' },
                item: { class: 'hover:bg-blue-50 transition-colors duration-200' }
              }"
            />
          </div>

          <!-- Semester Selection (only show if session paymentMode is SEMESTER) -->
          <div v-if="selectedSession?.paymentMode === 'SEMESTER'" class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
              <Select
                :size="'large'"
                v-model="selectedSemester"
                :options="semesters"
                optionLabel="title"
                placeholder="Select Semester"
                class="relative w-full md:w-[300px] shadow-xl"
                :loading="loadingSemesters"
                :pt="{
                  root: {
                    class:
                      'transition-all duration-300 bg-white/95 backdrop-blur-md hover:bg-white hover:shadow-2xl rounded-2xl border border-white/30',
                  },
                  input: { class: 'font-semibold text-gray-700 px-4 py-3' },
                  trigger: { class: 'text-purple-600 px-3' },
                  panel: { class: 'rounded-2xl shadow-2xl border border-gray-100' },
                  item: { class: 'hover:bg-purple-50 transition-colors duration-200' }
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Animated Content Area -->
    <transition name="fade-zoom" mode="out-in">
      <!-- No Session Selected State -->
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

      <!-- Semester Selection State -->
      <div
        v-else-if="selectedSession?.paymentMode === 'SEMESTER' && !selectedSemester"
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
        }"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <div class="relative">
            <div class="bg-[#F3E8FF] p-6 rounded-full relative overflow-hidden">
              <svg
                class="w-16 h-16 text-[#8B5CF6] relative z-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 6h6m-2-6v6"
                />
              </svg>
              <div class="absolute inset-0 bg-[#DDD6FE]/30 -z-0 animate-pulse"></div>
            </div>
          </div>

          <h1 class="text-2xl font-semibold text-gray-700">
            Select Semester
          </h1>

          <p class="text-lg text-gray-500 max-w-md">
            This session uses semester-based payments. Please select a semester to view your fee details.
          </p>

          <div class="mt-6 text-[#8B5CF6] flex items-center gap-2 bg-[#F3E8FF] px-4 py-2 rounded-full shadow-sm">
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

      <!-- Main Content Area -->
      <div v-else-if="selectedSession" class="flex flex-col gap-6 relative">
        <!-- Enhanced Progress bar for payment completion -->
        <div
          v-if="fee && fee.feeItems"
          class="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl p-6 shadow-xl border border-gray-100/50"
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 400, delay: 0.3 } },
          }"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div class="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div class="relative z-10 space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                <h3 class="text-lg font-bold text-gray-800">Payment Progress</h3>
              </div>
              <div class="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                <span class="text-lg font-bold text-blue-600">
                  {{ calculatePaymentPercentage() }}%
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <ProgressBar
                :value="calculatePaymentPercentage()"
                :showValue="false"
                :pt="{
                  root: { class: 'h-4 rounded-full overflow-hidden bg-gray-200 shadow-inner' },
                  value: { class: 'bg-gradient-to-r from-[#0D47A1] via-[#1976D2] to-[#90CAF9] shadow-lg transition-all duration-1000' },
                }"
              />

              <div class="flex justify-between text-xs font-medium">
                <span class="text-gray-500">0%</span>
                <span class="text-gray-600">25%</span>
                <span class="text-gray-600">50%</span>
                <span class="text-gray-600">75%</span>
                <span class="text-blue-600">100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Actions Section -->
        <div v-if="!fee?.feePayment" class="mb-6">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <h4 class="text-xl font-bold text-gray-800">Payment Options</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Full Payment Option -->
                <div
                  class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                  :class="!payPart ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
                  @click="() => { payPart = false; amountToPay = 0 }"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full border-2" :class="!payPart ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
                      <div v-if="!payPart" class="w-full h-full rounded-full bg-white scale-50"></div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800">Full Payment</div>
                      <div class="text-sm text-gray-500">Pay the complete fee amount</div>
                    </div>
                  </div>
                  <div class="mt-2 text-lg font-bold text-blue-600">
                    {{ formatCurrency(calculateTotalFees()) }}
                  </div>
                </div>

                <!-- Part Payment Option -->
                <div
                  class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                  :class="payPart ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                  @click="() => { payPart = !!selectedSession?.programmeType?.partPayment }"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full border-2" :class="payPart ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'">
                      <div v-if="payPart" class="w-full h-full rounded-full bg-white scale-50"></div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800">Part Payment</div>
                      <div class="text-sm text-gray-500">Pay a portion of the fee amount</div>
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-emerald-600 font-medium">
                    Specify amount below
                  </div>
                </div>
              </div>

              <!-- Part Payment Amount Input -->
              <div v-if="payPart" class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Pay (₦)
                </label>
                <div class="relative">
                  <input
                    v-model.number="amountToPay"
                    type="number"
                    :max="calculateTotalFees()"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  />
                  <div class="absolute right-3 top-3 text-gray-400 text-sm">
                    Max: {{ formatCurrency(calculateTotalFees()) }}
                  </div>
                </div>
                <div v-if="!canClickPay && Number(amountToPay) > 0" class="mt-2 text-sm text-red-600">
                  Please enter a valid amount between ₦1 and {{ formatCurrency(calculateTotalFees()) }}
                </div>
              </div>

              <!-- Generate Invoice Button -->
              <button
                @click="() => initializeTransaction(!payPart, false)"
                :disabled="payPart || !canClickPay"
                style="margin-top: 10px;"
                class="w-full mt-6 md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
              >
                <i class="pi pi-file-pdf mr-2"></i>
                {{ loading ? 'Generating...' : 'Generate Invoice' }} {{ payPart ? `(${formatCurrency(Number(amountToPay))})` : '(Full Payment)' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced loading overlay -->
        <div v-if="loading" class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <SpinningAnimation :loading="loading" />
        </div>

        <!-- Payment Details Card -->
        <div
          class="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden transition-all duration-500 relative group hover:shadow-2xl"
        >
          <!-- Modern gradient accent strip -->
          <div
            class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0D47A1] via-[#1976D2] to-[#90CAF9] opacity-80"
          ></div>

          <!-- Subtle decorative elements -->
          <div class="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div class="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>

          <div class="p-8 relative z-10">

            <!-- Enhanced Payment Summary -->
            <div class="mb-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-1 h-8 bg-gradient-to-b from-[#0D47A1] to-[#90CAF9] rounded-full"></div>
                <h4 class="text-xl font-bold text-gray-800">
                  Payment Summary
                </h4>
              </div>

              <div style="margin-top: 10px;" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  class="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-6 rounded-2xl border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl"></div>
                  <div class="relative z-10">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Fee</div>
                      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i class="pi pi-wallet text-blue-600"></i>
                      </div>
                    </div>
                    <div class="text-2xl font-bold text-gray-800 mb-1">
                      {{ formatCurrency(calculateTotalFees() || 0) }}
                    </div>
                    <div class="text-xs text-gray-500">{{ selectedSession?.name }}</div>
                  </div>
                </div>

                <div
                  class="group relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-3xl"></div>
                  <div class="relative z-10">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm font-medium text-emerald-600 uppercase tracking-wide">Amount Paid</div>
                      <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <i class="pi pi-check-circle text-emerald-600"></i>
                      </div>
                    </div>
                    <div class="text-2xl font-bold text-gray-800 mb-1">
                      {{ formatCurrency(calculatePaidAmount()) }}
                    </div>
                    <div class="text-xs text-emerald-600 font-medium">
                      {{ calculatePaymentPercentage() }}% completed
                    </div>
                  </div>
                </div>

                <div
                  class="group relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-6 rounded-2xl border border-amber-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-3xl"></div>
                  <div class="relative z-10">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm font-medium text-amber-600 uppercase tracking-wide">Outstanding</div>
                      <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <i class="pi pi-exclamation-circle text-amber-600"></i>
                      </div>
                    </div>
                    <div class="text-2xl font-bold text-gray-800 mb-1">
                      {{ formatCurrency(calculateOutstandingBalance()) }}
                    </div>
                    <div class="text-xs text-amber-600 font-medium flex items-center gap-1">
                      <i class="pi pi-clock text-xs"></i>
                      Due: {{ getFormattedDueDate() }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment History Section (if parts exist) -->
              <div v-if="parts.length > 0" class="mt-8" style="margin-top: 10px;">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                  <h4 class="text-xl font-bold text-gray-800">
                    Payment History
                  </h4>
                  <div class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                    {{ parts.length }} payment{{ parts.length === 1 ? '' : 's' }}
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(payment, index) in parts"
                    :key="payment.id || index"
                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <i class="pi pi-receipt text-purple-600"></i>
                      </div>
                      <div>
                        <div class="font-semibold text-gray-800">Payment {{ index + 1 }}</div>
                        <div class="text-sm text-gray-500">{{ formatPaymentDate(payment.paymentDate) }}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold text-gray-800">{{ formatCurrency(payment.amountPaid || 0) }}</div>
                        <div class="text-sm" :class="payment.success ? 'text-emerald-600' : 'text-amber-600'">
                          {{ payment.success ? 'Paid' : 'Pending' }}
                        </div>
                      </div>

                      <button
                        v-if="payment.invoice"
                        @click="() => downloadInvoice(payment.invoice)"
                        :disabled="loading"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download Invoice"
                      >
                        <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-download']"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modern footer -->
          <div
            class="px-8 py-4 bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 flex justify-between items-center text-sm border-t border-gray-100/50"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span class="text-gray-600 font-medium">
                Fee Data {{ formattedDate ? `• ${formattedDate}` : '' }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <!-- Invoice Download Actions -->
              <div class="flex items-center gap-3">
                <!-- Single Invoice Download -->
                <button
                  v-if="fee?.feePayment?.transactionId && (!fee?.feePayment?.partPayments || fee.feePayment.partPayments.length < 2)"
                  @click="() => downloadInvoice(fee?.feePayment?.transactionId)"
                  :disabled="loading"
                  class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#1976D2] hover:to-[#0D47A1] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                >
                  <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-download group-hover:animate-bounce']"></i>
                  <span>{{ loading ? 'Downloading...' : 'Download Invoice' }}</span>
                </button>

                <!-- Multiple Invoice Download Menu -->
                <div v-else-if="fee?.feePayment?.partPayments && fee.feePayment.partPayments.length > 1" class="relative">
                  <Button
                    :disabled="loading"
                    @click="(event) => toggleInvoiceMenu(event)"
                    class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#1976D2] hover:to-[#0D47A1] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                    :pt="{
                      root: { class: 'p-0 border-none shadow-none bg-transparent' },
                      label: { class: 'p-0' }
                    }"
                  >
                    <template #default>
                      <div class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#1976D2] hover:to-[#0D47A1] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium">
                        <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-download group-hover:animate-bounce']"></i>
                        <span>{{ loading ? 'Downloading...' : 'Download Invoice' }}</span>
                        <i class="pi pi-chevron-down ml-1"></i>
                      </div>
                    </template>
                  </Button>

                  <Menu
                    ref="invoiceMenu"
                    :model="invoiceMenuItems"
                    :popup="true"
                    :pt="{
                      root: { class: 'min-w-[14rem] rounded-xl shadow-lg border border-gray-100' },
                      menu: { class: 'py-1' },
                      menuitem: { class: 'hover:bg-blue-50 transition-colors duration-200' },
                      action: { class: 'px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900' }
                    }"
                  />
                </div>
              </div>

              <!-- Invoice Generation Actions -->
              <div class="flex items-center gap-3 mt-2">
                <!-- Generate Invoice Button (when no payment exists) -->
                <div v-if="!fee?.feePayment && paymentActionEnable" class="relative">
                  <!-- Single Invoice Generation for non-part payment programmes -->
                  <button
                    v-if="!user?.programme?.programmeType?.partPayment"
                    @click="() => initializeTransaction(true, false)"
                    :disabled="calculatePaidAmount() >= calculateTotalFees() || loading"
                    class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                  >
                    <i class="pi pi-file-pdf group-hover:animate-bounce"></i>
                    <span>{{ loading ? 'Generating...' : 'Generate Invoice' }}</span>
                  </button>

                  <!-- Multiple Invoice Generation Menu for part payment programmes -->
                  <div v-else>
                    <Button
                      :disabled="calculatePaidAmount() >= calculateTotalFees() || loading"
                      @click="(event) => toggleGenerateMenu(event)"
                      class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                      :pt="{
                        root: { class: 'p-0 border-none shadow-none bg-transparent' },
                        label: { class: 'p-0' }
                      }"
                    >
                      <template #default>
                        <div class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium">
                          <i class="pi pi-file-pdf group-hover:animate-bounce"></i>
                          <span>{{ loading ? 'Generating...' : 'Generate Invoice' }}</span>
                          <i class="pi pi-chevron-down ml-1"></i>
                        </div>
                      </template>
                    </Button>

                    <Menu
                      ref="generateMenu"
                      :model="generateMenuItems"
                      :popup="true"
                      :pt="{
                        root: { class: 'min-w-[14rem] rounded-xl shadow-lg border border-gray-100' },
                        menu: { class: 'py-1' },
                        menuitem: { class: 'hover:bg-blue-50 transition-colors duration-200' },
                        action: { class: 'px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900' }
                      }"
                    />
                  </div>
                </div>

                <!-- Balance Invoice Button -->
                <button
                  v-if="fee?.feePayment && fee.feePayment.partPayments && fee.feePayment.partPayments.length > 0 && isBalancePayment && calculateOutstandingBalance() > 0"
                  @click="() => initializeTransaction(true, false)"
                  :disabled="calculatePaidAmount() >= calculateTotalFees() || loading || fee.feePayment.cleared"
                  class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                >
                  <i class="pi pi-file-pdf group-hover:animate-bounce"></i>
                  <span>{{ loading ? 'Generating...' : 'Balance Invoice' }}</span>
                </button>
              </div>

              <!-- Payment Actions -->
              <div class="flex items-center gap-3">
                <!-- Single Payment Button -->
                <button
                  v-if="fee?.feePayment && !fee.feePayment.cleared && (!fee.feePayment.partPayments || fee.feePayment.partPayments.length < 1)"
                  @click="() => makePayment(fee.feePayment.paymentLink)"
                  :disabled="calculatePaidAmount() >= calculateTotalFees() || loading || fee.feePayment.cleared || (fee.feePayment.partPayments && fee.feePayment.partPayments.length > 0)"
                  class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                >
                  <i class="pi pi-credit-card group-hover:animate-bounce"></i>
                  <span>{{ loading ? 'Processing...' : 'Pay Now' }}</span>
                </button>

                <!-- Multiple Payment Menu -->
                <div v-else-if="fee?.feePayment && !fee.feePayment.cleared && fee.feePayment.partPayments && fee.feePayment.partPayments.length > 1">
                  <Button
                    :disabled="calculatePaidAmount() >= calculateTotalFees() || loading"
                    @click="(event) => togglePaymentMenu(event)"
                    class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"
                    :pt="{
                      root: { class: 'p-0 border-none shadow-none bg-transparent' },
                      label: { class: 'p-0' }
                    }"
                  >
                    <template #default>
                      <div class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium">
                        <i class="pi pi-credit-card group-hover:animate-bounce"></i>
                        <span>Pay Now</span>
                        <i class="pi pi-chevron-down ml-1"></i>
                      </div>
                    </template>
                  </Button>

                  <Menu
                    ref="paymentMenu"
                    :model="paymentMenuItems"
                    :popup="true"
                    :pt="{
                      root: { class: 'min-w-[14rem] rounded-xl shadow-lg border border-gray-100' },
                      menu: { class: 'py-1' },
                      menuitem: { class: 'hover:bg-teal-50 transition-colors duration-200' },
                      action: { class: 'px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-900' }
                    }"
                  />
                </div>
              </div>

              <!-- Refresh Transaction Button -->
<!--              <button-->
<!--                v-if="fee?.feePayment && !fee?.feePayment?.cleared"-->
<!--                @click="() => refreshTransaction()"-->
<!--                :disabled="loading"-->
<!--                class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed font-medium"-->
<!--              >-->
<!--                <i class="pi pi-refresh group-hover:animate-spin"></i>-->
<!--                <span>{{ loading ? 'Refreshing...' : 'Refresh Status' }}</span>-->
<!--              </button>-->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentFee } from '@/services/student/useStudentFee'
import { ref, onMounted, watch, computed, type Ref } from 'vue'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Menu from 'primevue/menu'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import apiClient from '@/services/api/apiClient'
import constant from '@/stores/constant'
import type {
  PaymentPart,
  PaymentInfo,
  PaymentConfig,
  MessageType,
  SessionWithPaymentMode,
  Semester
} from '@/types/student/fee.information'
import { PaymentGateway, GateWays, type PaymentComponent } from '@/utils/paymentGateway'

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const { getStudentFee, fee, useFormattedDate, downloadInvoice, loading } = useStudentFee()

const selectedSession: Ref<SessionWithPaymentMode | null> = ref(null)
const selectedSemester: Ref<Semester | null> = ref(null)
const semesters: Ref<Semester[]> = ref([])
const loadingSemesters = ref<boolean>(false)
const { formattedDate } = useFormattedDate()

// Additional data properties to match extracted logic
const parts: Ref<PaymentPart[]> = ref([])                  // Payment parts/installments
const payPart = ref<boolean>(false)             // Whether paying in parts
const amountToPay = ref<number>(0)             // Amount to pay for partial payment
const paymentInfo: Ref<PaymentInfo | null> = ref(null)          // Payment information including level
const paymentGateway: Ref<PaymentGateway | null> = ref(null)       // Payment gateway instance
const paymentConfig: Ref<PaymentConfig | null> = ref(null)        // Payment configuration
const messageShow = ref<boolean>(false)         // Show message state
const message = ref<string>('')               // Message content
const messageType = ref<MessageType>('info')           // Message type (success, error, etc.)

// Menu refs for PrimeVue
const invoiceMenu = ref()
const generateMenu = ref()
const paymentMenu = ref()

// Auto-hide messages after 5 seconds
watch(messageShow, (show: boolean) => {
  if (show) {
    setTimeout(() => {
      messageShow.value = false
    }, 5000)
  }
})

// Computed property to check if we should show semester-based fee data
const shouldShowSemesterData = computed((): boolean => {
  return selectedSession.value?.paymentMode === 'SEMESTER' && selectedSemester.value !== null
})

// Function to fetch semesters for payment
const fetchSemesters = async (userId: string, sessionId: number): Promise<void> => {
  if (!userId || !sessionId) return

  loadingSemesters.value = true
  try {
    const response = await apiClient.get(
      `${constant.semester.getPaidAndPending}?student=${userId}&session=${sessionId}`
    )
    semesters.value = response.data || []
  } catch (error) {
    console.error('Error fetching semesters:', error)
    semesters.value = []
  } finally {
    loadingSemesters.value = false
  }
}

// Helper function to get initials from name
const getInitials = (name: string | undefined) => {
  if (!name) return 'S'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

onMounted(async () => {
  await getStudentInformation()
  await getSessions()

  // Initialize payment gateway
  try {
    const response = await apiClient.get('/payment-platforms/get-active')
    paymentConfig.value = response.data as PaymentConfig

    if (response.data.inline) {
      // Create component interface for payment gateway
      const componentInterface: PaymentComponent = {
        get loading() { return loading.value },
        set loading(value: boolean) { loading.value = value },
        get message() { return message.value },
        set message(value: string) { message.value = value },
        get messageType() { return messageType.value },
        set messageType(value: string) { messageType.value = value as MessageType },
        get messageShow() { return messageShow.value },
        set messageShow(value: boolean) { messageShow.value = value }
      }

      // Initialize payment gateway with config
      paymentGateway.value = new PaymentGateway(
        response.data.name,
        componentInterface,
        '/api/payments/process-inline'
      )

      await paymentGateway.value.initializeGateway(response.data)
    }
  } catch (error) {
    console.error('Error initializing payment gateway:', error)
  }
})

watch(selectedSession, async (newSession: SessionWithPaymentMode | null) => {
  if (newSession && user.value) {
    // Reset semester selection and clear previous data
    selectedSemester.value = null
    parts.value = []
    paymentInfo.value = null

    // If payment mode is SESSION, fetch fees directly
    if (newSession.paymentMode === 'SESSION') {
      await getPayment()
    }
    // If payment mode is SEMESTER, fetch available semesters
    else if (newSession.paymentMode === 'SEMESTER') {
      await fetchSemesters(String(user.value.username), newSession.id)
    }
  }
})

// Watch for semester selection changes
watch(selectedSemester, async (newSemester: Semester | null) => {
  if (newSemester && selectedSession.value && user.value) {
    await getPayment()
  }
})

// Helper functions for financial calculations (updated to match extracted logic)
function calculateTotalFees(): number {
  if (!fee.value?.feeItems) return 0
  return fee.value.feeItems.reduce((sum, item) => sum + (item.amount || 0), 0)
}

// Calculate amount already paid from parts (matches extracted logic)
function calculatePaidAmount(): number {
  // If the fee payment is cleared, consider all items as paid
  if (fee.value?.feePayment?.cleared) return calculateTotalFees()

  // If no payment parts exist, no amount has been paid
  if (!parts.value || parts.value.length < 1) return 0

  // Sum all amounts paid from part payments
  return parts.value
    .map(e => e.amountPaid || 0)
    .reduce((prev, curr) => prev + curr, 0)
}

function calculateOutstandingBalance(): number {
  return calculateTotalFees() - calculatePaidAmount()
}

// Check if balance payment is available (from extracted logic)
const isBalancePayment = computed((): boolean => {
  return (fee.value?.feePayment?.partPayments?.length > 0 && !fee.value?.feePayment?.cleared) ||
    (calculatePaidAmount() < calculateTotalFees() && fee.value?.feePayment?.partPayments?.length > 0)
})

// Enable payment actions based on session/semester selection
const paymentActionEnable = computed((): boolean => {
  const isSemesterBased = selectedSession.value?.paymentMode === 'SEMESTER'
  return (isSemesterBased && !!selectedSemester.value) ||
    (!isSemesterBased && !!selectedSession.value)
})

// Menu items for invoice downloads
const invoiceMenuItems = computed(() => {
  if (!fee.value?.feePayment?.partPayments) return []

  return fee.value.feePayment.partPayments.map((item, index) => ({
    label: `Invoice ${index + 1}`,
    icon: 'pi pi-file-pdf',
    command: () => downloadInvoice(item.invoice)
  }))
})

// Menu items for invoice generation
const generateMenuItems = computed(() => {
  const items = [
    {
      label: 'Full Payment',
      icon: 'pi pi-wallet',
      command: () => initializeTransaction(true, false)
    }
  ]

  if (user.value?.programme?.programmeType?.partPayment) {
    items.push({
      label: 'Part Payment',
      icon: 'pi pi-credit-card',
      command: () => initializeTransaction(false, false)
    })
  }

  return items
})

// Menu items for payments
const paymentMenuItems = computed(() => {
  if (!fee.value?.feePayment?.partPayments) return []

  return fee.value.feePayment.partPayments.map((item, index) => ({
    label: `Pay for invoice ${item.invoice}${item.success ? ' - Paid' : ''}`,
    icon: 'pi pi-credit-card',
    disabled: !paymentActionEnable.value || loading.value || item.success,
    command: () => !item.success && makePayment(item.paymentLink, item)
  }))
})

// Validate payment amount for part payments
const canClickPay = computed((): boolean => {
  const amountPattern = /^[123456789]\d*(\.\d{0,8})?$/
  const amountValue = Number(amountToPay.value)
  return amountPattern.test(amountValue.toString()) &&
    amountValue > 0 &&
    amountValue <= (calculateTotalFees() - calculatePaidAmount())
})

function calculatePaymentPercentage(): number {
  const total = calculateTotalFees()
  if (total === 0) return 0
  return Math.floor((calculatePaidAmount() / total) * 100)
}

function getFormattedDueDate(): string {
  // This would ideally come from the API, but for now we'll use a placeholder
  return new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calculatePercentage(amount: number, total: number): number {
  if (total === 0 || !total) return 0
  return Math.floor((amount / total) * 100)
}

// Main payment fetching function (matches extracted logic)
async function getPayment(): Promise<void> {
  if (!user.value || !selectedSession.value) return

  // Clear previous data
  parts.value = []
  paymentInfo.value = null

  try {
    await getStudentFee(
      String(user.value.username),
      selectedSession.value.id,
      selectedSemester.value?.id ?? null
    )

    // The fee.value is automatically populated by the composable
    // Set payment info from the fee data
    if (fee.value) {
      paymentInfo.value = fee.value as PaymentInfo

      // Extract part payments if they exist
      if (fee.value.feePayment?.partPayments) {
        parts.value = fee.value.feePayment.partPayments
      }
    }
  } catch (error) {
    console.error('Error fetching payment:', error)
    message.value = 'Failed to fetch payment information'
    messageType.value = 'error'
    messageShow.value = true
  }
}

// Initialize payment transaction (from extracted logic)
async function initializeTransaction(full: boolean, payNow: boolean = false): Promise<void> {
  if (!user.value || !paymentActionEnable.value) return

  // Validate part payment amount
  if (!full && (amountToPay.value <= 0 || !canClickPay.value)) {
    message.value = 'Please enter a valid payment amount'
    messageType.value = 'error'
    messageShow.value = true
    return
  }

  loading.value = true

  try {
    // API call to initialize payment using the actual endpoint
    const response = await apiClient.post(constant.schoolFees.initializePayment, {
      sessionId: selectedSession.value.id,
      studentReg: user.value.username,
      full: full,
      semesterId: selectedSemester.value?.id ?? null,
      amount: full ? null : Number(amountToPay.value)
    })

    // Update fee payment data with response
    if (response.data) {
      // Refresh payment data after initialization
      await getPayment()

      message.value = full ? 'Full payment invoice generated successfully' : `Part payment invoice generated for ${formatCurrency(Number(amountToPay.value))}`
      messageType.value = 'success'
      messageShow.value = true

      if (payNow) {
        await makePayment()
      }
    }
  } catch (error) {
    console.error('Error initializing transaction:', error)
    message.value = 'Failed to initialize payment'
    messageType.value = 'error'
    messageShow.value = true
  } finally {
    loading.value = false
  }
}

// Make payment function (fully integrated with payment gateway)
async function makePayment(link?: string, payment?: PaymentPart): Promise<void> {
  if (!fee.value?.feePayment && !payment) {
    message.value = 'No payment information available'
    messageType.value = 'error'
    messageShow.value = true
    return
  }

  if (!user.value?.email) {
    message.value = 'User email not available for payment'
    messageType.value = 'error'
    messageShow.value = true
    return
  }

  const paymentAmount = payPart.value ? Number(amountToPay.value) : (calculateTotalFees() - calculatePaidAmount())

  const paymentData = {
    email: user.value.email,
    amount: paymentAmount,
    currency: 'NGN',
    invoice: payment?.invoice ?? fee.value?.feePayment?.transactionId ?? '',
    paymentId: payment?.feePayment?.id ?? fee.value?.feePayment?.id ?? ''
  }

  try {
    if (paymentConfig.value?.inline && paymentGateway.value) {
      // Inline payment using payment gateway
      paymentGateway.value.makePayment(
        paymentData,
        () => {
          // Success callback - reload page
          message.value = 'Payment completed successfully!'
          messageType.value = 'success'
          messageShow.value = true

          // Refresh payment data
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        },
        async (invoice: string) => {
          // Process inline payment
          try {
            loading.value = true
            await apiClient.put(`/payments/process-inline/${invoice}`)

            message.value = 'Payment processed successfully!'
            messageType.value = 'success'
            messageShow.value = true

            // Refresh payment data
            await getPayment()
          } catch (error) {
            console.error('Payment processing error:', error)
            message.value = 'Payment processing failed'
            messageType.value = 'error'
            messageShow.value = true
          } finally {
            loading.value = false
          }
        }
      )
    } else {
      // External payment - redirect to payment link
      if (link) {
        loading.value = true
        window.location.href = link
      } else {
        message.value = 'Payment gateway not configured for inline payments'
        messageType.value = 'error'
        messageShow.value = true
      }
    }
  } catch (error) {
    console.error('Payment error:', error)
    message.value = error instanceof Error ? error.message : 'Payment failed'
    messageType.value = 'error'
    messageShow.value = true
  }
}

// Format payment date for display
function formatPaymentDate(dateString: string): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Refresh transaction status (from extracted logic)
async function refreshTransaction(): Promise<void> {
  if (!fee.value?.feePayment?.id) {
    message.value = 'No payment transaction to refresh'
    messageType.value = 'error'
    messageShow.value = true
    return
  }

  loading.value = true

  try {
    const response = await apiClient.put(`${constant.schoolFees.refreshTransaction}${fee.value.feePayment.id}`)

    // Refresh payment data
    await getPayment()

    message.value = 'Transaction status refreshed successfully'
    messageType.value = 'success'
    messageShow.value = true
  } catch (error) {
    console.error('Error refreshing transaction:', error)
    message.value = 'Failed to refresh transaction status'
    messageType.value = 'error'
    messageShow.value = true
  } finally {
    loading.value = false
  }
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

// Menu toggle functions
function toggleInvoiceMenu(event: Event) {
  invoiceMenu.value?.toggle(event)
}

function toggleGenerateMenu(event: Event) {
  generateMenu.value?.toggle(event)
}

function togglePaymentMenu(event: Event) {
  paymentMenu.value?.toggle(event)
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
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}
</style>
