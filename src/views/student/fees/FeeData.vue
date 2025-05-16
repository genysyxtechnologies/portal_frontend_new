<template>
  <div
    class="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
    :class="{ 'opacity-0 scale-95': loading, 'opacity-100 scale-100': !loading }"
  >
    <!-- Sleek accent strip at top -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0D47A1] to-[#90CAF9]"></div>

    <!-- Loading overlay with minimal design -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
    >
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 border-2 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin mb-3"></div>
        <span class="text-gray-500 text-sm">Loading</span>
      </div>
    </div>

    <div class="p-6">
      <!-- Student Header - Minimal elegant design -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div class="flex items-center">
          <!-- Simple avatar with initials -->
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D47A1] to-[#90CAF9] flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm">
            {{ getInitials(name) }}
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">{{ name || 'Student' }}</h3>
            <div class="flex items-center gap-3 text-gray-500 text-sm">
              <div class="flex items-center gap-1">
                <i class="pi pi-id-card text-[#0D47A1]"></i>
                <span>{{ matric || 'No ID' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-chart-line text-[#0D47A1]"></i>
                <span>{{ level || 'Level' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#F0F9FF] py-2 px-4 rounded-lg shadow-sm border border-[#E9F5FF] text-[#0D47A1] text-sm flex items-center">
          <i class="pi pi-calendar mr-2"></i>
          <span class="font-medium">{{ session || 'Current Session' }}</span>
        </div>
      </div>

      <!-- Program Details - Clean and minimal tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-100 mb-4">
          <button
            @click="activeTab = 'details'"
            class="px-4 py-2 text-sm font-medium relative"
            :class="activeTab === 'details' ? 'text-[#0D47A1]' : 'text-gray-400 hover:text-gray-600'"
          >
            Program Details
            <div v-if="activeTab === 'details'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#0D47A1]"></div>
          </button>
          <button
            @click="activeTab = 'fees'"
            class="px-4 py-2 text-sm font-medium relative"
            :class="activeTab === 'fees' ? 'text-[#0D47A1]' : 'text-gray-400 hover:text-gray-600'"
          >
            Fee Details
            <div v-if="activeTab === 'fees'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#0D47A1]"></div>
          </button>
        </div>

        <!-- Program Tab Content with clean layout -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <div class="text-xs text-gray-400">Faculty</div>
              <div class="font-medium text-gray-800">{{ faculty || 'Not specified' }}</div>
            </div>

            <div class="space-y-1">
              <div class="text-xs text-gray-400">Department</div>
              <div class="font-medium text-gray-800">{{ department || 'Not specified' }}</div>
            </div>

            <div class="space-y-1">
              <div class="text-xs text-gray-400">Programme</div>
              <div class="font-medium text-gray-800">{{ programme || 'Not specified' }}</div>
            </div>

            <div class="space-y-1">
              <div class="text-xs text-gray-400">Email</div>
              <div class="font-medium text-gray-800">{{ email || 'Not specified' }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-400 mt-4">
            <i class="pi pi-calendar"></i>
            <span>Last updated: {{ date || 'Not available' }}</span>
          </div>
        </div>

        <!-- Fees Tab Content with elegant table -->
        <div v-if="activeTab === 'fees'" class="space-y-4">
          <!-- Fee summary statistics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div class="text-sm text-gray-400 mb-1">Total Items</div>
              <div class="text-xl font-bold text-gray-800">{{ feeItems?.length || 0 }}</div>
            </div>

            <div class="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div class="text-sm text-gray-400 mb-1">Paid Items</div>
              <div class="text-xl font-bold text-green-600">{{ getPaidItemsCount() }}</div>
            </div>

            <div class="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div class="text-sm text-gray-400 mb-1">Pending Items</div>
              <div class="text-xl font-bold text-amber-600">{{ getPendingItemsCount() }}</div>
            </div>

            <div class="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div class="text-sm text-gray-400 mb-1">Total Amount</div>
              <div class="text-xl font-bold text-[#0D47A1]">{{ getTotalAmount() }}</div>
            </div>
          </div>

          <!-- Clean, minimal fee table -->
          <div class="bg-white rounded-lg overflow-hidden border border-gray-100">
            <div class="overflow-x-auto">
              <table class="w-full min-w-full text-left">
                <thead>
                  <tr class="border-b border-gray-100 bg-gray-50">
                    <th class="py-3 px-4 text-xs font-medium text-gray-500">#</th>
                    <th class="py-3 px-4 text-xs font-medium text-gray-500">Fee Item</th>
                    <th class="py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                    <th class="py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in feeItems"
                    :key="index"
                    class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td class="py-3 px-4 text-gray-500 text-sm">{{ index + 1 }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center text-gray-800">
                        <i class="pi pi-file text-[#0D47A1] mr-2"></i>
                        <span>{{ item.itemTitle.title }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 font-medium text-gray-800">
                      {{ formatCurrency(item.amount) }}
                    </td>
                    <td class="py-3 px-4">
                      <span
                        :class="[
                          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs',
                          item.feesPayment?.cleared ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
                        ]"
                      >
                        <i class="pi" :class="item.feesPayment?.cleared ? 'pi-check-circle' : 'pi-clock'"></i>
                        {{ item.feesPayment?.cleared ? 'Paid' : 'Pending' }}
                      </span>
                    </td>
                  </tr>

                  <!-- Empty state when no items -->
                  <tr v-if="!feeItems || feeItems.length === 0">
                    <td colspan="4" class="py-8 text-center text-gray-500">
                      <div class="flex flex-col items-center">
                        <i class="pi pi-file-excel text-gray-300 text-4xl mb-2"></i>
                        <span>No fee items available</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sleek footer -->
    <div class="px-6 py-3 bg-gray-50 flex justify-between items-center text-sm border-t border-gray-100">
      <span class="text-gray-500">Fee Data {{ date ? `• ${date}` : '' }}</span>
      <button
        @click="$emit('refresh')"
        class="text-[#0D47A1] hover:text-[#90CAF9] flex items-center gap-1 transition-colors duration-200"
      >
        <i class="pi pi-refresh"></i>
        <span>Refresh</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  name: String,
  level: String,
  matric: String,
  session: String,
  faculty: String,
  email: String,
  department: String,
  date: String,
  programme: String,
  feeItems: Array,
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['refresh'])

const activeTab = ref('fees')

// Helper function to get initials from name
const getInitials = (name: string | undefined) => {
  if (!name) return 'S'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Fee statistics helpers
const getPaidItemsCount = () => {
  if (!props.feeItems) return 0
  return props.feeItems.filter((item: any) => item.feesPayment?.cleared).length
}

const getPendingItemsCount = () => {
  if (!props.feeItems) return 0
  return props.feeItems.filter((item: any) => !item.feesPayment?.cleared).length
}

const getTotalAmount = () => {
  if (!props.feeItems) return formatCurrency(0)
  const total = props.feeItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
  return formatCurrency(total)
}
</script>

<style scoped>
/* Clean table styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Subtle animation for status badges */
[class*="bg-green-50"],
[class*="bg-amber-50"] {
  transition: all 0.2s ease;
}

[class*="bg-green-50"]:hover {
  background-color: rgba(0, 170, 70, 0.15);
}

[class*="bg-amber-50"]:hover {
  background-color: rgba(250, 160, 0, 0.15);
}

/* Hover effect for table rows */
tr {
  transition: background-color 0.15s ease;
}

/* Clean, proper spacing for mobile */
@media (max-width: 640px) {
  .p-6 {
    padding: 1.25rem;
  }

  th, td {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
