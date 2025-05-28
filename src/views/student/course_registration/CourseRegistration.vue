<template>
  <div class="course-registration-wrapper">
    <!-- Professional Header Section with Tailwind CSS -->
    <div class="header-section bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
      <div class="header-pattern"></div>
      <div class="header-content relative z-10">
        <div class="header-title-container">
          <div class="header-icon-container bg-gradient-to-br from-blue-500 to-indigo-600 transform hover:scale-105 hover:rotate-3 transition-all duration-300">
            <i class="pi pi-book-open header-icon"></i>
          </div>
          <div class="header-text">
            <h1 class="header-title text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Course Registration</h1>
            <p class="header-subtitle text-gray-600">Select and manage your courses for the current academic period</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="academic-period bg-white bg-opacity-80 backdrop-filter backdrop-blur-md hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span class="academic-period-label text-gray-500">Academic Year</span>
            <span class="academic-period-value text-blue-800 font-bold">2025/2026</span>
          </div>
        </div>
      </div>
      <div class="header-decoration"></div>
    </div>

    <!-- Filter Section with glass morphism styling -->
    <div class="filter-section">
      <div class="filter-grid">
        <div class="filter-item">
          <label class="filter-label">Academic Session</label>
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
        <div class="filter-item">
          <label class="filter-label">Semester</label>
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
        <div class="filter-item search-container">
          <label class="filter-label">Search Courses</label>
          <div class="search-input-wrapper">
            <InputText
              class="search-input"
              :placeholder="searchPlaceholder"
              :modelValue="searchQuery"
              @update:modelValue="(value: string | undefined) => $emit('update:searchQuery', value as string)"
            />
            <span class="search-icon">
              <i class="pi pi-search"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State with professional animation -->
    <div v-if="courseLoading" class="loading-container">
      <div class="loading-animation">
        <div class="loading-circle"></div>
        <div class="loading-circle"></div>
        <div class="loading-circle"></div>
        <div class="loading-circle"></div>
      </div>
      <p class="loading-text">Loading your courses</p>
    </div>

    <!-- Empty State with improved design -->
    <EmptySelection
      v-else-if="
        (!registeredCourses || registeredCourses?.length === 0) &&
        (!courseList || courseList?.length === 0) &&
        !courseLoading
      "
      :emptyMessage="emptyStateMessage"
      class="empty-state-animation"
    />

    <!-- Main Content Area -->
    <div v-else class="course-panels-container">
      <!-- Available Courses Panel -->
      <div class="course-panel available-courses-panel">
        <div class="panel-header">
          <div class="panel-header-content">
            <h2 class="panel-title">
              <i class="pi pi-book panel-icon"></i>
              Available Courses
            </h2>
            <div class="panel-badge">{{ courseList.length }}</div>
          </div>
          <div class="panel-subtitle">Select courses to register for this semester</div>
        </div>

        <div class="course-list-container available-courses-list">
          <div class="course-list-scroll custom-scroll">
            <transition-group name="course-list" tag="div" class="course-items-container">
              <div v-for="course in courseList" :key="`available-${course.id}`"
                class="course-item"
                :class="{ 'course-item-selected': course.selected }">
                <div class="course-item-content">
                  <div class="course-item-checkbox">
                    <Check-box
                      v-model="course.selected"
                      :binary="true"
                      @change="handleRegistredCoursesCheckboxChange(course)"
                      class="custom-checkbox"
                    />
                  </div>
                  <div class="course-item-details">
                    <div class="course-item-header">
                      <h3 class="course-item-code">{{ course.courseCode }}</h3>
                      <div class="course-item-units available-units">{{ course.creditUnit }} <span>Units</span></div>
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
          <div class="panel-header-content">
            <h2 class="panel-title">
              <i class="pi pi-check-circle panel-icon registered-icon"></i>
              Registered Courses
            </h2>
            <div class="panel-badge registered-badge">{{ registeredCourses.length }}</div>
          </div>
          <div class="panel-subtitle">Your currently registered courses for this semester</div>
        </div>

        <div class="course-list-container registered-courses-list">
          <div class="course-list-scroll custom-scroll">
            <transition-group name="course-list" tag="div" class="course-items-container">
              <div v-for="course in registeredCourses" :key="`registered-${course.id}`"
                class="course-item"
                :class="{ 'course-item-selected': course.selected }">
                <div class="course-item-content">
                  <div class="course-item-checkbox">
                    <Check-box
                      v-model="course.selected"
                      :binary="true"
                      @change="handleCourseRemovalCheckBox(course)"
                      class="custom-checkbox"
                    />
                  </div>
                  <div class="course-item-details">
                    <div class="course-item-header">
                      <h3 class="course-item-code">{{ course.courseCode }}</h3>
                      <div class="course-item-units registered-units">{{ course.creditUnit }} <span>Units</span></div>
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
              <span class="count-highlight">{{ selectedCount }}</span> courses selected
            </div>
            <Button
              label="Complete Registration"
              icon="pi pi-check-circle"
              class="action-button"
              @click="handleRegistration"
            />
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
  gap: 2rem;
  padding: 0.5rem;
  margin: 0 auto;
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Professional Header Styles */
.header-section {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  animation: slideDown 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('');
  opacity: 0.5;
  z-index: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.header-title-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 1rem;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.header-icon-container:hover {
  transform: translateY(-3px) rotate(5deg);
  box-shadow: 0 12px 20px -4px rgba(59, 130, 246, 0.4);
}

.header-icon {
  font-size: 1.75rem;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.academic-period {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.academic-period:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  border-color: rgba(203, 213, 225, 1);
}

.academic-period-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.academic-period-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Filter Section Styles */
.filter-section {
  padding: 1.75rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  position: relative;
  overflow: hidden;
}

.filter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  z-index: -1;
}

.filter-section:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  transform: translateY(-3px);
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-container {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .filter-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .search-container {
    grid-column: auto;
  }
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.25rem;
}

.custom-select {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.search-input:hover {
  border-color: #94a3b8;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  transition: color 0.3s ease;
}

.search-input:focus + .search-icon {
  color: #3b82f6;
}

/* Course Panels Container */
.course-panels-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.available-courses-panel {
  animation: slideInFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.registered-courses-panel {
  animation: slideInFromRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Panel Header Styles */
.panel-header {
  margin-bottom: 1.25rem;
}

.panel-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  position: relative;
}

.panel-icon {
  color: #3b82f6;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.panel-title:hover .panel-icon {
  transform: scale(1.2);
}

.registered-icon {
  color: #10b981;
}

.panel-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 9999px;
  padding: 0 0.75rem;
  transition: all 0.3s ease;
}

.panel-badge:hover {
  background-color: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.registered-badge {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.registered-badge:hover {
  background-color: rgba(16, 185, 129, 0.2);
}

.panel-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-left: 2.5rem;
}

/* Course List Container Styles */
.course-list-container {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-list-container:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
}

.available-courses-list {
  border-top: 4px solid #3b82f6;
  position: relative;
}

.available-courses-list::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.registered-courses-list {
  border-top: 4px solid #10b981;
  position: relative;
}

.registered-courses-list::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.course-list-scroll {
  max-height: 500px;
  overflow-y: auto;
  flex: 1;
}

.course-items-container {
  padding: 0.5rem;
}

/* Course Item Styles */
.course-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.course-item:last-child {
  margin-bottom: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-item-details {
  flex: 1;
  min-width: 0;
}

.course-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.course-item-code {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  transition: all 0.3s ease;
  letter-spacing: -0.01em;
}

.course-item:hover .course-item-code {
  color: #3b82f6;
  transform: translateX(3px);
}

.course-item-title {
  font-size: 0.95rem;
  color: #64748b;
  margin-top: 0.25rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 95%;
  transition: color 0.3s ease;
}

.course-item:hover .course-item-title {
  color: #475569;
}

.course-item-units {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.course-item-units span {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.8;
}

.available-units {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.course-item:hover .available-units {
  background-color: rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(59, 130, 246, 0.15);
}

.registered-units {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.course-item:hover .registered-units {
  background-color: rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.15);
}

.course-item-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(241, 245, 249, 0);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
  opacity: 0;
}

.course-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(203, 213, 225, 1);
}

.course-item:hover .course-item-hover-effect {
  background-color: rgba(241, 245, 249, 0.5);
  opacity: 1;
}

.course-item-selected {
  background-color: rgba(59, 130, 246, 0.03);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.course-item-selected .course-item-hover-effect {
  background-color: rgba(59, 130, 246, 0.05);
}

.course-item-selected.course-item:hover .course-item-hover-effect {
  background-color: rgba(59, 130, 246, 0.08);
}

.course-item-selected.course-item:hover {
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.15);
}

.registered-effect {
  background-color: rgba(16, 185, 129, 0);
}

.course-item:hover .registered-effect {
  background-color: rgba(241, 245, 249, 0.5);
}

.course-item-selected .registered-effect {
  background-color: rgba(16, 185, 129, 0.05);
}

.course-item-selected.course-item:hover .registered-effect {
  background-color: rgba(16, 185, 129, 0.08);
}

.course-item-selected.course-item:hover {
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.15);
}

/* Course Action Footer */
.course-action-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: auto;
  border-radius: 0 0 1rem 1rem;
}

.selected-count {
  font-size: 1rem;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-count::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.count-highlight {
  font-weight: 700;
  color: #10b981;
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

.action-button {
  background: linear-gradient(135deg, #10b981, #0d9488) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25) !important;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #0d9488, #0f766e) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3) !important;
}

.action-button:hover::before {
  left: 100%;
}

.action-button:active {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2) !important;
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
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 0 8px 8px 0;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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

/* Loading Animation Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 3rem 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.loading-animation {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
}

.loading-circle {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: loading-animation 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.loading-circle:nth-child(1) {
  background-color: #3b82f6;
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.loading-circle:nth-child(2) {
  background-color: #10b981;
  top: 0;
  right: 0;
  animation-delay: 0.4s;
}

.loading-circle:nth-child(3) {
  background-color: #f59e0b;
  bottom: 0;
  left: 0;
  animation-delay: 0.8s;
}

.loading-circle:nth-child(4) {
  background-color: #ef4444;
  bottom: 0;
  right: 0;
  animation-delay: 1.2s;
}

.loading-text {
  font-size: 1.125rem;
  color: #64748b;
  font-weight: 500;
  text-align: center;
  animation: pulse 2s infinite;
}

.empty-state-animation {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, floatAnimation 6s ease-in-out infinite;
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
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
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

@keyframes floatAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes loading-animation {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Course list transition animations */
.course-list-enter-active,
.course-list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.course-list-enter-from,
.course-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.course-list-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.course-list-leave-active {
  position: absolute;
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
