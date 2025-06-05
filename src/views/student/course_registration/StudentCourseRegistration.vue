<template>
  <div class="course-registration-container">
    <!-- Enhanced Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon-wrapper">
            <div class="header-icon-container">
              <i class="pi pi-graduation-cap header-icon"></i>
            </div>
            <div class="header-glow"></div>
          </div>
          <div class="header-text">
            <h1 class="page-title">Semester Registration</h1>
            <p class="page-subtitle">Complete your course registration and download required documents</p>
          </div>
        </div>

        <div class="header-right">
          <div class="academic-session-badge">
            <i class="pi pi-calendar-clock"></i>
            <span>{{ selectedSession?.name || 'Select Session' }}</span>
          </div>
        </div>
      </div>

      <div class="status-indicators">
        <div class="status-card" :class="{ 'status-active': hasActiveSession }">
          <div class="status-icon-wrapper">
            <i class="pi pi-calendar status-icon"></i>
          </div>
          <div class="status-content">
            <span class="status-label">Academic Session</span>
            <span class="status-value">{{ hasActiveSession ? 'Active' : 'Not Selected' }}</span>
          </div>
        </div>

        <div class="status-card" :class="{ 'status-active': hasRegisteredCourses }">
          <div class="status-icon-wrapper">
            <i class="pi pi-book status-icon"></i>
          </div>
          <div class="status-content">
            <span class="status-label">Registered Courses</span>
            <span class="status-value">{{ courses?.registeredCourses?.length || 0 }} Course(s)</span>
          </div>
        </div>

        <div class="status-card" :class="{ 'status-active': selectedSemester }">
          <div class="status-icon-wrapper">
            <i class="pi pi-clock status-icon"></i>
          </div>
          <div class="status-content">
            <span class="status-label">Current Semester</span>
            <span class="status-value">{{ selectedSemester?.title || 'Not Selected' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filters-header">
          <h2 class="filters-title">
            <i class="pi pi-filter"></i>
            Academic Filters
          </h2>
          <p class="filters-subtitle">Select your academic session and semester</p>
        </div>

        <div class="filters-grid">
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-calendar filter-icon"></i>
              Academic Session
            </label>
            <Sel-ect
              :options="sessions"
              optionLabel="name"
              placeholder="Select Session"
              :modelValue="selectedSession"
              @update:modelValue="(value: any) => selectedSession = value"
              class="custom-select"
            />
          </div>

          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-clock filter-icon"></i>
              Semester
            </label>
            <Sel-ect
              :options="semesters"
              optionLabel="title"
              placeholder="Select Semester"
              :modelValue="selectedSemester"
              @update:modelValue="(value: any) => selectedSemester = value"
              class="custom-select"
            />
          </div>
        </div>
      </div>

      <!-- Course Registration Section -->
      <div v-if="selectedSession && selectedSemester" class="registration-section">
        <div class="section-header">
          <div class="section-header-content">
            <div class="section-header-text">
              <h2 class="section-title">
                <i class="pi pi-book-open"></i>
                Course Registration
              </h2>
              <p class="section-subtitle">Manage your course selection for this semester</p>
            </div>
            <div class="section-header-actions">
              <button
                @click="handleDownload(1)"
                :disabled="courseLoading"
                class="download-btn course-form-btn"
              >
                <i class="pi pi-file-pdf"></i>
                <span>Course Form</span>
              </button>

              <button
                @click="handleDownload(2)"
                :disabled="courseLoading"
                class="download-btn exam-card-btn"
              >
                <i class="pi pi-id-card"></i>
                <span>Exam Card</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="courseLoading" class="loading-state">
          <div class="loading-animation">
            <div class="loading-spinner"></div>
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p class="loading-text">Loading your courses...</p>
        </div>

        <div v-else class="course-panels">
          <!-- Available Courses -->
          <div class="course-panel available-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <i class="pi pi-plus-circle"></i>
                Available Courses
                <span class="course-count">{{ filteredCourseList?.length || 0 }}</span>
              </h3>
            </div>

            <!-- Search Bar -->
            <div class="search-bar-container">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search courses by code or title..."
                  class="search-input"
                />
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="clear-search-btn"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>

            <div class="course-list">
              <!-- No search results -->
              <div v-if="searchQuery && filteredCourseList.length === 0" class="no-search-results">
                <div class="no-results-icon">
                  <i class="pi pi-search"></i>
                </div>
                <h4 class="no-results-title">No courses found</h4>
                <p class="no-results-message">Try searching with a different course code or title</p>
                <button @click="clearSearch" class="clear-search-link">
                  <i class="pi pi-times"></i>
                  Clear search
                </button>
              </div>

              <div v-for="course in filteredCourseList" :key="course.id" class="course-item">
                <div class="course-checkbox">
                  <Check-box
                    v-model="course.selected"
                    :binary="true"
                    @change="handleRegistredCoursesCheckboxChange(course)"
                  />
                </div>
                <div class="course-details">
                  <div class="course-header">
                    <h4 class="course-code">{{ course.courseCode }}</h4>
                    <span class="course-units">{{ course.creditUnit }} Units</span>
                  </div>
                  <p class="course-title">{{ course.title }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registered Courses -->
          <div class="course-panel registered-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <i class="pi pi-check-circle"></i>
                Registered Courses
                <span class="course-count registered-count">{{ courses?.registeredCourses?.length || 0 }}</span>
              </h3>
            </div>

            <div class="course-list">
              <div v-for="course in courses?.registeredCourses" :key="course.id" class="course-item registered-item">
                <div class="course-checkbox">
                  <Check-box
                    v-model="course.selected"
                    :binary="true"
                    @change="handleCourseRemovalCheckBox(course)"
                  />
                </div>
                <div class="course-details">
                  <div class="course-header">
                    <h4 class="course-code">{{ course.courseCode }}</h4>
                    <span class="course-units registered-units">{{ course.creditUnit }} Units</span>
                  </div>
                  <p class="course-title">{{ course.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Empty State -->
      <div v-if="!selectedSession || !selectedSemester" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-graduation-cap"></i>
        </div>
        <h3 class="empty-title">Get Started</h3>
        <p class="empty-message">Select your academic session and semester to begin course registration</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useStudentCourses } from '@/services/student/useStudentCourses'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'

const {
  fetchAllCoursesForStudent,
  registerStudentCourse,
  removeStudentCourse,
  courses,
  selectedSession,
  selectedSemester,
  loading: courseLoading,
  downloadStudentCourseForm,
} = useStudentCourses()
const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const semesters = ref([])
const searchQuery = ref('')

// Define course interface
interface Course {
  id: number
  courseCode: string
  title: string
  creditUnit: number
  selected?: boolean
}

// handle course selection
const handleRegistredCoursesCheckboxChange = async (course: Course) => {
  await registerStudentCourse(
    user.value?.username,
    course.id,
    selectedSession.value!.id,
    selectedSemester.value!.id,
  )
}

const handleCourseRemovalCheckBox = async (course: Course) => {
  await removeStudentCourse(
    user.value?.username,
    course.id,
    selectedSession.value!.id,
    selectedSemester.value!.id,
  )
}

const handleDownload = async (document: number) => {
  await downloadStudentCourseForm(
    user.value?.id,
    selectedSession.value!.id,
    selectedSemester.value!.id,
    document,
  )
}


// load the sessions and semesters
onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})

// watch for session changes and update semester
watch(
  () => selectedSession.value,
  (value: any) => {
    if (selectedSemester.value) {
      selectedSemester.value = null
    }
    semesters.value = value?.semesters || []
  },
)

// watch for session and semester changes before uploading courses
watch(
  () => [selectedSession.value, selectedSemester.value],
  async ([session, semester]) => {
    if (session && semester && user.value) {
      await fetchAllCoursesForStudent(user.value.username, session.id, semester.id)
    }
  },
)

// Computed properties for status indicators
const hasActiveSession = computed(() => {
  return selectedSession.value && selectedSession.value.isOpen; //selectedSemester.value
})

const hasRegisteredCourses = computed(() => {
  return courses.value?.registeredCourses && courses.value.registeredCourses.length > 0
})

// Computed property for filtered course list
const filteredCourseList = computed(() => {
  if (!courses.value?.courseList) return []

  if (!searchQuery.value.trim()) {
    return courses.value.courseList
  }

  const query = searchQuery.value.toLowerCase().trim()
  return courses.value.courseList.filter((course: Course) =>
    course.courseCode.toLowerCase().includes(query) ||
    course.title.toLowerCase().includes(query)
  )
})

// Clear search function
const clearSearch = () => {
  searchQuery.value = ''
}

</script>

<style scoped>
/* === GLOBAL STYLES === */
.course-registration-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 100vh;
  background: #fefefe;
  padding: 2rem;
  animation: containerFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* === HEADER SECTION === */
.header-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
  overflow: hidden;
  animation: headerSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  animation: gradientShift 3s ease-in-out infinite;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon-wrapper {
  position: relative;
}

.header-icon-container {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--primary-dark-color), var(--primary-light-color));
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: iconFloat 6s ease-in-out infinite;
}

