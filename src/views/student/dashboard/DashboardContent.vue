<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Dashboard</h1>
      <div class="flex items-center gap-4">
        <ReUsableSelect />
        <ReUsableSelect />
      </div>
    </div>
    <!-- page content -->

    <div class="grid grid-cols-12 h-[calc(100vh-180px)] gap-4">
      <!-- information -->
      <div class="col-span-5 bg-[#fff] rounded-xl flex justify-center">
        <UserInformation :first-label="'Name'" :second-label="'Matric No'" :third-label="'Level'" />
      </div>
      <!-- Bio Data -->

      <div class="col-span-7 w-full rounded-xl flex justify-center">
        <StudentInformation />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ReUsableSelect from '@/views/select/ReUsableSelect.vue'
import UserInformation from './UserInformation.vue'
import StudentInformation from './StudentInformation.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
const { getStudentInformation } = useStudentDashboard()

onMounted(async () => {
  await getStudentInformation()
})
</script>

<style scoped></style>
