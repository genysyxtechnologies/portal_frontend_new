<template>
  <div class="flex flex-col gap-6">
    <div class="bg-[#fff] flex justify-between gap-4 p-12 rounded-xl">
      <ReUsableSelect class="flex-1" />
      <ReUsableSelect class="flex-1" />
      <ReUsableSelect class="flex-1" />
      <ReUsableButtons :label="'Download'" class="flex-1" />
    </div>

    <!-- Enhanced Student Information Section -->
    <div class="bg-[#fff] w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Full Name</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.name }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Matric Number</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.matricNumber }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Faculty</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.faculty }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Department</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.department }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Programme</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.programme }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Level</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.level }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Academic Session</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.session }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Registration Date</p>
              <p class="text-lg font-semibold text-gray-800">{{ student.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';
import { ref } from "vue";

interface Student {
  name: string;
  matricNumber: string;
  faculty: string;
  department: string;
  programme: string;
  level: number;
  session: string;
  date: string;
}

const student = ref<Student>({
  name: "Najimuddeen Musa El-wakil",
  matricNumber: "2022/AR/ARA/0002",
  faculty: "Natural and Applied Sciences",
  department: "Computer Science",
  programme: "B.Sc Computer Science",
  level: 200,
  session: "2025/2026",
  date: "25-04-2025, 17:05:21",
});

</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-gray-50 {
  animation: fadeIn 0.5s ease-out forwards;
}

.bg-gray-50:nth-child(1) {
  animation-delay: 0.1s;
}

.bg-gray-50:nth-child(2) {
  animation-delay: 0.2s;
}

.bg-gray-50:nth-child(3) {
  animation-delay: 0.3s;
}

.bg-gray-50:nth-child(4) {
  animation-delay: 0.4s;
}

/* Hover effects */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Custom colors */
:deep(.p-button-primary) {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

:deep(.p-button-primary:hover) {
  background-color: #4338ca;
  border-color: #4338ca;
}

:deep(.p-button-secondary) {
  color: #4f46e5;
  border-color: #4f46e5;
}

:deep(.p-button-secondary:hover) {
  background-color: #eef2ff;
}
</style>
