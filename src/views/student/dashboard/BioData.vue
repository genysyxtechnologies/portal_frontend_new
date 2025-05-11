<template>
  <div
    class="mx-auto w-full  bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <!-- Header Section with Animation -->
    <div class="bg-[#0D47A1] text-white p-4" v-motion="{
      initial: { opacity: 0, y: -20 },
      enter: { opacity: 1, y: 0, transition: { duration: 500 } }
    }">
      <div class="flex justify-between px-6">
        <div class="flex flex-col gap-4">
          <div class="space-y-1">
            <p>Current Session:</p>
            <p class="font-bold text-lg animate-[pulse_2s_ease-in-out_infinite]">2025/2026</p>
          </div>
          <div class="mt-2">
            <p>Current Semester:</p>
            <p class="font-bold text-lg">Second</p>
          </div>
        </div>
        <Div-ider layout="vertical" />

        <div class="flex flex-col justify-between">
          <p>Payment Status</p>
          <p class="text-green-300">✓ Paid: 2024/2025</p>
          <p class="text-green-300">✓ Paid: 2025/2026</p>
        </div>
      </div>

    </div>

    <!-- Student Information Section -->
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4 sub-title" v-motion="{
        initial: { opacity: 0, x: -20 },
        enter: { opacity: 1, x: 0, transition: { duration: 500, delay: 100 } }
      }">
        Student Information
      </h2>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="(value, key, index) in studentInfo" :key="key" v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              delay: 200 + (index * 50)
            }
          }
        }">
          <label class="block text-[#BFBFBF] mb-1 text-sm">{{ formatLabel(key) }}</label>
          <InputText style="border: 1px solid #90CAF9;" v-model="studentInfo[key]" class="w-full" readonly :pt="{
            root: {
              class: 'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300'
            }
          }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';

const studentInfo = ref({
  state: 'Taraba',
  localGovernment: 'Bali',
  email: 'najimuddeenelwakili@gmail.com',
  phone: '08135710893',
  level: '200',
  yearOfAdmission: '2017',
  programmeType: 'Full-time',
  faculty: 'Natural and Applied Sciences',
  department: 'Computer Science',
  program: 'B.Sc Computer Science'
});

const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
