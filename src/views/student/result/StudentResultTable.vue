<template>
  <div class="academic-dashboard relative" ref="resultTableRef">
    <SpinningAnimation v-if="loading" :loading="loading" :head-title="'Academic Performance'"
      class="absolute inset-0" />
    <div class="profile-card animate-fade-in">
      <div class="profile-header">
        <div class="profile-avatar">
          <i class="pi pi-user text-4xl text-white"></i>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ name }}</h1>
          <p class="profile-id">{{ username }}</p>
        </div>
      </div>

      <div class="profile-grid">
        <div v-for="(item, index) in profileItems" :key="index" class="profile-item"
          :style="{ 'transition-delay': `${index * 50}ms` }">
          <div class="item-icon">
            <i :class="item.icon"></i>
          </div>
          <div>
            <p class="item-label">{{ item.label }}</p>
            <p class="item-value">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="performance-section animate-fade-in" style="animation-delay: 100ms">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-table"></i> Academic Performance
        </h2>
        <div class="gpa-display">
          <span class="gpa-label">Current GPA:</span>
          <span class="gpa-value">{{ gpa }}</span>
        </div>
        <div class="gpa-display">
          <span class="gpa-label">CGPA:</span>
          <span class="gpa-value">{{ cgpa }}</span>
        </div>
      </div>


      <div class="table-container">
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
              <span :class="['score', getScoreClass(data.ca)]">{{
                formatScore(data.ca)
              }}</span>
              <span v-if="data.ca2" :class="['score', getScoreClass(data.ca2)]">{{
                formatScore(data.ca2)
              }}</span>
            </template>
          </Column>
          <Column field="exam" header="Exam">
            <template #body="{ data }">
              <span :class="['score', getScoreClass(data.exam)]">{{
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
                {{ getStatusText(data.total) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineExpose, type PropType } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { StudentResult } from "@/types/student/result.information";
import SpinningAnimation from "@/views/spinner/SpinningAnimation.vue";

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
          <h1>NASARAWA STATE UNIVERSITY, KEFFI</h1>
          <h2>STUDENT ACADEMIC RECORD</h2>
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
                      ${getStatusText(result.total)}
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


const profileItems = computed(() => [
  {
    label: "Faculty",
    value: props.department?.faculty.name,
    icon: "pi pi-building",
  },
  {
    label: "Department",
    value: props.department?.name,
    icon: "pi pi-briefcase",
  },
  { label: "Programme", value: props.programme, icon: "pi pi-book" },
  { label: "Level", value: props.level, icon: "pi pi-sort-numeric-up" },
  {
    label: "Academic Session",
    value: props.session,
    icon: "pi pi-calendar",
  },
  { label: "Date", value: props.currentDate, icon: "pi pi-clock" },
]);

const formatScore = (score: null | number) => {
  return score ? Number(score).toFixed(1) : '-';
};

const getScoreClass = (score: string | number) => {
  const num = score === "-" ? 0 : Number(score);
  if (num >= 70) return "score-excellent";
  if (num >= 60) return "score-good";
  if (num >= 50) return "score-average";
  return "score-poor";
};

const getGradeClass = (grade: string) => {
  if (grade === "A") return "grade-a";
  if (grade === "B") return "grade-b";
  if (grade === "C") return "grade-c";
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
</script>

<style scoped>
/* Base Styles */
.academic-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: "Inter", system-ui, sans-serif;
}

/* Profile Card */
.profile-card {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-id {
  color: #d1d5db;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  gap: 0.125rem;
  padding: 0.125rem;
  background: rgba(255, 255, 255, 0.1);
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #374151;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s forwards;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
}

.item-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.item-value {
  font-weight: 600;
}

/* Performance Section */
.performance-section {
  background-color: white;
  border-radius: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gpa-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
}

.gpa-label {
  color: #6b7280;
}

.gpa-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
}

.table-container {
  padding: 0.5rem;
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
  font-family: "Monaco", monospace;
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
@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-avatar {
    margin-bottom: 1rem;
  }

  :deep(.academic-table .p-datatable-thead) {
    display: none;
  }

  :deep(.academic-table .p-datatable-tbody > tr > td) {
    display: block;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    text-align: right;
  }

  :deep(.academic-table .p-datatable-tbody > tr > td:before) {
    content: attr(data-label);
    float: left;
    font-weight: 600;
    color: #6b7280;
  }

  :deep(.academic-table .p-paginator) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
