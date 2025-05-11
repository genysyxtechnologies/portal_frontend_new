<template>
  <div class="bg-gray-100  flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl w-full  p-8 transition-all duration-300 hover:shadow-2xl" v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { duration: 500, type: 'spring' } }
    }">
      <!-- Header with animated gradient -->


      <!-- Student Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div v-for="(field, index) in studentFields" :key="field.id" v-motion="{
          initial: { opacity: 0, x: -20 },
          enter: {
            opacity: 1,
            x: 0,
            transition: {
              delay: 200 + (index * 50),
              duration: 300
            }
          }
        }">
          <label class="block text-gray-600 text-sm font-medium mb-2">{{ field.label }}</label>
          <InputText v-model="field.value" readonly class="w-full" :pt="{
            root: {
              class: 'border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-colors duration-300'
            }
          }" />
        </div>
      </div>

      <Div-ider class="my-4 opacity-30" style="height: 2px; background-color: #0D47A1;" />

      <!-- Fees Information Section -->
      <div class="pt-6" v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { delay: 500, duration: 500 } }
      }">
        <DataTable :value="fees" class="p-datatable-sm shadow-sm rounded-lg" :pt="{
          header: { class: 'bg-gray-100 border-b border-gray-200' },
          bodyRow: { class: 'hover:bg-gray-50 transition-colors duration-200' }
        }">
          <Column field="index" header="S/N" style="width: 10%">
            <template #body="{ index }">
              {{ index + 1 }}.
            </template>
          </Column>
          <Column field="title" header="Title" style="width: 40%"></Column>
          <Column field="amount" header="Amount" style="width: 20%"></Column>
          <Column field="status" header="Status" style="width: 30%">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="data.status === 'Success' ? 'success' : 'danger'"
                class="text-xs font-semibold" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const studentFields = ref([
  { id: 1, label: 'Name', value: 'Najimuddeen Musa El-wakil' },
  { id: 2, label: 'Level', value: '200' },
  { id: 3, label: 'Matric', value: '2022/AR/ARA/0002' },
  { id: 4, label: 'Session', value: '2025/2026' },
  { id: 5, label: 'Faculty', value: 'Natural and Applied Sciences' },
  { id: 6, label: 'Email', value: 'najimuddeenelwakil@gmail.com' },
  { id: 7, label: 'Department', value: 'Computer Science' },
  { id: 8, label: 'Date', value: 'Fri, 25 Apr 2025, 14:48:53' },
  { id: 9, label: 'Programme', value: 'B.Sc Computer Science' },
  { id: 10, label: 'Invoice', value: 'Not Generated' }
]);

const fees = ref([
  { title: 'Undergraduate School Fees', amount: 'N22,500', status: 'Success' },
]);
</script>

<style scoped>
/* Custom animations */
:deep(.p-inputtext) {
  transition: all 0.3s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  :deep(.p-datatable) {
    font-size: 0.875rem;
  }
}
</style>
