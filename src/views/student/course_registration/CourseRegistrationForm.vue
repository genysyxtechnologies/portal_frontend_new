<template>
  <div class="registration-form-container">
    <div v-if="!loading" class="form-selection-panel">
      <div class="selection-header">
        <h2 class="selection-title">Registration Documents</h2>
        <p class="selection-subtitle">Select your academic session, semester and document type</p>
      </div>

      <div class="selection-grid">
        <div class="selection-item document-selection">
          <label class="selection-label">
            <i class="pi pi-file-pdf selection-icon"></i>
            Document Type
          </label>
          <Sel-ect
            :options="documents"
            optionLabel="name"
            :size="'large'"
            placeholder="Select Document"
            :modelValue="selectedDocument"
            @update:modelValue="(value: string | null) => $emit('update:selectedDocument', value)"
            class="custom-select"
          />
        </div>

        <div class="selection-item session-selection">
          <label class="selection-label">
            <i class="pi pi-calendar selection-icon"></i>
            Academic Session
          </label>
          <Sel-ect
            :options="sessionOptions"
            optionLabel="name"
            :size="'large'"
            :placeholder="sessionPlaceholder"
            :modelValue="selectedSession"
            @update:modelValue="(value: string | null) => $emit('update:selectedSession', value)"
            class="custom-select"
          />
        </div>

        <div class="selection-item semester-selection">
          <label class="selection-label">
            <i class="pi pi-clock selection-icon"></i>
            Semester
          </label>
          <Sel-ect
            :options="semesterOptions"
            optionLabel="title"
            :size="'large'"
            :placeholder="semesterPlaceholder"
            :modelValue="selectedSemester"
            @update:modelValue="(value: string | null) => $emit('update:selectedSemester', value)"
            class="custom-select"
          />
        </div>

        <div class="selection-item download-button-container">
          <label class="selection-label">
            <i class="pi pi-download selection-icon"></i>
            Action
          </label>
          <ReUsableButtons
            :label="'Download'"
            class="download-button"
            @on-click="emit('on-download', selectedDocument.value)"
            :disabled="!selectedDocument || loading || !selectedSession || !selectedSemester"
          />
        </div>
      </div>
    </div>
    <SpinningAnimation v-if="loading" :loading="loading" :headTitle="headTitle" :subTitle="subTitle" />
    <EmptySelection v-else-if="!selectedSemester || !selectedSession" :emptyMessage="emptyStateMessage" />

    <!-- Enhanced Student Information Section -->
    <div v-else class="student-info-panel">
      <div class="info-header">
        <h2 class="info-title">
          <i class="pi pi-user-edit info-title-icon"></i>
          Student Information
        </h2>
        <div class="info-subtitle">Review your details before downloading documents</div>
      </div>

      <div class="info-grid">
        <!-- Left Column -->
        <div class="info-column">
          <div class="info-card student-name">
            <div class="info-card-icon">
              <i class="pi pi-user"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Full Name</h3>
              <p class="info-card-value">{{ user.name }}</p>
            </div>
          </div>

          <div class="info-card student-id">
            <div class="info-card-icon">
              <i class="pi pi-id-card"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Matric Number</h3>
              <p class="info-card-value">{{ user.username }}</p>
            </div>
          </div>

          <div class="info-card faculty-info">
            <div class="info-card-icon">
              <i class="pi pi-building"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Faculty</h3>
              <p class="info-card-value">{{ user.programme.department.faculty.name }}</p>
            </div>
          </div>

          <div class="info-card department-info">
            <div class="info-card-icon">
              <i class="pi pi-sitemap"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Department</h3>
              <p class="info-card-value">{{ user.programme.department.name }}</p>
            </div>
          </div>
        </div>
        <!-- Right Column -->
        <div class="info-column">
          <div class="info-card programme-info">
            <div class="info-card-icon">
              <i class="pi pi-book"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Programme</h3>
              <p class="info-card-value">{{ user.programme.name }}</p>
            </div>
          </div>

          <div class="info-card level-info">
            <div class="info-card-icon">
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Level</h3>
              <p class="info-card-value">{{ user.level.title }}</p>
            </div>
          </div>

          <div class="info-card session-info">
            <div class="info-card-icon">
              <i class="pi pi-calendar"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Academic Session</h3>
              <p class="info-card-value">{{ academicSession }}</p>
            </div>
          </div>

          <div class="info-card date-info">
            <div class="info-card-icon">
              <i class="pi pi-clock"></i>
            </div>
            <div class="info-card-content">
              <h3 class="info-card-label">Registration Date</h3>
              <p class="info-card-value">{{ currentDateAndTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import { ref, watch, type PropType } from 'vue'

import type { UserResponse } from '@/types/student/dashboard_information'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import EmptySelection from '@/views/empty/EmptySelection.vue'

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

  selectedDocument: {
    type: Object as PropType<{ name: string; value: string }>,
    default: () => ({ name: 'Course form', value: 1 }),
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

  academicSession: {
    type: String || null,
    default: null,
  },

  user: {
    type: Object as PropType<UserResponse['user']>,
    default: () => ({}),
  },

  documents: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },

  currentDateAndTime: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },

  headTitle: {
    type: String,
    default: 'Loading your information...',
  },

  subTitle: {
    type: String,
    default: 'Please wait while we prepare your form',
  },
})

