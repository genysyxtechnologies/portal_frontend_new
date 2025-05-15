<template>
  <div class="flex flex-col gap-6">
    <h1 class="head-title">Course Registration</h1>
    <div
      class="lg:col-span-7 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <Ta-bs v-model:value="tabCount" class="h-full flex flex-col">
        <TabList class="flex border-b border-gray-200">
          <T-ab v-for="(tab, index) in tabs" :key="index" :value="index.toString()"
            class="px-6 py-3  text-sm font-medium h-[5rem] relative transition-all duration-200" :class="{
              'text-primary-500': tabCount === index.toString(),
              'text-gray-500 hover:text-gray-700': tabCount !== index.toString()
            }">
            {{ tab.label }}
            <span v-if="tabCount === index.toString()"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-underline"></span>
          </T-ab>
        </TabList>

        <TabPanels class="flex-1 overflow-auto p-6">
          <div name="fade-slide" mode="out-in">
            <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index.toString()" class="h-full">
              <component :is="tab.component" :user="user" v-model:selectedSession="selectedSession"
                v-model:selectedSemester="selectedSemester" :sessionOptions="sessions"
                :academicSession="selectedSession?.name" :semesterOptions="semesters"
                :registeredCourses="courses?.registeredCourses" :courseLoading="courseLoading"
                @course-selected="handleRegistredCoursesCheckboxChange" @remove-selected="handleCourseRemovalCheckBox"
                @register-selected="handleRegistration" :courseList="courses?.courseList!"
                :currentDateAndTime="currentDateAndTime" :documents="documents"
                v-model:selectedDocument="selectedDocument" @on-download="handleDownload" :headTitle="headTitle"
                :subTitle="subTitle" :loading="courseLoading" />

            </TabPanel>
          </div>
        </TabPanels>
      </Ta-bs>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import CourseRegistration from './CourseRegistration.vue';
import CourseRegistrationForm from './CourseRegistrationForm.vue';
import { useStudentCourses } from '@/services/student/useStudentCourses';
import { useStudentDashboard } from '@/services/student/useStudentDashboard';
import { getCurrentDateAndTime } from '@/utils/dateFormater';
const currentDateAndTime = getCurrentDateAndTime()
const { fetchAllCoursesForStudent, registerStudentCourse, removeStudentCourse, courses, selectedSession, selectedSemester, loading: courseLoading, documents, selectedDocument, tabCount, downloadStudentCourseForm, headTitle, subTitle } = useStudentCourses();
const { user, getStudentInformation, getSessions, sessions } = useStudentDashboard()
const semesters = ref([])



// handle course selection
const handleRegistredCoursesCheckboxChange = async (course: any) => {
  await registerStudentCourse(user.value?.username!, course.id, selectedSession.value!.id, selectedSemester.value!.id)
  console.log('Selected course:', course)
}

const handleCourseRemovalCheckBox = async (course: any) => {
  await removeStudentCourse(user.value?.username!, course.id, selectedSession.value!.id, selectedSemester.value!.id)
  console.log('Removed course:', course)
}

const handleDownload = async (document: number) => {
  await downloadStudentCourseForm(user.value?.id!, selectedSession.value!.id, selectedSemester.value!.id)
}

// handle registration
const handleRegistration = (courses: any) => {
  console.log('Registering courses:', courses)
}


// load the sessions and semesters
onMounted(async () => {
  await getStudentInformation()
  await getSessions()
  console.log('THIS IS THE SELECTED USER: ', user.value)
})

watch(
  () => selectedSession.value,
  (value) => {
    if (selectedSemester.value) {
      selectedSemester.value = null
    }
    console.log("THIS IS THE SELECTED SESSION: ", value)
    semesters.value = value.currentSemesters
  },
)

watch(() => [selectedSession.value, selectedSemester.value], async ([session, semester]) => {
  if (session && semester && user.value) {
    console.log('THIS IS THE SELECTED SEMESTER: ', semester)
    await fetchAllCoursesForStudent(user.value.username, session.id, semester.id)
  }
})


const tabs = [
  { label: 'Registration', component: CourseRegistration },
  { label: 'Forms', component: CourseRegistrationForm },
];



watch(() => selectedDocument.value, (value) => {
  console.log('Selected document:', value)
})


// fetch data immediately the component mounted
onMounted(async () => {
  await fetchAllCoursesForStudent('', '', '');
})



</script>