.header-icon-container:hover {
  transform: translateY(-8px) rotate(5deg);
  box-shadow: 0 16px 32px rgba(59, 130, 246, 0.4);
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 6rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: glowPulse 4s ease-in-out infinite;
}

/* Page title and subtitle styles are now in base.css */
.page-title {
  animation: titleSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.page-subtitle {
  animation: subtitleFadeIn 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.academic-session-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.academic-session-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

/* === STATUS INDICATORS === */
.status-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: statusCardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.status-card:nth-child(1) { animation-delay: 0.1s; }
.status-card:nth-child(2) { animation-delay: 0.2s; }
.status-card:nth-child(3) { animation-delay: 0.3s; }

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.status-card.status-active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  border-color: rgba(16, 185, 129, 0.3);
}

.status-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-active .status-icon-wrapper {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.status-icon {
  font-size: 1.125rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.status-active .status-icon {
  color: white;
}

.status-content {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

/* === MAIN CONTENT === */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* === FILTERS SECTION === */
.filters-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.6);
  animation: sectionSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.filters-header {
  margin-bottom: 1.5rem;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.filters-title i {
  color: #3b82f6;
}

.filters-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.filter-icon {
  color: #3b82f6;
}

/* === REGISTRATION SECTION === */
.registration-section {
  animation: sectionSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.section-header-text {
  flex: 1;
  min-width: 300px;
}

.section-header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-header-actions .download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.section-header-actions .course-form-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.section-header-actions .exam-card-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.section-header-actions .download-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.section-header-actions .course-form-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.section-header-actions .exam-card-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.section-header-actions .download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.section-title i {
  color: #3b82f6;
}

.section-subtitle {
  color: #64748b;
  font-size: 1rem;
}

/* === LOADING STATE === */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.loading-animation {
  position: relative;
  margin-bottom: 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.25rem;
}

.loading-dots span {
  width: 0.5rem;
  height: 0.5rem;
  background: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

.loading-text {
  font-size: 1.125rem;
  color: #64748b;
  font-weight: 500;
}

/* === COURSE PANELS === */
.course-panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .course-panels {
    grid-template-columns: 1fr 1fr;
  }
}

.course-panel {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: panelSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.available-panel {
  animation-delay: 0.1s;
  border-top: 4px solid #3b82f6;
}

.registered-panel {
  animation-delay: 0.2s;
  border-top: 4px solid #10b981;
}

.course-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
}

.panel-header {
  padding: 1.5rem;
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.panel-title i {
  color: #3b82f6;
}

.registered-panel .panel-title i {
  color: #10b981;
}

.course-count {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  margin-left: auto;
}

.registered-count {
  background: linear-gradient(135deg, #10b981, #059669);
}

/* === SEARCH BAR === */
.search-bar-container {
  padding: 1rem 1.5rem 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: rgba(248, 250, 252, 0.5);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: #374151;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

.search-input::placeholder {
  color: #9ca3af;
  font-size: 0.875rem;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: #9ca3af;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  z-index: 1;
}

.search-input:focus + .search-icon {
  color: #3b82f6;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  padding: 0.25rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  color: #374151;
  background-color: rgba(243, 244, 246, 0.8);
}

.clear-search-btn i {
  font-size: 0.75rem;
}

/* === NO SEARCH RESULTS === */
.no-search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.no-results-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.no-results-icon i {
  font-size: 1.5rem;
  color: #64748b;
}

.no-results-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.no-results-message {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.clear-search-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-search-link:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.clear-search-link i {
  font-size: 0.75rem;
}

.course-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  background: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: courseItemFadeIn 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

.course-item:nth-child(n) {
  animation-delay: calc(0.1s * var(--item-index, 1));
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.registered-item:hover {
  border-color: rgba(16, 185, 129, 0.3);
}

.course-details {
  flex: 1;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.course-code {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.course-units {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.registered-units {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}

.course-title {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}


/* === EMPTY STATE === */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  text-align: center;
  animation: emptyStateSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: iconFloat 6s ease-in-out infinite;
}

.empty-icon i {
  font-size: 2rem;
  color: #64748b;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-message {
  color: #64748b;
  font-size: 1rem;
  max-width: 400px;
}

/* === ANIMATIONS === */
@keyframes containerFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes headerSlideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes titleSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes subtitleFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes statusCardSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes sectionSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes panelSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes courseItemFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes emptyStateSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 768px) {
  .course-registration-container {
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .header-section,
  .filters-section {
    padding: 1.5rem;
  }

  /* Page title responsive styles are now in base.css */

  .status-indicators {
    grid-template-columns: 1fr;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .course-panels {
    grid-template-columns: 1fr;
  }

  .section-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .section-header-actions {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .course-registration-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  /* Page title responsive styles are now in base.css */

  .course-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .course-header {
    width: 100%;
  }

  .section-header-actions {
    flex-direction: column;
  }

  .section-header-actions .download-btn {
    width: 100%;
  }
}

/* === CUSTOM SCROLLBAR === */
.course-list::-webkit-scrollbar {
  width: 6px;
}

.course-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.course-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.course-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* === DEEP STYLES === */
:deep(.custom-select .p-dropdown) {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

:deep(.custom-select .p-dropdown:hover) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.custom-select .p-dropdown:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 0.5rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 1.25rem;
  height: 1.25rem;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: #3b82f6;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover) {
  border-color: #3b82f6;
  transform: scale(1.05);
}
</style>
