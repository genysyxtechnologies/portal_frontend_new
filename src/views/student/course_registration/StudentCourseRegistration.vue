<template>
  <div class="course-registration-container">
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Course Registration</h1>
        <p class="page-subtitle">Manage your academic courses and registration forms</p>
        <div class="header-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-line"></div>
        </div>
      </div>

      <div class="status-indicators">
        <div class="status-badge" :class="{ 'status-active': hasActiveSession }">
          <i class="pi pi-calendar status-icon"></i>
          <span>{{ hasActiveSession ? 'Session Active' : 'No Active Session' }}</span>
        </div>
        <div class="status-badge" :class="{ 'status-active': hasRegisteredCourses }">
          <i class="pi pi-check-circle status-icon"></i>
          <span>{{ hasRegisteredCourses ? 'Courses Registered' : 'No Courses Registered' }}</span>
        </div>
      </div>
    </div>

    <div class="main-content-card">
      <Ta-bs v-model:value="tabCount" class="tabs-container">
        <TabList class="tab-list">
          <T-ab
            v-for="(tab, index) in tabs"
            :key="index"
            :value="index.toString()"
            class="tab-item"
            :class="{
              'tab-active': tabCount === index.toString(),
              'tab-inactive': tabCount !== index.toString(),
            }"
          >
            <div class="tab-content">
              <span class="tab-icon" v-if="index === 0">
                <i class="pi pi-list"></i>
              </span>
              <span class="tab-icon" v-else>
                <i class="pi pi-file"></i>
              </span>
              <span class="tab-label">{{ tab.label }}</span>
            </div>
            <span v-if="tabCount === index.toString()" class="tab-indicator"></span>
          </T-ab>
        </TabList>
        <transition name="fade-slide" mode="out-in">
        <TabPanels class="tab-panels">

            <TabPanel
              v-for="(tab, index) in tabs"
              :key="index"
              :value="index.toString()"
              class="tab-panel"
            >
              <component
                :is="tab.component"
                :user="user"
                v-model:selectedSession="selectedSession"
                v-model:selectedSemester="selectedSemester"
                :sessionOptions="sessions"
                :academicSession="selectedSession?.name"
                :semesterOptions="semesters"
                :registeredCourses="courses?.registeredCourses"
                :courseLoading="courseLoading"
                @course-selected="handleRegistredCoursesCheckboxChange"
                @remove-selected="handleCourseRemovalCheckBox"
                @register-selected="handleRegistration"
                :courseList="courses?.courseList!"
                :currentDateAndTime="currentDateAndTime"
                :documents="documents"
                v-model:selectedDocument="selectedDocument"
                @on-download="handleDownload"
                :headTitle="headTitle"
                :subTitle="subTitle"
                :loading="courseLoading"
              />
            </TabPanel>

        </TabPanels>
      </transition>
      </Ta-bs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CourseRegistration from './CourseRegistration.vue'
import CourseRegistrationForm from './CourseRegistrationForm.vue'
import { useStudentCourses } from '@/services/student/useStudentCourses'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { getCurrentDateAndTime } from '@/utils/dateFormater'
import { computed } from 'vue'
const currentDateAndTime = getCurrentDateAndTime()
const {
  fetchAllCoursesForStudent,
  registerStudentCourse,
  removeStudentCourse,
  courses,
  selectedSession,
  selectedSemester,
  loading: courseLoading,
  documents,
  selectedDocument,
  tabCount,
  downloadStudentCourseForm,
  headTitle,
  subTitle,
} = useStudentCourses()
const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const semesters = ref([])

// handle course selection
const handleRegistredCoursesCheckboxChange = async (course: any) => {
  await registerStudentCourse(
    user.value?.username!,
    course.id,
    selectedSession.value!.id,
    selectedSemester.value!.id,
  )
  console.log('Selected course:', course)
}

const handleCourseRemovalCheckBox = async (course: any) => {
  await removeStudentCourse(
    user.value?.username!,
    course.id,
    selectedSession.value!.id,
    selectedSemester.value!.id,
  )
  console.log('Removed course:', course)
}

const handleDownload = async (document: number) => {
  await downloadStudentCourseForm(
    user.value?.id!,
    selectedSession.value!.id,
    selectedSemester.value!.id,
    document,
  )
}

// handle registration
const handleRegistration = (courses: any) => {
  console.log('Registering courses:', courses)
}

// load the sessions and semesters
onMounted(async () => {
  await getStudentInformation()
  await getSessions()
})


// watch for session changes and update semester
watch(
  () => selectedSession.value,
  (value) => {
    if (selectedSemester.value) {
      selectedSemester.value = null
    }
    semesters.value = value.currentSemesters
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

const tabs = [
  { label: 'Registration', component: CourseRegistration },
  { label: 'Forms', component: CourseRegistrationForm },
]

// Computed properties for status indicators
const hasActiveSession = computed(() => {
  return selectedSession.value && selectedSemester.value;
});

const hasRegisteredCourses = computed(() => {
  return courses.value?.registeredCourses && courses.value.registeredCourses.length > 0;
});

// watch for selected documents (COURSE FORM, EXAM CARD)
watch(
  () => selectedDocument.value,
  (value) => {
    console.log('Selected document:', value)
  },
)

</script>

<style scoped>
/* Main Container Styles */
.course-registration-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  animation: fadeIn 0.8s ease-out forwards;
}

/* Header Section Styles */
.header-section {
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  animation: slideInFromLeft 0.6s ease-out forwards;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1rem;
  max-width: 500px;
  animation: fadeIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.header-decoration {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  animation: expandWidth 1s ease-out 0.3s forwards;
  width: 0;
  overflow: hidden;
}

.decoration-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  margin-right: 8px;
  flex-shrink: 0;
}

.decoration-line {
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, rgba(59, 130, 246, 0.3));
  width: 100px;
  border-radius: 3px;
}

.status-indicators {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease-out 0.5s forwards;
  opacity: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.status-active {
  background-color: #ecfdf5;
  color: #059669;
}

.status-active .status-icon {
  color: #10b981;
}

.status-icon {
  font-size: 1rem;
}

/* Main Content Card Styles */
.main-content-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInFromBottom 0.7s ease-out forwards;
  transform-origin: center;
  position: relative;
}

.main-content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  z-index: 1;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s ease-out;
}

.main-content-card:hover::before {
  transform: scaleX(1);
}

/* Tabs Container Styles */
.tabs-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  background-color: #f8fafc;
  padding: 0 1rem;
}

.tab-item {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.tab-active {
  color: #3b82f6;
}

.tab-inactive {
  color: #64748b;
}

.tab-inactive:hover {
  color: #334155;
  background-color: rgba(241, 245, 249, 0.8);
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  animation: slideIn 0.3s ease-out forwards;
}

.tab-panels {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  background-color: #ffffff;
}

.tab-panel {
  height: 100%;
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

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

@keyframes expandWidth {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 150px;
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Transition Effects */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .tab-item {
    padding: 1rem;
  }

  .tab-content {
    gap: 0.5rem;
  }

  .tab-panels {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .tab-label {
    display: none;
  }

  .tab-icon {
    font-size: 1.25rem;
  }

  .tab-item {
    padding: 1rem 1.5rem;
  }
}
</style>
