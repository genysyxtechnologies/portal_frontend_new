<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">My Results</h1>
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="w-full md:w-auto">
          <Sel-ect v-model="selectedSession" :options="sessions" :size="'large'" optionLabel="name"
            placeholder="Select Session" class="w-full md:w-[180px]" :pt="{
              root: { class: 'bg-white/90 backdrop-blur-sm border-none rounded-lg shadow-sm' },
              input: { class: 'font-medium text-gray-700' },
            }" />
        </div>

        <div class="w-full md:w-auto">
          <Sel-ect v-model="selectedSemester" :options="semesters" :size="'large'" optionLabel="title"
            placeholder="Select Semester" class="w-full md:w-[180px]" :pt="{
              root: { class: 'bg-white/90 backdrop-blur-sm border-none rounded-lg shadow-sm' },
              input: { class: 'font-medium text-gray-700' },
            }" />
        </div>
        <ReUsableButtons :label="'Print'" @click="printResult" />
      </div>
    </div>

    <EmptySelection v-if="!selectedSession || !selectedSemester" empty-message="No Session Selected" />
    <div v-else>
      <div class="grid grid-cols-12  gap-4">
        <!-- information -->
        <div class="col-span-5 bg-[#fff] rounded-xl flex justify-center">
          <UserInformation :first-label="'Name'" :second-label="'Matric No'" :third-label="'Level'"
            :first-input="user?.name" :second-input="user?.username" :third-input="studentResult?.level?.title" />
        </div>
        <!-- Bio Data -->

        <div class="col-span-7 bg-[#fff] w-full rounded-xl flex justify-center">
          <StudentResultTable ref="resultTableRef" :name="user?.name" :username="user?.username" :session="selectedSession?.name"
            :current-date="currentDate" :department="user?.programme?.department" :level="studentResult?.level.title"
            :programme="user?.programme.name" :results="studentResult?.results" :loading="loading"
            :gpa="studentResult?.data.current.gpa" :cgpa="studentResult?.data.current.cgpa" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UserInformation from '../dashboard/UserInformation.vue'
import StudentResultTable from './StudentResultTable.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { useStudentResult } from '@/services/student/useStudentResult'
import { getCurrentDateAndTime } from '@/utils/dateFormater'
import EmptySelection from '@/views/empty/EmptySelection.vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'

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
      console.log(user.value.username, session.id, semester.id)
      await fetchStudentResult(user.value.username, session.id, semester.id)
      console.log("THIS IS NOW THE RESULT: ", studentResult.value)
    }
  },
)
</script>