const emit = defineEmits<{
  (e: 'update:selectedSession', value: string | null): void
  (e: 'update:selectedSemester', value: string | null): void
  (e: 'update:selectedDocument', value: string | null): void
  (e: 'update:searchQuery', value: string): void
  (e: 'course-selected', course: Course): void
  (e: 'remove-selected', course: Course): void
  (e: 'register-selected', registeredCourses: Course[]): void
  (e: 'on-download', value: string): void
}>()

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
/* Main Container Styles */
.registration-form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.6s ease-out forwards;
}

/* Form Selection Panel Styles */
.form-selection-panel {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  animation: slideInFromTop 0.6s ease-out forwards;
  border-top: 4px solid #3b82f6;
}

.selection-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.selection-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.selection-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .selection-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .selection-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fadeIn 0.5s ease-out forwards;
}

.document-selection { animation-delay: 0.1s; }
.session-selection { animation-delay: 0.2s; }
.semester-selection { animation-delay: 0.3s; }
.download-button-container { animation-delay: 0.4s; }

.selection-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.selection-icon {
  color: #3b82f6;
  font-size: 1rem;
}

.custom-select {
  width: 100%;
  transition: all 0.3s ease;
}

:deep(.custom-select .p-dropdown) {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

:deep(.custom-select .p-dropdown:hover) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

:deep(.custom-select .p-dropdown:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.download-button {
  width: 100%;
  height: 100%;
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  border-radius: 0.5rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2) !important;
}

.download-button:hover:not(:disabled) {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3) !important;
}

.download-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

/* Student Info Panel Styles */
.student-info-panel {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: slideInFromBottom 0.7s ease-out forwards;
  border-top: 4px solid #10b981;
}

.info-header {
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.info-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-title-icon {
  color: #10b981;
}

.info-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 2rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

.student-name { animation-delay: 0.1s; }
.student-id { animation-delay: 0.2s; }
.faculty-info { animation-delay: 0.3s; }
.department-info { animation-delay: 0.4s; }
.programme-info { animation-delay: 0.1s; }
.level-info { animation-delay: 0.2s; }
.session-info { animation-delay: 0.3s; }
.date-info { animation-delay: 0.4s; }

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.info-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #f1f5f9;
  color: #3b82f6;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.info-card:hover .info-card-icon {
  background-color: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.info-card-content {
  flex: 1;
}

.info-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.info-card-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Custom styling for specific cards */
.student-name {
  border-left-color: #3b82f6;
}

.student-id {
  border-left-color: #f59e0b;
}

.faculty-info {
  border-left-color: #10b981;
}

.department-info {
  border-left-color: #6366f1;
}

.programme-info {
  border-left-color: #ec4899;
}

.level-info {
  border-left-color: #8b5cf6;
}

.session-info {
  border-left-color: #14b8a6;
}

.date-info {
  border-left-color: #f97316;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Additional Custom Animations */
@keyframes fadeInWithSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Animation delays for info cards */
.bg-gray-50:nth-child(4) {
  animation-delay: 0.4s;
}
</style>
