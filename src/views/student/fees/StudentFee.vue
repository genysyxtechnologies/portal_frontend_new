<template>
  <div class="flex flex-col gap-6">
    <!-- Enhanced Header with modern gradient background -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-[#0D47A1] via-[#1976D2] to-[#90CAF9] rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-sm"
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
            <Sel-ect
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
              <Sel-ect
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

    <!-- Enhanced Financial Summary Cards -->
    <div
      v-if="selectedSession && fee && (selectedSession.paymentMode !== 'SEMESTER' || selectedSemester)"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
      v-motion="{
        initial: { opacity: 0 },
        enter: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
      }"
    >
      <!-- Total Fees Card -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          },
        }"
        class="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50"
      >
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider">Total Fees</h3>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i class="pi pi-wallet text-blue-600 text-lg"></i>
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-3xl font-bold text-gray-800 block">
              {{ formatCurrency(calculateTotalFees() || 0) }}
            </span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600 font-medium">{{ selectedSession?.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paid Amount Card -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.1 },
          },
        }"
        class="group relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100/50"
      >
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-emerald-600 uppercase tracking-wider">Paid Amount</h3>
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-3xl font-bold text-gray-800 block">
              {{ formatCurrency(fee?.feePayment?.amountPaid) || 0 }}
            </span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-emerald-600 font-bold">
                {{ calculatePercentage(fee?.feePayment?.amountPaid, fee?.feePayment?.invoiceAmount) || 0 }}% completed
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Outstanding Balance Card -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.2 },
          },
        }"
        class="group relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-amber-100/50"
      >
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
        <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-amber-600 uppercase tracking-wider">Outstanding</h3>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i class="pi pi-exclamation-circle text-amber-600 text-lg"></i>
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-3xl font-bold text-gray-800 block">
              {{ formatCurrency(calculateOutstandingBalance()) }}
            </span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-amber-600 font-medium flex items-center gap-1">
                <i class="pi pi-clock text-xs"></i>
                Due: {{ getFormattedDueDate() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Progress bar for payment completion -->
    <div
      v-if="selectedSession && fee && (selectedSession.paymentMode !== 'SEMESTER' || selectedSemester)"
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
              {{ calculatePercentage(fee?.feePayment?.amountPaid, fee?.feePayment?.invoiceAmount) || 0 }}%
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <ProgressBar
            :value="calculatePercentage(fee?.feePayment?.amountPaid, fee?.feePayment?.invoiceAmount)"
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

      <div v-else-if="selectedSession && (selectedSession.paymentMode !== 'SEMESTER' || selectedSemester)" class="flex flex-col gap-6 relative">
        <!-- Enhanced Invoice Generation Banner -->
        <div
          class="relative overflow-hidden bg-gradient-to-br from-[#0D47A1] via-[#1976D2] to-[#90CAF9] rounded-2xl p-8 shadow-2xl border border-white/10"
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500 } },
          }"
        >
          <!-- Enhanced decorative elements -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl animate-pulse" style="animation-delay: 1.5s"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <i class="pi pi-file-pdf text-white text-2xl"></i>
              </div>
              <div>
                <h2 class="text-white text-2xl font-bold mb-1">Generate Fee Invoice</h2>
                <p class="text-blue-100 text-sm max-w-md font-medium">
                  Download your official fee invoice for submission or payment processing
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
              <But-ton
                @click="downloadInvoice"
                label="Download Invoice"
                icon="pi pi-download"
                class="relative bg-white text-blue-700 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                :pt="{
                  root: { class: 'font-bold px-6 py-3 rounded-2xl' },
                  label: { class: 'font-bold text-lg' },
                  icon: { class: 'text-lg' }
                }"
              />
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

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      {{ formatCurrency(fee?.feePayment?.amountPaid || 0) }}
                    </div>
                    <div class="text-xs text-emerald-600 font-medium">
                      {{ calculatePercentage(fee?.feePayment?.amountPaid, fee?.feePayment?.invoiceAmount) || 0 }}% completed
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
                      {{ formatCurrency(calculateOutstandingBalance() || 0) }}
                    </div>
                    <div class="text-xs text-amber-600 font-medium flex items-center gap-1">
                      <i class="pi pi-clock text-xs"></i>
                      Due: {{ getFormattedDueDate() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ultra-Modern Payment Instructions -->
<!--            <div class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50/40 p-8 rounded-3xl border border-white/40 mb-8 shadow-xl backdrop-blur-sm mt-8">-->
<!--              &lt;!&ndash; Animated gradient border &ndash;&gt;-->
<!--              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl p-[2px]">-->
<!--                <div class="bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50/40 rounded-3xl h-full w-full"></div>-->
<!--              </div>-->

<!--              &lt;!&ndash; Floating geometric elements &ndash;&gt;-->
<!--              <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl rotate-12 animate-pulse"></div>-->
<!--              <div class="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-lg animate-pulse" style="animation-delay: 1s"></div>-->
<!--              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-2xl"></div>-->

<!--              <div class="relative z-10">-->
<!--                &lt;!&ndash; Enhanced header with icon animation &ndash;&gt;-->
<!--                <div class="flex items-center gap-4 mb-8">-->
<!--                  <div class="relative">-->
<!--                    <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">-->
<!--                      <i class="pi pi-shield text-white text-xl"></i>-->
<!--                    </div>-->
<!--                    <div class="absolute -inset-1 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl blur-md animate-pulse"></div>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <h4 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">-->
<!--                      Payment Guidelines-->
<!--                    </h4>-->
<!--                    <p class="text-sm text-gray-500 font-medium">Secure & streamlined payment process</p>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Modern instruction cards &ndash;&gt;-->
<!--                <div class="grid gap-4">-->
<!--                  <div class="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">-->
<!--                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>-->
<!--                    <div class="relative flex items-start gap-4">-->
<!--                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">-->
<!--                        <i class="pi pi-download text-white text-sm"></i>-->
<!--                      </div>-->
<!--                      <div class="flex-1">-->
<!--                        <h5 class="font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">Download Your Invoice</h5>-->
<!--                        <p class="text-sm text-gray-600 leading-relaxed">Generate and download your official fee invoice before proceeding with payment. This document serves as your payment reference.</p>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">-->
<!--                    <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>-->
<!--                    <div class="relative flex items-start gap-4">-->
<!--                      <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">-->
<!--                        <i class="pi pi-credit-card text-white text-sm"></i>-->
<!--                      </div>-->
<!--                      <div class="flex-1">-->
<!--                        <h5 class="font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">Multiple Payment Options</h5>-->
<!--                        <p class="text-sm text-gray-600 leading-relaxed">Pay conveniently through our secure online portal, mobile banking, or visit any designated bank branch with your invoice.</p>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <div class="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">-->
<!--                    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>-->
<!--                    <div class="relative flex items-start gap-4">-->
<!--                      <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">-->
<!--                        <i class="pi pi-shield text-white text-sm"></i>-->
<!--                      </div>-->
<!--                      <div class="flex-1">-->
<!--                        <h5 class="font-bold text-gray-800 mb-1 group-hover:text-amber-700 transition-colors">Secure Receipt Storage</h5>-->
<!--                        <p class="text-sm text-gray-600 leading-relaxed">Always keep your payment receipt and transaction confirmations safe. These serve as proof of payment and may be required for verification.</p>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Quick action section &ndash;&gt;-->
<!--                <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">-->
<!--                  <div class="flex items-center justify-between">-->
<!--                    <div class="flex items-center gap-3">-->
<!--                      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">-->
<!--                        <i class="pi pi-info-circle text-white text-sm"></i>-->
<!--                      </div>-->
<!--                      <span class="text-sm font-semibold text-blue-700">Need help with payment?</span>-->
<!--                    </div>-->
<!--                    <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">-->
<!--                      Contact Support-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
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

            <button
              @click="downloadInvoice"
              class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#1976D2] hover:to-[#0D47A1] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
            >
              <i class="pi pi-download group-hover:animate-bounce"></i>
              <span>Download Invoice</span>
            </button>
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
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentFee } from '@/services/student/useStudentFee'
import { ref, onMounted, watch, computed } from 'vue'
import ProgressBar from 'primevue/progressbar'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import apiClient from '@/services/api/apiClient'
import constant from '@/stores/constant'

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const { getStudentFee, fee, useFormattedDate, downloadInvoice, loading } = useStudentFee()

const selectedSession = ref()
const selectedSemester = ref()
const semesters = ref([])
const loadingSemesters = ref(false)
const { formattedDate } = useFormattedDate()

// Computed property to check if we should show semester-based fee data
const shouldShowSemesterData = computed(() => {
  return selectedSession.value?.paymentMode === 'SEMESTER' && selectedSemester.value
})

// Function to fetch semesters for payment
const fetchSemesters = async (userId: string, sessionId: number) => {
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
})

