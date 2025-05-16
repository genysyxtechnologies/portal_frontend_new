<template>
  <div class="flex flex-col gap-6">
    <!-- Filter Section with enhanced styling -->
    <div
      class="bg-white flex flex-col md:flex-row justify-between gap-4 p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
    >
      <Sel-ect
        :options="sessionOptions"
        optionLabel="name"
        :size="'large'"
        :placeholder="sessionPlaceholder"
        :modelValue="selectedSession"
        @update:modelValue="(value: string | null) => $emit('update:selectedSession', value)"
        class="card w-full transition-all duration-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200"
      />
      <Sel-ect
        :options="semesterOptions"
        optionLabel="title"
        :size="'large'"
        :placeholder="semesterPlaceholder"
        :modelValue="selectedSemester"
        @update:modelValue="(value: string | null) => $emit('update:selectedSemester', value)"
        class="card w-full transition-all duration-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200"
      />
      <div class="w-full relative">
        <InputText
          class="flex-1 w-full h-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
          :placeholder="searchPlaceholder"
          :modelValue="searchQuery"
          @update:modelValue="(value: string) => $emit('update:searchQuery', value)"
        />
        <span class="absolute top-3 right-3 text-gray-400 transition-colors duration-200">
          <i class="pi pi-search"></i>
        </span>
      </div>
    </div>

    <!-- Loading State with better animation -->
    <div v-if="courseLoading" class="relative h-64 flex items-center justify-center">
      <div class="spinner-container">
        <div class="spinner-circle spinner-circle-1"></div>
        <div class="spinner-circle spinner-circle-2"></div>
        <div class="spinner-circle spinner-circle-3"></div>
      </div>
      <p class="mt-16 text-gray-500 animate-pulse">Loading course data...</p>
    </div>

    <!-- Empty State with improved design -->
    <EmptyData
      v-else-if="
        (!registeredCourses || registeredCourses?.length === 0) &&
        (!courseList || courseList?.length === 0) &&
        !courseLoading
      "
      :emptyMessage="emptyStateMessage"
      class="transition-all duration-300"
    />

    <!-- Main Content Area -->
    <div v-else class="flex flex-col lg:flex-row w-full gap-6 transition-all duration-300">
      <!-- Available Courses Panel -->
      <div class="w-full lg:w-1/2 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <i class="pi pi-book text-blue-500"></i>
            Available Courses
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ courseList.length }} courses)
            </span>
          </h2>
          <div class="text-sm text-gray-500">Select courses to register</div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
        >
          <div class="max-h-[500px] overflow-y-auto custom-scroll">
            <transition-group name="list" tag="div">
              <div
                v-for="course in courseList"
                :key="`available-${course.id}`"
                class="group hover:bg-gray-50 transition-all duration-200 ease-in-out"
                :class="{ 'bg-blue-50': course.selected }"
              >
                <div class="flex items-center p-4">
                  <div class="flex-1 min-w-0 ml-4">
                    <div class="flex justify-between items-baseline">
                      <div class="flex items-center gap-3">
                        <Check-box
                          v-model="course.selected"
                          :binary="true"
                          @change="handleRegistredCoursesCheckboxChange(course)"
                          class="custom-checkbox"
                        />
                        <div>
                          <h3
                            class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200"
                          >
                            {{ course.courseCode }}
                          </h3>
                          <p class="text-gray-600 text-sm mt-1">{{ course.title }}</p>
                        </div>
                      </div>
                      <span
                        class="ml-2 text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full transition-all duration-200 group-hover:bg-blue-100"
                      >
                        {{ course.creditUnit }} CU
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Registered Courses Panel -->
      <div class="w-full lg:w-1/2 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <i class="pi pi-check-circle text-green-500"></i>
            Registered Courses
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ registeredCourses.length }} courses)
            </span>
          </h2>
          <div class="text-sm text-gray-500">Selected: {{ selectedCount }}</div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
        >
          <div class="max-h-[500px] overflow-y-auto custom-scroll">
            <transition-group name="list" tag="div">
              <div
                v-for="course in registeredCourses"
                :key="`registered-${course.id}`"
                class="group hover:bg-gray-50 transition-all duration-200 ease-in-out"
                :class="{ 'bg-blue-50': course.selected }"
              >
                <div class="flex items-center p-4 gap-3">
                  <Check-box
                    v-model="course.selected"
                    :binary="true"
                    @change="handleCourseRemovalCheckBox(course)"
                    class="custom-checkbox"
                  />
                  <div class="flex-1 min-w-0 ml-4">
                    <div class="flex justify-between items-baseline">
                      <div>
                        <h3
                          class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200"
                        >
                          {{ course.courseCode }}
                        </h3>
                        <p class="text-gray-600 text-sm mt-1">{{ course.title }}</p>
                      </div>
                      <span
                        class="ml-2 text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full transition-all duration-200 group-hover:bg-green-100"
                      >
                        {{ course.creditUnit }} CU
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Summary Footer with enhanced styling -->
          <div
            v-if="selectedCount > 0"
            class="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 transition-all duration-300"
          >
            <div class="text-sm text-gray-500">
              <span class="font-medium">{{ selectedCount }}</span> of
              {{ registeredCourses.length }} selected
            </div>
            <Button
              label="Register Selected"
              icon="pi pi-send"
              class="p-button-sm p-button-raised p-button-success transition-all duration-200 hover:scale-105"
              @click="handleRegistration"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyData from '@/views/empty/EmptyData.vue'
