<template>
  <div class="modern-results-page">
    <!-- Header Section with Enhanced Design -->
    <div class="header-section" data-aos="fade-down" data-aos-duration="600">
      <div class="title-container">
        <div class="icon-wrapper">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="title-content">
          <h1 class="page-title">Academic Results</h1>
          <p class="page-subtitle">View and track your academic performance</p>
        </div>
      </div>

      <!-- Control Panel -->
      <div class="controls-panel" data-aos="fade-left" data-aos-delay="200">
        <div class="selectors-container">
          <div class="selector-group">
            <label class="selector-label">
              <i class="fas fa-calendar-alt"></i>
              Academic Session
            </label>
            <Sel-ect
              v-model="selectedSession"
              :options="sessions"
              :size="'default'"
              optionLabel="name"
              placeholder="Choose Session"
              class="modern-select"
              :pt="{
                root: { class: 'modern-dropdown-root' },
                input: { class: 'modern-dropdown-input' },
                trigger: { class: 'modern-dropdown-trigger' },
                panel: { class: 'modern-dropdown-panel' }
              }"
            />
          </div>

          <div class="selector-group">
            <label class="selector-label">
              <i class="fas fa-clock"></i>
              Semester
            </label>
            <Sel-ect
              v-model="selectedSemester"
              :options="semesters"
              :size="'default'"
              optionLabel="title"
              placeholder="Choose Semester"
              class="modern-select"
              :pt="{
                root: { class: 'modern-dropdown-root' },
                input: { class: 'modern-dropdown-input' },
                trigger: { class: 'modern-dropdown-trigger' },
                panel: { class: 'modern-dropdown-panel' }
              }"
            />
          </div>
        </div>

        <div class="action-buttons">
          <button
            class="print-button"
            @click="printResult"
            :disabled="!selectedSession || !selectedSemester"
          >
            <i class="fas fa-print"></i>
            <span>Print Results</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-area" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
      <!-- Empty State -->
      <div v-if="!selectedSession || !selectedSemester" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3 class="empty-title">Select Academic Period</h3>
        <p class="empty-description">
          Please select both academic session and semester to view your results
        </p>
        <div class="selection-indicators">
          <div class="indicator" :class="{ active: selectedSession }">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ selectedSession ? 'Session Selected' : 'Select Session' }}</span>
          </div>
          <div class="indicator" :class="{ active: selectedSemester }">
            <i class="fas fa-clock"></i>
            <span>{{ selectedSemester ? 'Semester Selected' : 'Select Semester' }}</span>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div v-else class="results-container">
        <div class="results-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="results-title">
                {{ selectedSession?.name }} - {{ selectedSemester?.title }}
              </h2>
              <div class="metadata">
                <span class="meta-item">
                  <i class="fas fa-user"></i>
                  {{ user?.name }}
                </span>
                <span class="meta-item">
                  <i class="fas fa-id-card"></i>
                  {{ user?.username }}
                </span>
                <span class="meta-item">
                  <i class="fas fa-calendar"></i>
                  {{ currentDate }}
                </span>
              </div>
            </div>
            <div class="performance-badges" v-if="studentResult?.data?.current">
              <div class="badge gpa-badge">
                <div class="badge-label">GPA</div>
                <div class="badge-value">{{ studentResult.data.current.gpa || 'N/A' }}</div>
              </div>
              <div class="badge cgpa-badge">
                <div class="badge-label">CGPA</div>
                <div class="badge-value">{{ studentResult.data.current.cgpa || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <StudentResultTable
              ref="resultTableRef"
              :name="user?.name"
              :username="user?.username"
              :session="selectedSession?.name"
              :current-date="currentDate"
              :department="user?.programme?.department"
              :level="studentResult?.level.title"
              :programme="user?.programme.name"
              :results="studentResult?.results"
              :loading="loading"
              :gpa="studentResult?.data?.current?.gpa"
              :cgpa="studentResult?.data?.current?.cgpa"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import StudentResultTable from './StudentResultTable.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentResult } from '@/services/student/useStudentResult'
import { getCurrentDateAndTime } from '@/utils/dateFormater'

const currentDate = getCurrentDateAndTime()

// Define a type for the StudentResultTable component with printTable method
type StudentResultTableType = {
  printTable: () => void
}

const resultTableRef = ref<StudentResultTableType | null>(null)

const printResult = () => {
  // Call the printTable method from the StudentResultTable component
  if (resultTableRef.value) {
    resultTableRef.value.printTable()
  }
}

const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const { fetchStudentResult, studentResult, loading } = useStudentResult()
const selectedSession = ref()
const selectedSemester = ref()
const semesters = ref([])

onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})

