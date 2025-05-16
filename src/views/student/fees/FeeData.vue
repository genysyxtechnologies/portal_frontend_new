<template>
  <div
    class="bg-white rounded-xl shadow-lg w-full p-6 transition-all duration-500 relative"
    :class="{ 'opacity-0 scale-95': loading, 'opacity-100 scale-100': !loading }"
  >
    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10"
      v-motion="{
        initial: { opacity: 1 },
        enter: { opacity: 1 },
        leave: { opacity: 0, transition: { duration: 300 } },
      }"
    >
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="relative w-16 h-16">
            <div
              class="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              style="animation-duration: 1s"
            ></div>
            <div
              class="absolute inset-1 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"
              style="animation-duration: 1.5s; animation-direction: reverse"
            ></div>
          </div>
        </div>
        <p class="text-gray-600 font-medium">Loading student data...</p>
        <p class="text-sm text-gray-400 mt-1">Please wait while we fetch your information</p>
      </div>
    </div>

    <!-- Student Information Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      v-motion="{
        initial: { opacity: 0 },
        enter: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.3,
          },
        },
      }"
    >
      <template v-for="(field, index) in studentFields" :key="field.id">
        <div
          v-motion="{
            initial: { opacity: 0, x: -20 },
            enter: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 400,
                type: 'spring',
                damping: 15,
              },
            },
          }"
        >
          <label class="block text-gray-600 text-sm font-medium mb-2">{{ field.label }}</label>
          <div class="relative">
            <InputText
              :placeholder="field.value"
              readonly
              class="w-full pl-3 pr-8"
              :pt="{
                root: {
                  class:
                    'border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-300 shadow-sm',
                },
              }"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i class="pi pi-lock"></i>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Divider
      class="my-6 opacity-20"
      style="height: 1px; background: linear-gradient(90deg, transparent, #0d47a1, transparent)"
    />

    <!-- Fees Information Section -->
    <div
      class="pt-4"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            duration: 500,
            type: 'spring',
            stiffness: 80,
          },
        },
      }"
    >
      <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <i class="pi pi-wallet mr-2 text-blue-500"></i>
        Fee Payment Details
      </h2>

      <DataTable
        :value="feeItems"
        class="p-datatable-sm rounded-lg border border-gray-100 shadow-sm"
        :loading="loading"
        :pt="{
          wrapper: { class: 'rounded-lg overflow-hidden' },
          header: { class: 'bg-gray-50 border-b border-gray-100' },
          bodyRow: {
            class:
              'hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-50 last:border-b-0',
            style: 'animation: fadeIn 0.3s ease-out forwards',
          },
          loadingOverlay: { class: 'bg-white/80 backdrop-blur-sm' },
          loadingIcon: { class: 'text-blue-500' },
        }"
      >
        <Column field="index" header="S/N" style="width: 10%">
          <template #body="{ index }">
            <div class="text-gray-500 font-medium">{{ index + 1 }}.</div>
          </template>
        </Column>
        <Column field="itemTitle.title" header="Fee Item" style="width: 40%">
          <template #body="{ data }">
            <div class="flex items-center">
              <i class="pi pi-file mr-2 text-blue-400"></i>
              <span>{{ data.itemTitle.title }}</span>
            </div>
          </template>
        </Column>
        <Column field="amount" header="Amount" style="width: 20%">
          <template #body="{ data }">
            <div class="font-medium text-gray-700">
              {{ formatCurrency(data.amount) }}
            </div>
          </template>
        </Column>
        <Column field="feePayment.cleared" header="Status" style="width: 30%">
          <template #body="{ data }">
            <Tag
              :value="data ? 'Paid' : 'Pending'"
              :severity="data ? 'success' : 'warning'"
              class="text-xs font-semibold py-1 px-3 rounded-full"
              :pt="{
                root: ({ props }) => ({
                  class: [
                    'shadow-sm',
                    props.severity === 'success' ? 'bg-green-100 text-green-800' : '',
                    props.severity === 'warning' ? 'bg-amber-100 text-amber-800' : '',
                  ],
                }),
              }"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}

const studentFields = computed(() => [
  { id: 1, label: 'Name', value: props.name || 'Not available' },
  { id: 2, label: 'Level', value: props.level || 'Not available' },
  { id: 3, label: 'Matric Number', value: props.matric || 'Not available' },
  { id: 4, label: 'Session', value: props.session || 'Not available' },
  { id: 5, label: 'Faculty', value: props.faculty || 'Not available' },
  { id: 6, label: 'Email', value: props.email || 'Not available' },
  { id: 7, label: 'Department', value: props.department || 'Not available' },
  { id: 8, label: 'Date', value: props.date || 'Not available' },
  { id: 9, label: 'Programme', value: props.programme || 'Not available' },
])
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-datatable-tbody > tr) {
  animation: fadeIn 0.4s ease-out forwards;
  animation-delay: calc(var(--row-index) * 50ms);
}

:deep(.p-inputtext) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-inputtext:hover) {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.2);
}

@media (max-width: 768px) {
  :deep(.p-datatable) {
    font-size: 0.875rem;
  }

  :deep(.p-column-title) {
    font-size: 0.75rem;
  }
}
</style>
