<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Dashboard</h1>
      <div class="flex items-center gap-4">
        <Sel-ect :size="'large'" v-model="selectedSession" :options="sessions" optionLabel="name"
          placeholder="Select Session" class="card  w-[300px]" />

        <Sel-ect :size="'large'" v-model="selectedSemester" :options="semesters" optionLabel="title"
          placeholder="Select Semester" class="card w-[300px]" />
      </div>
    </div>
    <!-- page content -->

    <div class="grid grid-cols-12 h-[calc(100vh-180px)] gap-4">
      <!-- information -->
      <div class="col-span-5 bg-[#fff] rounded-xl flex justify-center">
        <UserInformation :first-label="'Name'" :second-label="'Matric No'" :third-label="'Level'"
          :first-input="user?.name" :second-input="user?.username" :third-input="user?.level.title" />
      </div>


      <!-- Bio Data -->

      <div class="col-span-7 w-full rounded-xl flex justify-center relative">
        <SpinningAnimation v-if="loading" :loading="loading" />
        <StudentInformation v-else :state="user?.information.state.name" :local-government="user?.information.lga.name"
          :email="user?.email" :phone="user?.phone" :level="user?.level.title"
          :year-of-admission="user?.yearOfAdmission.name" :programme-type="user?.programme.programmeType.name"
          :faculty="user?.programme.department.faculty.name" :department="user?.programme.department.name"
          :programme="user?.programme.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UserInformation from './UserInformation.vue'
import StudentInformation from './StudentInformation.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'

const { user, getStudentInformation, getSessions, sessions, loading } = useStudentDashboard()
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
    semesters.value = value.semesters

  },
)

watch(() => [selectedSession.value, selectedSemester.value], ([session, semester]) => {
  if (session && semester) {
    console.log(session.id, semester.id)
  }
})

</script>

<style scoped></style>