watch(
  () => selectedSession.value,
  (value) => {
    if (value && value.semesters) {
      semesters.value = value.semesters
    }
  },
)

watch(
  () => [selectedSession.value, selectedSemester.value],
  async ([session, semester]) => {
    if (session && semester && user.value?.id) {
      await fetchStudentResult(user.value?.username, session.id, semester.id)
    }
  },
)
</script>

<style scoped>
/* Main Container */
.modern-results-page {
  min-height: calc(100vh - 120px);
  background: transparent;
  padding: 1rem 0;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--primary-dark-color), var(--primary-light-color));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.title-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Page title and subtitle styles are now in base.css */

/* Controls Panel */
.controls-panel {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
}

.selectors-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.selector-label i {
  color: #3b82f6;
  font-size: 0.75rem;
}

/* Modern Dropdown Styling */
:deep(.modern-dropdown-root) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.modern-dropdown-root:hover) {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

:deep(.modern-dropdown-input) {
  font-weight: 500;
  color: #1f2937;
  padding: 0.75rem 1rem;
}

:deep(.modern-dropdown-trigger) {
  color: #6b7280;
  transition: color 0.3s ease;
}

:deep(.modern-dropdown-panel) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
}

.print-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.print-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.print-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.print-button i {
  font-size: 0.875rem;
}

/* Content Area */
.content-area {
  position: relative;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  max-width: 400px;
}

.selection-indicators {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(243, 244, 246, 0.8);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.3s ease;
}

.indicator.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #047857;
}

.indicator i {
  font-size: 0.75rem;
}

/* Results Container */
.results-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.results-container:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.results-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.results-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.meta-item i {
  color: #3b82f6;
  font-size: 0.75rem;
}

.performance-badges {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.badge {
  text-align: center;
  padding: 1rem;
  border-radius: 0.75rem;
  min-width: 80px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.gpa-badge {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.cgpa-badge {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.badge-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.table-container {
  padding: 0;
  overflow: auto;
}


/* Responsive Design */
@media (max-width: 1024px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .controls-panel {
    width: 100%;
    flex-direction: column;
    gap: 1.5rem;
  }

  .selectors-container {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .selector-group {
    width: 100%;
    min-width: auto;
  }

  .action-buttons {
    width: 100%;
    justify-content: stretch;
  }

  .print-button {
    width: 100%;
    justify-content: center;
  }

  .card-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .performance-badges {
    align-self: flex-start;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .modern-results-page {
    padding: 0.5rem 0;
  }

  .header-section {
    margin-bottom: 1.5rem;
  }

  .title-container {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }

  /* Page title responsive styles are now in base.css */

  .controls-panel {
    gap: 1rem;
  }

  .selector-label {
    font-size: 0.8rem;
  }

  .print-button {
    padding: 0.875rem 1rem;
    font-size: 0.8rem;
  }

  /* Results Container Mobile */
  .card-header {
    padding: 1.25rem;
  }

  .results-title {
    font-size: 1.25rem;
  }

  .metadata {
    flex-direction: column;
    gap: 0.75rem;
  }

  .meta-item {
    font-size: 0.8rem;
  }

  .performance-badges {
    flex-direction: row;
    gap: 0.75rem;
    justify-content: center;
    width: 100%;
  }

  .badge {
    min-width: auto;
    flex: 1;
    padding: 0.75rem;
  }

  .badge-label {
    font-size: 0.7rem;
  }

  .badge-value {
    font-size: 1.1rem;
  }

  /* Empty State Mobile */
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.25rem;
  }

  .empty-description {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .selection-indicators {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .indicator {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .modern-results-page {
    padding: 0.25rem 0;
  }

  .header-section {
    margin-bottom: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .controls-panel {
    gap: 0.75rem;
  }

  .selector-group {
    gap: 0.375rem;
  }

  :deep(.modern-dropdown-input) {
    padding: 0.6rem 0.75rem;
    font-size: 0.875rem;
  }

  .print-button {
    padding: 0.75rem;
    font-size: 0.75rem;
  }

  .print-button span {
    display: none;
  }

  .print-button i {
    margin: 0;
  }

  .card-header {
    padding: 1rem;
  }

  .results-title {
    font-size: 1.1rem;
  }

  .performance-badges {
    flex-direction: column;
    gap: 0.5rem;
  }

  .badge {
    padding: 0.5rem;
  }

  .badge-value {
    font-size: 1rem;
  }

  .empty-state {
    padding: 1.5rem 0.75rem;
  }

  .empty-title {
    font-size: 1.1rem;
  }

  .empty-description {
    font-size: 0.8rem;
  }
}
</style>
