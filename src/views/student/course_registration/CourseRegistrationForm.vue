<template>
  <div class="flex flex-col gap-6 relative">
    <div v-if="!loading" class="bg-[#fff] flex justify-between gap-4 p-12 rounded-xl">
      <Sel-ect :options="documents" optionLabel="name" :size="'large'" placeholder="Select Document"
        :modelValue="selectedDocument"
        @update:modelValue="(value: string | null) => $emit('update:selectedDocument', value)" class="card w-full" />
      <Sel-ect :options="sessionOptions" optionLabel="name" :size="'large'" :placeholder="sessionPlaceholder"
        :modelValue="selectedSession"
        @update:modelValue="(value: string | null) => $emit('update:selectedSession', value)" class="card w-full" />
      <Sel-ect :options="semesterOptions" optionLabel="title" :size="'large'" :placeholder="semesterPlaceholder"
        :modelValue="selectedSemester"
        @update:modelValue="(value: string | null) => $emit('update:selectedSemester', value)" class="card w-full" />
      <div class="w-full relative">
        <ReUsableButtons :label="'Download'" class="flex-1 w-full"
          @on-click="emit('on-download', selectedDocument.value)"
          :disabled="!selectedDocument || loading || !selectedSession || !selectedSemester" />
      </div>
    </div>
    <SpinningAnimation v-if="loading" :loading="loading" :headTitle="headTitle" :subTitle="subTitle" />
    <EmptyData v-if="!selectedSemester || !selectedSession" :emptyMessage="emptyStateMessage" />



    <!-- Enhanced Student Information Section -->
    <div v-else
      class="bg-[#fff] w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <div v-if="!loading" class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Full Name</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.name }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Matric Number</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.username }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Faculty</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.programme.department.faculty.name }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Department</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.programme.department.name }}</p>
            </div>
          </div>
          <!-- Right Column -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Programme</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.programme.name }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Level</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.level.title }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Academic Session</p>
              <p class="text-lg font-semibold text-gray-800">{{ academicSession }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01]">
              <p class="text-sm text-gray-500 font-medium">Registration Date</p>
              <p class="text-lg font-semibold text-gray-800">{{ currentDateAndTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';
import { ref, watch, type PropType } from "vue";
import EmptyData from '@/views/empty/EmptyData.vue';
import type { UserResponse } from '@/types/student/dashboard_information';
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue';



interface Course {
  id: number;
  courseCode: string;
  title: string;
  creditUnit: number;
  selected: boolean;
}

const props = defineProps({
  courseLoading: {
    type: Boolean,
    default: false
  },
  sessionOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => []
  },
  semesterOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => []
  },
  selectedSession: {
    type: String as PropType<string | null>,
    default: null
  },
  selectedSemester: {
    type: String as PropType<string | null>,
    default: null
  },

  selectedDocument: {
    type: Object as PropType<{ name: string; value: string }>,
    default: () => ({ name: 'Course form', value: 1 })
  },

  searchQuery: {
    type: String,
    default: ''
  },
  sessionPlaceholder: {
    type: String,
    default: 'Select Session'
  },
  semesterPlaceholder: {
    type: String,
    default: 'Select Semester'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search Course'
  },
  emptyStateMessage: {
    type: String,
    default: 'No courses available'
  },

  academicSession: {
    type: String || null,
    default: null
  },

  user: {
    type: Object as PropType<UserResponse['user']>,
    default: () => ({})
  },

  documents: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => []
  },

  currentDateAndTime: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  },

  headTitle: {
    type: String,
    default: 'Loading your information...'
  },

  subTitle: {
    type: String,
    default: 'Please wait while we prepare your form'
  }

});

const emit = defineEmits<{
  (e: 'update:selectedSession', value: string | null): void
  (e: 'update:selectedSemester', value: string | null): void
  (e: 'update:selectedDocument', value: string | null): void
  (e: 'update:searchQuery', value: string): void
  (e: 'course-selected', course: Course): void
  (e: 'remove-selected', course: Course): void
  (e: 'register-selected', registeredCourses: Course[]): void
  (e: 'on-download', value: string): void
}>();


/* const documents = ref([
  {
    name: 'Course form',
    value: 1
  },
  {
    name: 'Exam card',
    value: 2
  }
]) */



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
