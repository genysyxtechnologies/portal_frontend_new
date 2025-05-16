<template>
  <div class="course-registration-wrapper">
    <!-- Filter Section with enhanced styling -->
    <div class="filter-section">
      <Sel-ect :options="sessionOptions" optionLabel="name" :size="'large'" :placeholder="sessionPlaceholder"
        :modelValue="selectedSession"
        @update:modelValue="(value: string | null) => $emit('update:selectedSession', value)"
        class="card w-full transition-all duration-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200" />
      <Sel-ect :options="semesterOptions" optionLabel="title" :size="'large'" :placeholder="semesterPlaceholder"
        :modelValue="selectedSemester"
        @update:modelValue="(value: string | null) => $emit('update:selectedSemester', value)"
        class="card w-full transition-all duration-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200" />
      <div class="w-full relative">
        <InputText
          class="flex-1 w-full h-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
          :placeholder="searchPlaceholder" :modelValue="searchQuery"
          @update:modelValue="(value: string | undefined) => $emit('update:searchQuery', value as string)" />
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
    <EmptySelection v-else-if="
      (!registeredCourses || registeredCourses?.length === 0) &&
      (!courseList || courseList?.length === 0) &&
      !courseLoading
    " :emptyMessage="emptyStateMessage" class="transition-all duration-300" />

    <!-- Main Content Area -->
    <div v-else class="course-panels-container">
      <!-- Available Courses Panel -->
      <div class="course-panel available-courses-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="pi pi-book panel-icon"></i>
            Available Courses
            <span class="course-count">
              ({{ courseList.length }} courses)
            </span>
          </h2>
          <div class="panel-subtitle">Select courses to register</div>
        </div>

        <div class="course-list-container available-courses-list">
          <div class="course-list-scroll">
            <transition-group name="list" tag="div">
              <div v-for="course in courseList" :key="`available-${course.id}`"
                class="course-item"
                :class="{ 'course-item-selected': course.selected }">
                <div class="course-item-content">
                  <div class="course-item-checkbox">
                    <Check-box v-model="course.selected" :binary="true"
                      @change="handleRegistredCoursesCheckboxChange(course)" class="custom-checkbox" />
                  </div>
                  <div class="course-item-details">
                    <div class="course-item-header">
                      <h3 class="course-item-code">{{ course.courseCode }}</h3>
                      <span class="course-item-units available-units">{{ course.creditUnit }} CU</span>
                    </div>
                    <p class="course-item-title">{{ course.title }}</p>
                  </div>
                </div>
                <div class="course-item-hover-effect"></div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Registered Courses Panel -->
      <div class="course-panel registered-courses-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="pi pi-check-circle panel-icon registered-icon"></i>
            Registered Courses
            <span class="course-count">
              ({{ registeredCourses.length }} courses)
            </span>
          </h2>
          <div class="panel-subtitle">Select courses to remove</div>
        </div>

        <div class="course-list-container registered-courses-list">
          <div class="course-list-scroll">
            <transition-group name="list" tag="div">
              <div v-for="course in registeredCourses" :key="`registered-${course.id}`"
                class="course-item"
                :class="{ 'course-item-selected': course.selected }">
                <div class="course-item-content">
                  <div class="course-item-checkbox">
                    <Check-box v-model="course.selected" :binary="true"
                      @change="handleCourseRemovalCheckBox(course)" class="custom-checkbox" />
                  </div>
                  <div class="course-item-details">
                    <div class="course-item-header">
                      <h3 class="course-item-code">{{ course.courseCode }}</h3>
                      <span class="course-item-units registered-units">{{ course.creditUnit }} CU</span>
                    </div>
                    <p class="course-item-title">{{ course.title }}</p>
                  </div>
                </div>
                <div class="course-item-hover-effect registered-effect"></div>
              </div>
            </transition-group>
          </div>

          <!-- Summary Footer with enhanced styling -->
          <div v-if="selectedCount > 0" class="course-action-footer">
            <div class="selected-count">
              <span class="count-highlight">{{ selectedCount }}</span> of
              {{ registeredCourses.length }} selected
            </div>
            <Button label="Register Selected" icon="pi pi-send"
              class="action-button"
              @click="handleRegistration" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import EmptySelection from '@/views/empty/EmptySelection.vue'
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
/* Main Container Styles */
.course-registration-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.6s ease-out forwards;
}

/* Filter Section Styles */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  animation: slideDown 0.5s ease-out forwards;
}

@media (min-width: 768px) {
  .filter-section {
    flex-direction: row;
  }
}

.filter-section:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Course Panels Container */
.course-panels-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
}

@media (min-width: 1024px) {
  .course-panels-container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Course Panel Styles */
.course-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 0.3s ease;
}

.available-courses-panel {
  animation: slideInFromLeft 0.6s ease-out forwards;
}

.registered-courses-panel {
  animation: slideInFromRight 0.6s ease-out forwards;
}

/* Panel Header Styles */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.panel-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.registered-icon {
  color: #10b981;
}

.course-count {
  font-size: 0.875rem;
  font-weight: 400;
  color: #64748b;
  margin-left: 0.5rem;
}

.panel-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

/* Course List Container Styles */
.course-list-container {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.course-list-container:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.available-courses-list {
  border-top: 3px solid #3b82f6;
}

.registered-courses-list {
  border-top: 3px solid #10b981;
}

.course-list-scroll {
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Course Item Styles */
.course-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.course-item:last-child {
  border-bottom: none;
}

.course-item-content {
  display: flex;
  align-items: flex-start;
  padding: 1.25rem;
  position: relative;
  z-index: 1;
}

.course-item-checkbox {
  margin-right: 1rem;
}

.course-item-details {
  flex: 1;
  min-width: 0;
}

.course-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.course-item-code {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  transition: color 0.3s ease;
}

.course-item:hover .course-item-code {
  color: #3b82f6;
}

.course-item-title {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.course-item-units {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.available-units {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.course-item:hover .available-units {
  background-color: rgba(59, 130, 246, 0.2);
}

.registered-units {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.course-item:hover .registered-units {
  background-color: rgba(16, 185, 129, 0.2);
}

.course-item-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(241, 245, 249, 0);
  transition: background-color 0.3s ease;
  z-index: 0;
}

.course-item:hover .course-item-hover-effect {
  background-color: rgba(241, 245, 249, 0.8);
}

.course-item-selected {
  background-color: rgba(59, 130, 246, 0.05);
}

.course-item-selected .course-item-hover-effect {
  background-color: rgba(59, 130, 246, 0.1);
}

.course-item-selected.course-item:hover .course-item-hover-effect {
  background-color: rgba(59, 130, 246, 0.15);
}

.registered-effect {
  background-color: rgba(16, 185, 129, 0);
}

.course-item:hover .registered-effect {
  background-color: rgba(241, 245, 249, 0.8);
}

.course-item-selected .registered-effect {
  background-color: rgba(16, 185, 129, 0.1);
}

.course-item-selected.course-item:hover .registered-effect {
  background-color: rgba(16, 185, 129, 0.15);
}

/* Course Action Footer */
.course-action-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.selected-count {
  font-size: 0.875rem;
  color: #64748b;
}

.count-highlight {
  font-weight: 600;
  color: #3b82f6;
}

.action-button {
  background-color: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.5rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.2) !important;
}

.action-button:hover {
  background-color: #059669 !important;
  border-color: #059669 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3) !important;
}

/* Enhanced List transition */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
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

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
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