import { computed, type PropType } from 'vue'

interface Course {
  id: number
  courseCode: string
  title: string
  creditUnit: number
  selected: boolean
}

const props = defineProps({
  courseLoading: {
    type: Boolean,
    default: false,
  },
  sessionOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
  semesterOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
  selectedSession: {
    type: String as PropType<string | null>,
    default: null,
  },
  selectedSemester: {
    type: String as PropType<string | null>,
    default: null,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  sessionPlaceholder: {
    type: String,
    default: 'Select Session',
  },
  semesterPlaceholder: {
    type: String,
    default: 'Select Semester',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search Course',
  },
  emptyStateMessage: {
    type: String,
    default: 'No courses available',
  },
  registeredCourses: {
    type: Array as PropType<Course[]>,
    required: true,
  },
  courseList: {
    type: Array as PropType<Course[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:selectedSession', value: string | null): void
  (e: 'update:selectedSemester', value: string | null): void
  (e: 'update:searchQuery', value: string): void
  (e: 'course-selected', course: Course): void
  (e: 'remove-selected', course: Course): void
  (e: 'register-selected', registeredCourses: Course[]): void
}>()

const selectedCount = computed(() => {
  return props.registeredCourses?.filter((c) => c.selected).length
})

const handleRegistredCoursesCheckboxChange = (course: Course) => {
  emit('course-selected', course)
}

const handleCourseRemovalCheckBox = (course: Course) => {
  emit('remove-selected', course)
}

const handleRegistration = () => {
  const selectedCourses = props.registeredCourses?.filter((c) => c.selected)
  emit('register-selected', selectedCourses)
}
</script>

<style scoped>
/* Enhanced List transition */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

/* Custom scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 8px 8px 0;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* checkbox styling */
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 0.375rem;
  border-width: 1px;
  transition: all 0.2s ease;
  border-color: #d1d5db;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover) {
  border-color: #3b82f6;
}

/* Button hover effect */
:deep(.p-button) {
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.p-button:not(:disabled):active) {
  transform: translateY(0);
}

/* Loading spinner animation */
.spinner-container {
  position: relative;
  height: 3rem;
  width: 3rem;
}

.spinner-circle {
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: #3b82f6;
  border-radius: 9999px;
  animation: spinner-animation 1.2s infinite ease-in-out;
}

.spinner-circle-1 {
  left: 0;
  animation-delay: -0.32s;
}

.spinner-circle-2 {
  left: 50%;
  margin-left: -0.5rem;
  animation-delay: -0.16s;
}

.spinner-circle-3 {
  right: 0;
}

@keyframes spinner-animation {
  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}

/* Panel hover effects */
.panel-hover {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.panel-hover:hover {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow:
    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  transform: translateY(-2px);
}

/* Credit unit badge */
.badge {
  transition: all 0.2s ease;
}

/* Input focus effect */
:deep(.p-inputtext:enabled:hover) {
  border-color: #60a5fa;
}

:deep(.p-inputtext:enabled:focus) {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity));
  --tw-ring-opacity: 1;
  border-color: #60a5fa;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .course-panel {
    width: 100%;
    margin-bottom: 1.5rem;
  }
}

:deep(.custom-checkbox .p-checkbox-box) {
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

:deep(.custom-checkbox .p-checkbox-box .p-checkbox-icon) {
  font-size: 1.25rem !important;
}

:deep(.custom-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.custom-checkbox .p-checkbox-box:hover) {
  border-color: #3b82f6;
}

:deep(.custom-checkbox .p-checkbox-box:focus) {
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.5);
  outline: none;
}
</style>
