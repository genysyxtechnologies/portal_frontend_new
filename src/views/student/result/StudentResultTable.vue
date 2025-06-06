<template>
  <div class="academic-dashboard w-full relative" ref="resultTableRef">
    <div class="performance-section animate-fade-in" :class="{ 'loading-state': loading }">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <p class="loading-text">Loading academic results...</p>
        </div>
      </div>

      <!-- Table Content -->
      <div v-else class="table-container">
        <DataTable :value="results" class="p-datatable-striped academic-table" :paginator="true" :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} courses" responsiveLayout="scroll">
          <Column field="course.courseCode" header="Course Code">
            <template #body="{ data }">
              <span class="course-code">{{ data.course.courseCode }}</span>
            </template>
          </Column>
          <Column field="course.creditUnit" header="Unit">
            <template #body="{ data }">
              <span class="credit-badge">{{ data.course.creditUnit }}</span>
            </template>
          </Column>
          <Column field="ca" header="CA">
            <template #body="{ data }">
              <span :class="['credit-badge']">{{
                formatScore(data.ca)
              }}</span>
            </template>
          </Column>
          <Column field="ca" header="CA 2">
            <template #body="{ data }">
              <span v-if="data.ca2" :class="['credit-badge']">{{
                  formatScore(data.ca2)
                }}</span>
            </template>
          </Column>
          <Column field="exam" header="Exam">
            <template #body="{ data }">
              <span :class="['credit-badge']">{{
                data.exam
              }}</span>
            </template>
          </Column>
          <Column field="total" header="Total">
            <template #body="{ data }">
              <span :class="['score', getScoreClass(data.total)]">{{
                data.total
              }}</span>
            </template>
          </Column>
          <Column field="grade" header="Grade">
            <template #body="{ data }">
              <span :class="['grade-badge', getGradeClass(data.grade)]">{{
                data.grade
              }}</span>
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <span class="status-badge" :class="getStatusClass(data.total)">
                {{ getStatusTextByGrade(data.grade) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, type PropType } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { StudentResult } from "@/types/student/result.information";

const resultTableRef = ref<HTMLElement | null>(null);

// Method to print only this component
const printTable = () => {
  if (!resultTableRef.value) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Create a custom HTML structure that matches the screenshot design
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Result</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1e293b;
          background-color: white;
          padding: 20px;
          line-height: 1.5;
        }

        .print-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .university-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
        }

        .university-header h1 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1e40af;
        }

        .university-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .student-profile {
          background-color: #3b82f6;
          border-radius: 12px;
          padding: 20px;
          color: white;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
          position: relative;
          overflow: hidden;
        }

        .student-profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .student-avatar {
          width: 60px;
          height: 60px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .student-name {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .student-id {
          font-size: 14px;
          opacity: 0.9;
        }

        .student-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .info-card {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 15px;
        }

        .info-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .info-card-icon {
          width: 30px;
          height: 30px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .info-card-label {
          font-size: 12px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-card-value {
          font-size: 16px;
          font-weight: 600;
        }

        .academic-performance {
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }

        .performance-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
        }

        .performance-title-icon {
          margin-right: 8px;
        }

        .gpa-container {
          display: flex;
          gap: 20px;
        }

        .gpa-item {
          text-align: right;
        }

        .gpa-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .gpa-value {
          font-size: 20px;
          font-weight: bold;
          color: #3b82f6;
        }

        .result-table {
          width: 100%;
          border-collapse: collapse;
        }

        .result-table th {
          background-color: #f8fafc;
          color: #334155;
          font-weight: 600;
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .result-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .course-code {
          color: #3b82f6;
          font-weight: 500;
        }

        .unit-cell {
          text-align: center;
          background-color: #dbeafe;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .score-cell {
          font-weight: 500;
        }

        .grade-a {
          background-color: #d1fae5;
          color: #065f46;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .grade-b {
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .grade-c {
          background-color: #fef9c3;
          color: #854d0e;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .status-excellent {
          background-color: #d1fae5;
          color: #065f46;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-passed {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-container {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="university-header">

        </div>

        <div class="student-profile">
          <div class="student-profile-header">
            <div class="student-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 class="student-name">${props.name}</h2>
              <p class="student-id">${props.username}</p>
            </div>
          </div>

          <div class="student-info-grid">
            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Faculty</div>
              <div class="info-card-value">${props.department?.faculty?.name || 'Natural And Applied Sciences'}</div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Department</div>
              <div class="info-card-value">${props.department?.name || 'Computer Science'}</div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Programme</div>
              <div class="info-card-value">${props.programme || 'B.Sc. Computer Science'}</div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Level</div>
              <div class="info-card-value">${props.level || '100'}</div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Academic Session</div>
              <div class="info-card-value">${props.session || '2022/2023'}</div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <div class="info-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
              <div class="info-card-label">Date</div>
              <div class="info-card-value">${props.currentDate || new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div class="academic-performance">
          <div class="performance-header">
            <h3 class="performance-title">
              <span class="performance-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              Academic Performance
            </h3>

            <div class="gpa-container">
              <div class="gpa-item">
                <div class="gpa-label">Current GPA:</div>
                <div class="gpa-value">${props.gpa || '4.00'}</div>
              </div>

              <div class="gpa-item">
                <div class="gpa-label">CGPA:</div>
                <div class="gpa-value">${props.cgpa || '4.00'}</div>
              </div>
            </div>
          </div>

          <table class="result-table">
            <thead>
              <tr>
                <th>COURSE CODE</th>
                <th>UNIT</th>
                <th>CA</th>
                <th>EXAM</th>
                <th>TOTAL</th>
                <th>GRADE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${props.results?.map(result => `
                <tr>
                  <td class="course-code">${result.course.courseCode}</td>
                  <td><div class="unit-cell">${result.course.creditUnit}</div></td>
                  <td class="score-cell">${result.ca || '-'}</td>
                  <td class="score-cell">${result.exam}</td>
                  <td class="score-cell">${result.total}</td>
                  <td>
                    <div class="grade-${result.grade.toLowerCase()}">${result.grade}</div>
                  </td>
                  <td>
                    <div class="status-${getStatusText(result.total).toLowerCase().replace(' ', '-')}">
                      ${getStatusTextByGrade(result.grade)}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;

  // Write to the new window and print
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();

  // Wait for resources to load before printing
  setTimeout(() => {
    printWindow.focus(); // Focus the window before printing
    printWindow.print();
  }, 1000); // Give time for styles to load
};

// Expose the print method to parent components
defineExpose({ printTable });

const props = defineProps({
  name: String,
  username: String,
  session: String,
  currentDate: String,
  department: Object,
  level: String,
  programme: String,
  gpa: String,
  cgpa: String,
  loading: {
    type: Boolean,
    default: false,
  },

  results: {
    type: Array as PropType<StudentResult['results']>,
    required: true,
  },
});



const formatScore = (score: null | number) => {
  return score //? Number(score).toFixed(1) : '-';
};

const getScoreClass = (score: string | number, grade: string | null = null) => {
  const num = score === "-" ? 0 : Number(score);
  if (num >= 60) return "score-excellent";
  if (num >= 50) return "score-good";
  if (num >= 45 && grade && grade !== 'F') return "score-average";
  return "score-poor";
};

const getGradeClass = (grade: string) => {
  if (grade === "A" || grade === 'B') return "grade-a";
  if (grade === "C") return "grade-b";
  if (grade === "D") return "grade-c";
  return "grade-f";
};

const getStatusClass = (total: number) => {
  if (total >= 70) return "status-passed";
  if (total >= 50) return "status-passed";
  return "status-failed";
};

const getStatusText = (total: number) => {
  if (total >= 70) return "Excellent";
  if (total >= 50) return "Passed";
  return "Failed";
};

const getStatusTextByGrade = (grade: string) => {
  if (grade == 'A' || grade == 'B') return "Excellent";
  if (grade == 'C') return "Good";
  if (grade == 'D') return "Pass";
  if (grade == 'E') return "Considerable";
  return "Failed";
};
</script>

<style scoped>
/* Base Styles */
.academic-dashboard {
  font-family: "Inter", system-ui, sans-serif;
}

/* Performance Section */
.performance-section {
  background: transparent;
  width: 100%;
}

.performance-section.loading-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  padding: 0 0 1.5rem 0;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gpa-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.gpa-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gpa-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.gpa-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
}

/* Loading Styles */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  flex: 1;
}

.loading-spinner {
  text-align: center;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0;
}

.table-container {
  width: 100%;
}

/* Table Styles */
:deep(.academic-table .p-datatable-header) {
  background-color: transparent;
  border: none;
  color: #6b7280;
  font-weight: 500;
}

:deep(.academic-table .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05rem;
}

:deep(.academic-table .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

:deep(.academic-table .p-datatable-tbody > tr:hover) {
  background-color: #eff6ff;
}

:deep(.academic-table .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem;
}

.course-code {
  font-weight: bold;
  color: #2563eb;
}

.credit-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0369a1;
  font-weight: bold;
}

.score {
  font-weight: 600;
}

.score-excellent {
  color: #16a34a;
}

.score-good {
  color: #2563eb;
}

.score-average {
  color: #d97706;
}

.score-poor {
  color: #dc2626;
}

.grade-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-weight: bold;
}

.grade-a {
  background-color: #d1fae5;
  color: #065f46;
}

.grade-b {
  background-color: #bfdbfe;
  color: #1e40af;
}

.grade-c {
  background-color: #fef08a;
  color: #78350f;
}

.grade-f {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-passed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-failed {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Paginator Styles */
:deep(.academic-table .p-paginator) {
  background-color: transparent;
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

:deep(.academic-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #2563eb;
  color: white;
}

:deep(.academic-table .p-paginator .p-paginator-pages .p-paginator-page:not(.p-highlight):hover) {
  background-color: #eff6ff;
  color: #2563eb;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .gpa-container {
    align-self: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .section-header {
    padding: 0 0 1rem 0;
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .gpa-container {
    width: 100%;
    justify-content: space-between;
  }

  .gpa-display {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }

  .gpa-label {
    font-size: 0.75rem;
  }

  .gpa-value {
    font-size: 1.1rem;
  }

  .loading-container {
    padding: 2rem 1rem;
  }

  .loading-text {
    font-size: 0.8rem;
  }

  /* Mobile Table Styles */
  :deep(.academic-table) {
    font-size: 0.875rem;
  }

  :deep(.academic-table .p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
  }

  :deep(.academic-table .p-datatable-thead > tr > th) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }

  .course-code {
    font-size: 0.8rem;
  }

  .credit-badge {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .grade-badge {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .status-badge {
    padding: 0.125rem 0.5rem;
    font-size: 0.7rem;
  }

  .score {
    font-size: 0.875rem;
  }

  /* Mobile Paginator */
  :deep(.academic-table .p-paginator) {
    padding: 0.75rem 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  :deep(.academic-table .p-paginator .p-paginator-current) {
    order: -1;
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1rem;
  }

  .gpa-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .gpa-display {
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 0.5rem;
  }

  /* Stack table horizontally on very small screens */
  :deep(.academic-table .p-datatable-wrapper) {
    overflow-x: auto;
  }

  :deep(.academic-table) {
    min-width: 600px;
  }
}

@media (max-width: 480px) {
  .section-header {
    padding: 0 0 0.75rem 0;
    margin-bottom: 0.75rem;
  }

  .section-title {
    font-size: 0.9rem;
    gap: 0.375rem;
  }

  .section-title i {
    font-size: 0.8rem;
  }

  .gpa-label {
    font-size: 0.7rem;
  }

  .gpa-value {
    font-size: 1rem;
  }

  .loading-container {
    padding: 1.5rem 0.75rem;
  }

  .spinner-ring {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }

  .loading-text {
    font-size: 0.75rem;
  }

  /* Very small mobile adjustments */
  :deep(.academic-table) {
    font-size: 0.8rem;
    min-width: 550px;
  }

  :deep(.academic-table .p-datatable-thead > tr > th) {
    padding: 0.5rem 0.25rem;
    font-size: 0.7rem;
  }

  :deep(.academic-table .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
  }

  .credit-badge,
  .grade-badge {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.7rem;
  }

  .status-badge {
    padding: 0.125rem 0.375rem;
    font-size: 0.65rem;
  }

  .course-code {
    font-size: 0.75rem;
  }

  .score {
    font-size: 0.8rem;
  }
}
</style>
