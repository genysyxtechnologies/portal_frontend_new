<template>
  <div class="academic-dashboard relative">
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
import { computed, ref, type PropType } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import type { StudentResult } from "@/types/student/result.information";
import SpinningAnimation from "@/views/spinner/SpinningAnimation.vue";



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