watch(selectedSession, async (newSession) => {
  if (newSession && user.value) {
    // Reset semester selection when session changes
    selectedSemester.value = null

    // If payment mode is SESSION, fetch fees directly
    if (newSession.paymentMode === 'SESSION') {
      await getStudentFee(String(user.value.username), newSession.id)
    }
    // If payment mode is SEMESTER, fetch available semesters
    else if (newSession.paymentMode === 'SEMESTER') {
      await fetchSemesters(String(user.value.username), newSession.id)
    }
  }
})

// Watch for semester selection changes
watch(selectedSemester, async (newSemester) => {
  if (newSemester && selectedSession.value && user.value) {
    // For semester-based payments, include semester in the fee request
    const sessionId = selectedSession.value.id
    const semesterId = newSemester.id
    await getStudentFee(String(user.value.username), sessionId, semesterId)
  }
})

// Helper functions for financial calculations
function calculateTotalFees() {
  if (!fee.value?.feeItems) return 0
  return fee.value.feeItems.reduce((sum, item) => sum + (item.amount || 0), 0)
}

function calculatePaidAmount() {
  if (!fee.value?.feeItems || !fee.value?.feePayment?.cleared) return 0
  // If the fee payment is cleared, consider all items as paid
  return fee.value.feeItems.reduce((sum, item) => sum + (item.amount || 0), 0)
}

function calculateOutstandingBalance() {
  return calculateTotalFees() - calculatePaidAmount()
}

function calculatePaymentPercentage() {
  const total = calculateTotalFees()
  if (total === 0) return 0
  return Math.floor((calculatePaidAmount() / total) * 100)
}

function getFormattedDueDate() {
  // This would ideally come from the API, but for now we'll use a placeholder
  return new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calculatePercentage(amount: number, total: number) {
  if (total === 0 || !total) return 0
  return Math.floor((amount / total) * 100)
}

function formatCurrency(amount: number) {
  if (!amount || amount === 0) return '₦' + 0
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}
</style>
