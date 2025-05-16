<template>
  <div class="print-result-container">
    <!-- Header with animation -->
    <div class="header-section">
      <h1 class="university-name">NASARAWA STATE UNIVERSITY, KEFFI</h1>
      <h2 class="result-title">Student's Result</h2>
    </div>

    <!-- Student Information Section -->
    <transition-group name="fade-slide" tag="div" class="student-info-section">
      <div class="info-grid" v-if="!loading">
        <div class="info-row">
          <div class="info-cell">
            <div class="info-label">Name</div>
            <div class="info-value">{{ name }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Matric:</div>
            <div class="info-value">{{ username }}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-cell">
            <div class="info-label">Faculty</div>
            <div class="info-value">{{ department?.faculty?.name }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Department:</div>
            <div class="info-value">{{ department }}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-cell">
            <div class="info-label">Programme</div>
            <div class="info-value">{{ programme?.name }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Level</div>
            <div class="info-value">{{ level?.title }}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-cell">
            <div class="info-label">Session</div>
            <div class="info-value">{{ sessionName }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Semester:</div>
            <div class="info-value">{{ semesterName }}</div>
          </div>
        </div>
      </div>

      <!-- Skeleton Loader for Student Info -->
      <div v-else class="info-grid skeleton-container">
        <div class="info-row" v-for="i in 4" :key="i">
          <div class="info-cell">
            <div class="skeleton-label"></div>
            <div class="skeleton-value"></div>
          </div>
          <div class="info-cell">
            <div class="skeleton-label"></div>
            <div class="skeleton-value"></div>
          </div>
        </div>
      </div>
    </transition-group>

    <!-- Results Table -->
    <transition name="fade-up">
      <div class="results-section" v-if="!loading">
        <DataTable :value="result" stripedRows class="result-table" tableStyle="min-width: 50rem">
          <Column field="course.code" header="Course code" headerStyle="width: 15%" class="course-code-column">
            <template #body="{ data }">
              <div class="course-code">{{ data.course.code }}</div>
            </template>
          </Column>
          <Column field="course.unit" header="Unit" headerStyle="width: 10%" class="unit-column">
            <template #body="{ data }">
              <div class="unit">{{ data.course.unit }}</div>
            </template>
          </Column>
          <Column field="ca" header="CA" headerStyle="width: 15%" class="ca-column">
            <template #body="{ data }">
              <div class="ca">{{ data.ca || '-' }}</div>
            </template>
          </Column>
          <Column field="exam" header="Exam" headerStyle="width: 15%" class="exam-column">
            <template #body="{ data }">
              <div class="exam">{{ data.exam }}</div>
            </template>
          </Column>
          <Column field="total" header="Total" headerStyle="width: 15%" class="total-column">
            <template #body="{ data }">
              <div class="total">{{ data.total }}</div>
            </template>
          </Column>
          <Column field="grade" header="Grade" headerStyle="width: 15%" class="grade-column">
            <template #body="{ data }">
              <div class="grade" :class="getGradeClass(data.grade)">{{ data.grade }}</div>
            </template>
          </Column>
        </DataTable>

        <!-- GPA Summary Section -->
        <div class="gpa-summary">
          <div class="summary-row">
            <div class="summary-cell">TCE</div>
            <div class="summary-cell">TCR</div>
            <div class="summary-cell">TGP</div>
            <div class="summary-cell">GPA</div>
            <div class="summary-cell">CGPA</div>
          </div>
          <div class="summary-row summary-values">
            <div class="summary-cell">{{ studentResult?.data.current.tce || '-' }}</div>
            <div class="summary-cell">{{ studentResult?.data.current.tcr || '-' }}</div>
            <div class="summary-cell">{{ studentResult?.data.current.tgp || '-' }}</div>
            <div class="summary-cell">{{ studentResult?.data.current.gpa || '-' }}</div>
            <div class="summary-cell cgpa">{{ studentResult?.data.current.cgpa || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Skeleton Loader for Results Table -->
      <div v-else class="results-section skeleton-container">
        <div class="skeleton-table-header">
          <div class="skeleton-header-cell" v-for="i in 6" :key="i"></div>
        </div>
        <div class="skeleton-table-row" v-for="i in 8" :key="i">
          <div class="skeleton-cell" v-for="j in 6" :key="j"></div>
        </div>
        <div class="skeleton-gpa">
          <div class="skeleton-gpa-header">
            <div class="skeleton-gpa-cell" v-for="i in 5" :key="i"></div>
          </div>
          <div class="skeleton-gpa-values">
            <div class="skeleton-gpa-cell" v-for="i in 5" :key="i"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Watermark -->
    <div class="watermark" v-if="!loading">Printed on {{ currentDate }}</div>

    <!-- Print/Download Buttons -->
    <div class="action-buttons" v-if="!loading">
      <Button icon="pi pi-print" label="Print Result" @click="printResult" class="print-button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Department, Level, Programme } from '@/types/student/dashboard_information'
import type { StudentResult } from '@/types/student/result.information'
import { getCurrentDateAndTime } from '@/utils/dateFormater'
import type { PropType } from 'vue'

// Props for the component
defineProps({
  name: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  sessionName: {
    type: String,
    default: ''
  },
  semesterName: {
    type: String,
    default: ''
  },

  department: {
    type: Object as PropType<Department>,
    default: () => ({})
  },
  programme: {
    type: Object as PropType<Programme>,
    default: () => ({})

  },
  level: {
    type: Object as PropType<Level>,
    default: () => ({})

  },
  result: {
    type: Array as PropType<StudentResult['results']>,
    default: () => []
  },
  studentResult: {
    type: Object as PropType<StudentResult>,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }

})

// State management
const currentDate = getCurrentDateAndTime()



// Utility function to determine grade styling
const getGradeClass = (grade) => {
  if (!grade) return ''

  switch (grade.toUpperCase()) {
    case 'A':
      return 'grade-a'
    case 'B':
      return 'grade-b'
    case 'C':
      return 'grade-c'
    case 'D':
      return 'grade-d'
    case 'E':
      return 'grade-e'
    case 'F':
      return 'grade-f'
    default:
      return ''
  }
}

// Print functionality
const printResult = () => {
  window.print()
}

</script>

<style scoped>
/* CSS Variables for consistent theming */
:root {
  --primary: #0d47a1;
  --primary-light: #1976d2;
  --primary-dark: #002171;
  --secondary: #e3f2fd;
  --success: #4caf50;
  --warning: #ff9800;
  --danger: #f44336;
  --neutral: #757575;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --text-primary: #212121;
  --text-secondary: #757575;
  --animation-timing: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Print-specific styles */
@media print {
  .print-result-container {
    padding: 0;
    box-shadow: none;
  }

  .action-buttons {
    display: none;
  }

  /* Ensure proper page breaks */
  .results-section {
    page-break-inside: avoid;
  }

  /* Remove animations for print */
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Container styling */
.print-result-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

/* Header styling */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.university-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite;
  background-size: 200% 100%;
}

.result-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
  animation: fadeIn 0.8s var(--animation-timing);
}

.result-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-light), var(--primary-dark));
  border-radius: 3px;
  animation: expandWidth 1s var(--animation-timing) forwards;
}

/* Student Info Section */
.student-info-section {
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  animation: fadeIn 0.8s var(--animation-timing);
}

.info-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.info-row {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  border-bottom: none;
}

.info-cell {
  flex: 1;
  padding: 1rem;
  display: flex;
  border-right: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.info-cell:last-child {
  border-right: none;
}

.info-cell:hover {
  background-color: rgba(227, 242, 253, 0.3);
}

.info-label {
  font-weight: 600;
  color: var(--text-secondary);
  width: 120px;
  flex-shrink: 0;
}

.info-value {
  font-weight: 500;
  color: var(--text-primary);
  flex-grow: 1;
}

/* Results Table Section */
.results-section {
  margin-bottom: 2rem;
  animation: fadeUp 0.8s var(--animation-timing);
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--primary);
  color: white;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border: none;
  transition: background-color 0.3s;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.3s, transform 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(227, 242, 253, 0.5) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border: none;
  border-bottom: 1px solid var(--border-color);
}

:deep(.p-datatable .p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
}

/* Grade styling */
.grade {
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  min-width: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.grade:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grade-a {
  background-color: rgba(76, 175, 80, 0.2);
  color: #2e7d32;
}

.grade-b {
  background-color: rgba(33, 150, 243, 0.2);
  color: #1565c0;
}

.grade-c {
  background-color: rgba(255, 152, 0, 0.2);
  color: #ef6c00;
}

.grade-d,
.grade-e {
  background-color: rgba(255, 87, 34, 0.2);
  color: #d84315;
}

.grade-f {
  background-color: rgba(244, 67, 54, 0.2);
  color: #c62828;
}

/* GPA Summary Section */
.gpa-summary {
  margin-top: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  animation: fadeIn 1s var(--animation-timing);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-row {
  display: flex;
  text-align: center;
}

.summary-row:first-child {
  background-color: var(--primary);
  color: white;
  font-weight: 600;
}

.summary-cell {
  flex: 1;
  padding: 0.75rem 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-row:first-child .summary-cell {
  border-right-color: rgba(255, 255, 255, 0.2);
}

.summary-row:not(:first-child) .summary-cell {
  border-right-color: var(--border-color);
}

.summary-cell:last-child {
  border-right: none;
}

.summary-values .summary-cell {
  font-weight: 600;
  color: var(--text-primary);
}

.cgpa {
  font-size: 1.1rem;
  color: var(--primary) !important;
  font-weight: 700 !important;
}

/* Watermark */
.watermark {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.7;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  animation: fadeIn 1s var(--animation-timing);
}

.print-button,
.download-button {
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s !important;
}

.print-button:hover,
.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Skeleton Loading Animation */
.skeleton-container {
  animation: pulse 1.5s infinite alternate;
}

.skeleton-label,
.skeleton-value,
.skeleton-cell,
.skeleton-header-cell,
.skeleton-gpa-cell {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-label {
  height: 16px;
  width: 80px;
}

.skeleton-value {
  height: 16px;
  width: 120px;
  margin-left: 10px;
}

.skeleton-table-header {
  display: flex;
  padding: 1rem;
  background-color: #f5f5f5;
}

.skeleton-header-cell {
  flex: 1;
  height: 24px;
  margin: 0 0.5rem;
}

.skeleton-table-row {
  display: flex;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-cell {
  flex: 1;
  height: 16px;
  margin: 0 0.5rem;
}

.skeleton-gpa {
  margin-top: 1.5rem;
}

.skeleton-gpa-header,
.skeleton-gpa-values {
  display: flex;
  padding: 0.75rem 1rem;
}

.skeleton-gpa-header {
  background-color: #f5f5f5;
}

.skeleton-gpa-cell {
  flex: 1;
  height: 16px;
  margin: 0 0.5rem;
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

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expandWidth {
  from {
    width: 0;
  }

  to {
    width: 80px;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Vue Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s var(--animation-timing);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s var(--animation-timing);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .print-result-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .university-name {
    font-size: 1.5rem;
  }

  .result-title {
    font-size: 1.2rem;
  }

  .info-row {
    flex-direction: column;
  }

  .info-cell {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .info-row:last-child .info-cell:last-child {
    border-bottom: none;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
